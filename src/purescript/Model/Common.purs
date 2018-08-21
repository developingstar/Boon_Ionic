module Model.Common
  ( class RequestContent
  , Decoder
  , Request
  , headers
  , send
  , showErrors
  , toAXRequest
  , validateAndDecode
  ) where

import Boon.Common

import Boon.Bridge (apiBaseUrl)
import Control.Alt ((<|>))
import Data.Array as Array
import Data.HTTP.Method (Method)
import Data.List.NonEmpty as List.NonEmpty
import Data.Maybe (isNothing, maybe)
import Data.MediaType.Common (applicationJSON)
import Data.String as String
import Effect.Class (liftEffect)
import Foreign (ForeignError(..), MultipleErrors, renderForeignError)
import Network.HTTP.Affjax (AffjaxResponse)
import Network.HTTP.Affjax as AX
import Network.HTTP.Affjax.Request as AXRequest
import Network.HTTP.Affjax.Response as AXResponse
import Network.HTTP.RequestHeader (RequestHeader(..))
import Network.HTTP.StatusCode (StatusCode(..))
import Simple.JSON (readJSON)
import Web.XHR.FormData (FormData)


type Decoder a = String -> Either MultipleErrors a

type Request a b =
  { path :: AX.URL
  , method :: Method
  , content :: Maybe a
  , decoder :: Decoder b
  }

class RequestContent a where
  toAXRequest :: a -> AXRequest.Request
  headers :: Maybe a -> Array RequestHeader

instance stringRequest :: RequestContent String where
  toAXRequest = AXRequest.String
  headers content =
    if isNothing content
    then []
    else [ContentType applicationJSON]

instance formRequest :: RequestContent FormData where
  toAXRequest = AXRequest.FormData
  headers _ = []

type ServerError =
  { detail :: String
  , title :: Maybe String
  , source :: Maybe { pointer :: String }
  }

send :: forall a b. RequestContent a => Request a b -> Aff (Either MultipleErrors b)
send request = do
  base <- liftEffect apiBaseUrl
  let content = map toAXRequest request.content
  let r =
        { method: Left request.method
        , url: base <> request.path
        , headers: headers request.content
        , content
        , username : Nothing
        , password : Nothing
        , withCredentials : true
        }
  map (validateAndDecode request.decoder) (AX.affjax AXResponse.string r)
    <|> (pure $ Left $ singleError "Server is unreachable")

showErrors :: MultipleErrors -> String
showErrors errors =
  errors
  |> List.NonEmpty.toList
  |> map renderForeignError
  |> Array.fromFoldable
  |> String.joinWith ", "

-- Returns either an error (when status code != 200 or content cannot be parsed)
-- or the decoded value.
validateAndDecode :: forall a. Decoder a -> AffjaxResponse String -> Either MultipleErrors a
validateAndDecode decode response =
  validateStatus response >>= decode

validateStatus :: AffjaxResponse String -> Either MultipleErrors String
validateStatus response =
  case response.status of
    StatusCode 200 -> Right response.response
    StatusCode 422 -> Left $ decodeServerError response.response
    StatusCode code -> Left $ singleError $ "Server responded with HTTP code " <> (show code) <> ": " <> response.statusText

-- Returns either error details returned by the server or JSON parsing error
-- if the server response was not parseable.
decodeServerError :: String -> MultipleErrors
decodeServerError s =
  let
    json :: Either MultipleErrors {errors :: Array ServerError}
    json = readJSON s

    showE :: ServerError -> String
    showE {detail, title: Just title, source: Just {pointer: pointer}} =
      title <> ": " <> pointer <> " " <> detail
    showE {detail} =
      detail

    defaultError = singleError "unknown error"
  in
  case json of
    Right {errors} ->
      errors
      |> map (showE >>> ForeignError)
      |> List.NonEmpty.fromFoldable
      |> maybe defaultError identity
    Left e ->
      singleError "problem parsing server error response"

singleError :: String -> MultipleErrors
singleError msg =
  List.NonEmpty.singleton $ ForeignError msg
