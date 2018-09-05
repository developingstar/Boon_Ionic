module Model.Field (Field, FieldWithValue, getAll, create, update) where

import Boon.Common
import Data.HTTP.Method (Method(..))
import Data.List.NonEmpty (NonEmptyList)
import Foreign (ForeignError)
import Model.Common (Decoder, Request)
import Simple.JSON (readJSON, writeJSON)


type Field =
  { name :: String
  , id :: Int
  }

type FieldWithValue =
  { name :: String
  , id :: Int
  , value :: String
  }


decodeMany :: Decoder (Array Field)
decodeMany s =
  let
    json :: Either (NonEmptyList ForeignError) {data :: {fields :: Array Field}}
    json = readJSON s in
  map (\x -> x.data.fields) json

getAll :: Request String (Array Field)
getAll =
  { path: "/api/fields"
  , method: GET
  , content: Nothing
  , decoder: decodeMany
  }

create :: String -> Request String Unit
create name =
  { path: "/api/fields"
  , method: POST
  , content: Just (writeJSON {field: {name}})
  , decoder: const (Right unit)
  }

update :: Field -> Request String Unit
update field =
  { path: "/api/fields/" <> (show field.id)
  , method: PATCH
  , content: Just (writeJSON {field})
  , decoder: const (Right unit)
  }
