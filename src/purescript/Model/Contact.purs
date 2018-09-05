module Model.Contact (Contact, title) where

import Boon.Common

import Control.Alt ((<|>))
import Control.Apply (lift2)
import Data.Maybe (fromMaybe)
import Model.Field (FieldWithValue)
import Model.TZDateTime (TZDateTime)
import Model.User (User)


type Contact =
  { email :: Maybe String
  , fields :: Array FieldWithValue
  , first_name :: Maybe String
  , id :: Int
  , inserted_at :: TZDateTime
  , last_name :: Maybe String
  , owner :: Maybe User
  , phone_number :: Maybe String
  , updated_at :: TZDateTime
  }

title :: Contact -> String
title contact =
  let name = lift2 (\f l -> f <> " " <> l) contact.first_name contact.last_name in
  fromMaybe "???" $ name <|> contact.first_name <|> contact.last_name <|> contact.email <|> contact.phone_number
