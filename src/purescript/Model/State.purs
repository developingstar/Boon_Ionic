module Model.State (State(..)) where

import Boon.Common

import Foreign (F, Foreign, unsafeFromForeign, fail, ForeignError(..))
import Simple.JSON (class ReadForeign)

data State = Active | Inactive

instance showState :: Show State where
  show Active = "published"
  show Inactive = "draft"

derive instance eqState :: Eq State

instance readForeignState :: ReadForeign State where
  readImpl = readState where
    readState :: Foreign -> F State
    readState raw | unsafeFromForeign raw == "active" = pure $ Active
                  | unsafeFromForeign raw == "inactive" = pure $ Inactive
                  | otherwise = fail $ TypeMismatch "State" (unsafeFromForeign raw)
