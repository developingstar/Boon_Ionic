module Model.JourneyType (JourneyType(..), validTypes) where

import Boon.Common

import Foreign (F, Foreign, unsafeFromForeign, fail, ForeignError(..))
import Simple.JSON (class ReadForeign, class WriteForeign, writeImpl)


data JourneyType = Contact | Deal

instance showJourneyType :: Show JourneyType where
  show Contact = "contact"
  show Deal = "deal"

derive instance eqJourneyType :: Eq JourneyType

instance readForeignJourneyType :: ReadForeign JourneyType where
  readImpl = readJourneyType where
    readJourneyType :: Foreign -> F JourneyType
    readJourneyType raw | unsafeFromForeign raw == "contact" = pure $ Contact
                  | unsafeFromForeign raw == "deal" = pure $ Deal
                  | otherwise = fail $ TypeMismatch "JourneyType" (unsafeFromForeign raw)

instance writeForeignJourneyType :: WriteForeign JourneyType where
  writeImpl = writeJourneyType where
    writeJourneyType :: JourneyType -> Foreign
    writeJourneyType journeyType = writeImpl $ show journeyType


validTypes :: Array JourneyType
validTypes = [Contact, Deal]
