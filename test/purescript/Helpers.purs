module Test.Helpers where

import Boon.Common

import Data.Maybe (fromJust)
import Data.String.Gen (genAlphaString)
import Model.TZDateTime (TZDateTime)
import Model.TZDateTime as TZDateTime
import Test.QuickCheck.Arbitrary (class Arbitrary)


data AlphaString = AlphaString String

instance arbAlphaString :: Arbitrary AlphaString where
  arbitrary = AlphaString <$> genAlphaString


tzdt :: Partial => Int -> Int -> Int -> Int -> Int -> Int -> Int -> TZDateTime
tzdt year month day hour minute second millisecond =
  TZDateTime.utc' year month day hour minute second millisecond
  |> fromJust
