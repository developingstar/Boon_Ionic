module Test.Main where

import Effect (Effect)
import Prelude
import Test.Unit.Main (runTest)
import Test.Model.Common as Test.Model.Common
import Test.Model.Field as Test.Model.Field


main :: Effect Unit
main = runTest do
  Test.Model.Common.suite
  Test.Model.Field.suite
