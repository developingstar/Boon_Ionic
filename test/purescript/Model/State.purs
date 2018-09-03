module Test.Model.State where

import Boon.Common
import Data.List.NonEmpty (singleton)
import Foreign (ForeignError(..), MultipleErrors)
import Model.State (State(..))
import Simple.JSON (readJSON)
import Test.Unit (TestSuite, describe, it)
import Test.Unit.Assert as Assert


type SampleRecord = { state :: State }

readState :: String -> Either MultipleErrors SampleRecord
readState = readJSON

suite :: TestSuite
suite = do
  describe "readForeignState" do
    it "works for active" do
      Assert.equal
        (readState """{"state": "active"}""")
        (Right { state: Active })
    it "works for inactive" do
      Assert.equal
        (readState """{"state": "inactive"}""")
        (Right { state: Inactive })
    it "returns error for invalid type" do
      Assert.equal
        (readState """{"state": "pending"}""")
        (Left (singleton (ErrorAtProperty "state" (TypeMismatch "State" "pending"))))
