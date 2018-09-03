module Test.Main where

import Effect (Effect)
import Prelude
import Test.Unit.Main (runTest)

import Test.Model.Action as Test.Model.Action
import Test.Model.Common as Test.Model.Common
import Test.Model.Contact as Test.Model.Contact
import Test.Model.Field as Test.Model.Field
import Test.Model.Journey as Test.Model.Journey
import Test.Model.JourneyType as Test.Model.JourneyType
import Test.Model.PhoneNumber as Test.Model.PhoneNumber
import Test.Model.State as Test.Model.State
import Test.Model.TZDateTime as Test.Model.TZDateTime
import Test.Model.Trigger as Test.Model.Trigger
import Test.Model.User as Test.Model.User


main :: Effect Unit
main = runTest do
  Test.Model.Action.suite
  Test.Model.Common.suite
  Test.Model.Contact.suite
  Test.Model.Field.suite
  Test.Model.Journey.suite
  Test.Model.JourneyType.suite
  Test.Model.PhoneNumber.suite
  Test.Model.State.suite
  Test.Model.TZDateTime.suite
  Test.Model.Trigger.suite
  Test.Model.User.suite
