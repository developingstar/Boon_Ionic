module Test.Model.Common where

import Boon.Common

import Data.List.NonEmpty (fromFoldable)
import Data.Maybe (fromJust)
import Foreign (ForeignError(..), MultipleErrors)
import Model.Common (Decoder)
import Model.Common as Common
import Network.HTTP.Affjax (AffjaxResponse)
import Network.HTTP.StatusCode (StatusCode(..))
import Partial.Unsafe (unsafePartial)
import Test.Unit (TestSuite, describe, it)
import Test.Unit.Assert as Assert


constDecoder :: Decoder String
constDecoder =
  const $ Right "value"

response :: forall a. Int -> String -> a -> AffjaxResponse a
response code statusText content =
  { status: StatusCode code, headers: [], statusText, response: content }

errors :: Partial => Array String -> MultipleErrors
errors strings =
  strings
  |> map ForeignError
  |> fromFoldable
  |> fromJust

suite :: TestSuite
suite = do
  describe "validateAndDecode" do
    it "returns Right with the decoded value when server status is 200" do
      Assert.equal
        (Common.validateAndDecode constDecoder $ response 200 "OK" "{}")
        (Right "value")
    it "returns Left with server error when server status is 500" do
      Assert.equal
        (Common.validateAndDecode constDecoder $ response 500 "Oops" "{}")
        (Left $ unsafePartial $ errors ["Server responded with HTTP code 500: Oops"])
    it "returns Left with multiple simple errors when server status is 422" do
      Assert.equal
        (Common.validateAndDecode constDecoder $ response 422 "Nope" "{\"errors\": [{\"detail\": \"Problem 1\"},{\"detail\": \"Problem 2\"}]}")
        (Left $ unsafePartial $ errors ["Problem 1", "Problem 2"])
    it "returns Left with multiple complex errors when server status is 422" do
      Assert.equal
        (Common.validateAndDecode constDecoder $ response 422 "Nope" "{\"errors\": [{\"detail\": \"is not a number\", \"title\": \"Invalid attribute\", \"source\": {\"pointer\": \"phone\"}},{\"detail\": \"is too short\", \"title\": \"Invalid attribute\", \"source\": {\"pointer\": \"address\"}}]}")
        (Left $ unsafePartial $ errors ["Invalid attribute: phone is not a number", "Invalid attribute: address is too short"])
    it "returns Left with unknown error when server status is 422 but errors array is empty" do
      Assert.equal
        (Common.validateAndDecode constDecoder $ response 422 "Nope" "{\"errors\": []}")
        (Left $ unsafePartial $ errors ["unknown error"])
    it "returns Left with the parsing error when server status is 422 but content is malformed" do
      Assert.equal
        (Common.validateAndDecode constDecoder $ response 422 "Nope" "{\"bad\": \"server\"}")
        (Left $ unsafePartial $ errors ["problem parsing server error response"])
