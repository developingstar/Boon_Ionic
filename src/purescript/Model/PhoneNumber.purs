module Model.PhoneNumber (PhoneNumber, getAll) where

import Boon.Common

import Data.HTTP.Method (Method(..))
import Data.List.NonEmpty (NonEmptyList)
import Foreign (ForeignError)
import Model.Common (Decoder, Request)
import Simple.JSON (readJSON)


type PhoneNumber = { phone_number :: String }


decodeMany :: Decoder (Array PhoneNumber)
decodeMany s =
  let
    json :: Either (NonEmptyList ForeignError) {data :: {phone_numbers :: Array PhoneNumber}}
    json = readJSON s in
  map (\x -> x.data.phone_numbers) json

getAll :: Request String (Array PhoneNumber)
getAll =
  { path: "/api/phone_numbers"
  , method: GET
  , content: Nothing
  , decoder: decodeMany
  }
