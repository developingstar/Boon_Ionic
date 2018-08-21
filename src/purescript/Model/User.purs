module Model.User (User, getAll, create, update, updateAvatar) where

import Boon.Common

import Data.HTTP.Method (Method(..))
import Data.List.NonEmpty (NonEmptyList)
import Data.Nullable (toNullable)
import Foreign (ForeignError)
import Model.Common (Decoder, Request, FormDataRequest)
import Simple.JSON (readJSON, writeJSON)
import Web.XHR.FormData (FormData)


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

getAll :: Request (Array User)
getAll =
  { path: "/api/users"
  , method: GET
  , content: Nothing
  , decoder: decodeMany
  }

create :: Maybe String -> String -> String -> Maybe String -> Maybe String -> Request Unit
create avatar_url email name phone_number password =
  { path: "/api/users"
  , method: POST
  , content: Just (writeJSON
    { user:
      { avatar_url: toNullable avatar_url
      , email
      , name
      , phone_number: toNullable phone_number
      , password
      }
    }
  )
  , decoder: const (Right unit)
  }

update :: User -> Request Unit
update user =
  { path: "/api/users/" <> (show user.id)
  , method: PATCH
  , content: Just (writeJSON
    { user:
      { avatar_url: toNullable user.avatar_url
      , email: user.email
      , id: user.id
      , name: user.name
      , phone_number: toNullable user.phone_number
      , role: user.role
      , password: user.password
      }
    }
  )
  , decoder: const (Right unit)
  }

updateAvatar :: User -> FormData -> FormDataRequest Unit
updateAvatar user formData =
  { path: "/api/users/" <> (show user.id) <> "/avatar"
  , method: POST
  , content: Just formData
  , decoder: const (Right unit)
  }
