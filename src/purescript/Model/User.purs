module Model.User (NewUser, User, getAll, create, update, updateAvatar) where

import Boon.Common

import Data.HTTP.Method (Method(..))
import Data.List.NonEmpty (NonEmptyList)
import Data.Nullable (toNullable)
import Foreign (ForeignError)
import Model.Common (Decoder, Request)
import Simple.JSON (readJSON, writeJSON)
import Web.XHR.FormData (FormData)


type NewUser =
  { phone_number :: Maybe String
  , name :: String
  , email :: String
  }

type User =
  { role :: String
  , phone_number :: Maybe String
  , name :: String
  , id :: Int
  , email :: String
  , avatar_url :: Maybe String
  , password :: Maybe String
  }


decodeMany :: Decoder (Array User)
decodeMany s =
  let
    json :: Either (NonEmptyList ForeignError) {data :: {users :: Array User}}
    json = readJSON s in
  map (\x -> x.data.users) json

getAll :: Request String (Array User)
getAll =
  { path: "/api/users"
  , method: GET
  , content: Nothing
  , decoder: decodeMany
  }

create :: NewUser -> Request String Unit
create {email, name, phone_number} =
  { path: "/api/users"
  , method: POST
  , content: Just (writeJSON
    { user:
      { email
      , name
      , phone_number: toNullable phone_number
      }
    }
  )
  , decoder: const (Right unit)
  }

update :: User -> Request String Unit
update {email, id, name, phone_number, role, password} =
  { path: "/api/users/" <> (show id)
  , method: PATCH
  , content: Just (writeJSON
    { user:
      { email
      , name
      , phone_number: toNullable phone_number
      , role
      , password
      }
    }
  )
  , decoder: const (Right unit)
  }

updateAvatar :: User -> FormData -> Request FormData Unit
updateAvatar {id} formData =
  { path: "/api/users/" <> (show id) <> "/avatar"
  , method: POST
  , content: Just formData
  , decoder: const (Right unit)
  }
