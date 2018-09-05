module Model.Deal (Deal, getOne, update) where

import Boon.Common

import Data.HTTP.Method (Method(..))
import Data.List.NonEmpty (NonEmptyList)
import Foreign (ForeignError)
import Model.Common (Decoder, Request)
import Model.Contact (Contact)
import Model.User (User)
import Simple.JSON (readJSON, writeJSON)


type Deal =
  { contact :: Contact
  , id :: Int
  , name :: String
  , owner :: Maybe User
  , stage_id :: Int
  , value :: Int
  }

decodeOne :: Decoder Deal
decodeOne s =
  let
    json :: Either (NonEmptyList ForeignError) {data :: {deal :: Deal}}
    json = readJSON s in
  map (\x -> x.data.deal) json

getOne :: Int -> Request String Deal
getOne id =
  { path: "/api/deals/" <> (show id)
  , method: GET
  , content: Nothing
  , decoder: decodeOne
  }

update :: Deal -> Request String Unit
update {id, name, value, stage_id} =
  { path: "/api/deals/" <> (show id)
  , method: PATCH
  , content: Just (writeJSON {deal: {name, value, stage_id}})
  , decoder: const (Right unit)
  }
