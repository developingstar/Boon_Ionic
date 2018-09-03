module Model.Journey
       ( Journey
       , PaginatedJourneys
       , getPage
       , isPublished
       ) where

import Boon.Common

import Data.HTTP.Method (Method(..))
import Model.Action (Action)
import Model.Common (Decoder, Paginated, Request)
import Model.JourneyType (JourneyType)
import Model.State (State(..))
import Model.Trigger (Trigger)
import Simple.JSON (readJSON)


type Journey =
    { actions :: Array Action
    , triggers :: Array Trigger
    , id :: Int
    , name :: String
    , state :: State
    , type :: JourneyType
    }

type PaginatedJourneys = Paginated { journeys :: Array Journey }

decodeMany :: Decoder PaginatedJourneys
decodeMany = readJSON

getPage :: Maybe String -> Request String PaginatedJourneys
getPage (Just url) =
  { path: url
  , method: GET
  , content: Nothing
  , decoder: decodeMany
  }
getPage Nothing =
  { path: "/api/journeys"
  , method: GET
  , content: Nothing
  , decoder: decodeMany
  }

isPublished :: Journey -> Boolean
isPublished journey = journey.state == Active
