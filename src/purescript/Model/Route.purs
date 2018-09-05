module Model.Route (currentId) where

import Boon.Common

import Data.Array (drop, last)
import Data.Int (fromString)
import Data.String (Pattern(..), split)
import Web.HTML (window)
import Web.HTML.Location (hash)
import Web.HTML.Window (location)


type Route = Array String

currentId :: Effect (Maybe Int)
currentId =
  routeId <$> currentRoute

currentRoute :: Effect Route
currentRoute =
  hashToRoute <$> currentHash

currentHash :: Effect String
currentHash = window >>= location >>= hash

hashToRoute :: String -> Route
hashToRoute h =
  h
  |> split (Pattern "/")
  |> drop 1

routeId :: Route -> Maybe Int
routeId r = last r >>= fromString
