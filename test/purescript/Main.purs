module Test.Main where

import Prelude
import Effect (Effect)
import Test.Model.Common as Test.Model.Common
import Test.Model.Field as Test.Model.Field
import Test.Model.PhoneNumber as Test.Model.PhoneNumber
import Test.Model.User as Test.Model.User
import Test.Unit.Main (runTest)


main :: Effect Unit
main = runTest do
  Test.Model.Common.suite
  Test.Model.Field.suite
  Test.Model.PhoneNumber.suite
  Test.Model.User.suite
