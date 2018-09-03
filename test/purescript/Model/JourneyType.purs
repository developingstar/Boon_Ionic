module Test.Model.JourneyType where

import Boon.Common
import Data.List.NonEmpty (singleton)
import Foreign (ForeignError(..), MultipleErrors)
import Model.JourneyType (JourneyType(..))
import Simple.JSON (readJSON, writeJSON)
import Test.Unit (TestSuite, describe, it)
import Test.Unit.Assert as Assert


type SampleRecord = { type :: JourneyType }

readJourneyType :: String -> Either MultipleErrors SampleRecord
readJourneyType = readJSON

suite :: TestSuite
suite = do
  describe "readForeignJourneyType" do
    it "works for contact" do
      Assert.equal
        (readJourneyType """{"type": "contact"}""")
        (Right { type: Contact })
    it "works for deal" do
      Assert.equal
        (readJourneyType """{"type": "deal"}""")
        (Right { type: Deal })
    it "returns error for invalid type" do
      Assert.equal
        (readJourneyType """{"type": "user"}""")
        (Left (singleton (ErrorAtProperty "type" (TypeMismatch "JourneyType" "user"))))
