module Model.JourneyType (JourneyType(..)) where

import Boon.Common

import Foreign (F, Foreign, unsafeFromForeign, fail, ForeignError(..))
import Simple.JSON (class ReadForeign)


data JourneyType = Contact | Deal

instance showJourneyType :: Show JourneyType where
  show Contact = "contact journey"
  show Deal = "deal journey"

derive instance eqJourneyType :: Eq JourneyType

instance readForeignJourneyType :: ReadForeign JourneyType where
  readImpl = readJourneyType where
    readJourneyType :: Foreign -> F JourneyType
    readJourneyType raw | unsafeFromForeign raw == "contact" = pure $ Contact
                  | unsafeFromForeign raw == "deal" = pure $ Deal
                  | otherwise = fail $ TypeMismatch "JourneyType" (unsafeFromForeign raw)
