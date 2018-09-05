module Model.Journey
  ( Journey
  , PaginatedJourneys
  , create
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
import Simple.JSON (readJSON, writeJSON)


type JourneySkeleton =
  { name :: Maybe String
  , type :: Maybe JourneyType
  }

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


create :: JourneySkeleton -> Request String Unit
create journey =
  { path: "/api/journeys"
  , method: POST
  , content: Just (writeJSON {journey})
  , decoder: const (Right unit)
  }

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
