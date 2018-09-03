module Test.Model.Contact where

import Boon.Common

import Model.Contact (Contact)
import Model.Contact as Contact
import Partial.Unsafe (unsafePartial)
import Test.Helpers (tzdt)
import Test.Unit (TestSuite, describe, it)
import Test.Unit.Assert as Assert


sample :: Contact
sample =
  { email: Nothing
  , fields: []
  , first_name: Nothing
  , id: 12345
  , inserted_at: unsafePartial $ tzdt 2018 8 20 11 2 38 998
  , last_name: Nothing
  , owner: Just
    { role: "sales_rep"
    , phone_number: Nothing
    , name: "Contact Owner"
    , id: 98765
    , email: "owner@example.com"
    , avatar_url: Nothing
    , password: Nothing
    }
  , phone_number: Nothing
  , updated_at: unsafePartial $ tzdt 2018 8 20 11 2 38 998
  }

suite :: TestSuite
suite = do
  describe "title" do
    it "concatenates first and last name if they are present" do
      Assert.equal "John Doe"
        $ Contact.title (sample {first_name = Just "John", last_name = Just "Doe"})
    it "uses only first name if last name is missing" do
      Assert.equal "John"
        $ Contact.title (sample {first_name = Just "John"})
    it "uses only last name if first name is missing" do
      Assert.equal "Doe"
        $ Contact.title (sample {last_name = Just "Doe"})
    it "uses email if both names are missing" do
      Assert.equal "contact@example.com"
        $ Contact.title (sample {email = Just "contact@example.com"})
    it "uses phone number if names and email are missing" do
      Assert.equal "+1234567890"
        $ Contact.title (sample {phone_number = Just "+1234567890"})
    it "returns question marks if no data is available" do
      Assert.equal "???"
        $ Contact.title sample
