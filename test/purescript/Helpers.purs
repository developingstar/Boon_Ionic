module Test.Helpers where

import Boon.Common
import Data.String.Gen (genAlphaString)
import Test.QuickCheck.Arbitrary (class Arbitrary)


data AlphaString = AlphaString String

instance arbAlphaString :: Arbitrary AlphaString where
  arbitrary = AlphaString <$> genAlphaString
