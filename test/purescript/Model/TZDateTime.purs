module Test.Model.TZDateTime where

import Boon.Common

import Control.Monad.Gen (chooseInt)
import Data.Formatter.Number (formatOrShowNumber)
import Data.Int (toNumber)
import Data.List.NonEmpty (singleton)
import Foreign (ForeignError(..), MultipleErrors)
import Model.TZDateTime (TZDateTime)
import Partial.Unsafe (unsafePartial)
import Simple.JSON (readJSON)
import Test.Helpers (tzdt)
import Test.QuickCheck (class Arbitrary, (===))
import Test.Unit (TestSuite, describe, it)
import Test.Unit.Assert as Assert
import Test.Unit.QuickCheck (quickCheck)


data Year = Year Int
instance arbYear :: Arbitrary Year where
  arbitrary = Year <$> chooseInt 1900 2100

data Day = Day Int
instance arbDay :: Arbitrary Day where
  arbitrary = Day <$> chooseInt 1 31

data Hour = Hour Int
instance arbHour :: Arbitrary Hour where
  arbitrary = Hour <$> chooseInt 0 23

data Minute = Minute Int
instance arbMinute :: Arbitrary Minute where
  arbitrary = Minute <$> chooseInt 0 59



pad2 :: Int -> String
pad2 i =
  formatOrShowNumber "00" (toNumber i)

readTZDateTime :: String -> Either MultipleErrors TZDateTime
readTZDateTime s =
  readJSON (show s)

suite :: TestSuite
suite = do
  describe "ReadForeign instance" do
    it "reads a valid datetime string" do
      quickCheck \(Year year) (Day day) (Hour hour) (Minute minute) ->
        (Right $ unsafePartial $ tzdt year 8 day hour minute 57 998) ===
        (readTZDateTime $ (show year) <> "-08-" <> (pad2 day) <> "T" <> (pad2 hour) <> ":" <> (pad2 minute) <> ":57.998530")
    it "ignores nanoseconds" do
      Assert.equal (readTZDateTime "2018-08-21T12:05:50.041830") (Right $ unsafePartial $ tzdt 2018 8 21 12 5 50 41)
    it "reports errors for invalid datetime string" do
      Assert.equal (readTZDateTime "2018-nope-sorry") (Left $ singleton $ ForeignError "error parsing date: 2018-nope-sorry")
