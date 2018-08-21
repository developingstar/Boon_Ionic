module Test.Model.PhoneNumber where

import Boon.Common
import Data.List.NonEmpty (singleton)
import Foreign (ForeignError(..))
import Model.PhoneNumber as PhoneNumber
import Test.Unit (TestSuite, describe, it)
import Test.Unit.Assert as Assert

suite :: TestSuite
suite = do
  describe "getAll" do
    it "doesn't send any content" do
      Assert.equal PhoneNumber.getAll.content Nothing
    it "works for valid JSON" do
      Assert.equal
        (PhoneNumber.getAll.decoder """{"data": {"phone_numbers": [{"phone_number": "+999100"}]}}""") $
        Right [{phone_number: "+999100"}]
    it "returns error for invalid JSON" do
      Assert.equal
        (PhoneNumber.getAll.decoder """{"data": {"phone_numbers": ["+999100"]}}""") $
        Left (singleton (ErrorAtProperty "data" (ErrorAtProperty "phone_numbers" (ErrorAtProperty "phone_number" (TypeMismatch "String" "Undefined")))))
