module Test.Model.User where

import Boon.Common
import Data.List.NonEmpty (singleton)
import Data.String (joinWith)
import Foreign (ForeignError(..))
import Model.User as User
import Test.Helpers (AlphaString(..))
import Test.QuickCheck ((===))
import Test.Unit (TestSuite, describe, it)
import Test.Unit.Assert as Assert
import Test.Unit.QuickCheck (quickCheck)

suite :: TestSuite
suite = do
  describe "getAll" do
    it "doesn't send any content" do
      Assert.equal User.getAll.content Nothing
    it "works for valid JSON" do
      Assert.equal
        (User.getAll.decoder """{"data": {"users": [{"role": "admin", "phone_number": "+999100", "name": "John Boon", "id": 1, "email": "john@example.com", "avatar_url": null}]}}""") $
        Right [{role: "admin", phone_number: Just "+999100", name: "John Boon", id: 1, email: "john@example.com", avatar_url: Nothing, password: Nothing}]
    it "returns error for invalid JSON" do
      Assert.equal
        (User.getAll.decoder """{"data": {"users": [{"role": "admin", "phone_number": "+999100", "name": "John Boon", "id": 1, "avatar_url": null}]}}""") $
        Left (singleton (ErrorAtProperty "data" (ErrorAtProperty "users" (ErrorAtProperty "email" (TypeMismatch "String" "Undefined")))))

  describe "create" do
    it "sends proper content" do
      quickCheck \(AlphaString s) ->
        (User.create Nothing s s (Just s) (Just s)).content ===
        Just (joinWith "" ["{\"user\":{\"phone_number\":\"", s, "\",\"password\":\"", s,"\",\"name\":\"", s, "\",\"email\":\"", s, "\",\"avatar_url\":null}}"])
    it "ignores the response" do
      Assert.equal
        ((User.create Nothing "user@example.com" "Mark" Nothing Nothing).decoder "OK")
        (Right unit)

  describe "update" do
    it "sends proper content" do
      quickCheck \(AlphaString s) i ->
        (User.update { role: "admin"
                      , phone_number: Just "+999100"
                      , name: s
                      , id: i
                      , email: "john@example.com"
                      , avatar_url: Nothing
                      , password: Nothing
                      }).content ===
        Just (joinWith "" ["{\"user\":{\"role\":\"admin\",\"phone_number\":\"+999100\",\"name\":\"", s, "\",\"id\":", show i, ",\"email\":\"john@example.com\",\"avatar_url\":null}}"])
    it "ignores the response" do
      Assert.equal
        ((User.update { role: "admin"
                      , phone_number: Just "+999100"
                      , name: "John"
                      , id: 1
                      , email: "john@example.com"
                      , avatar_url: Nothing
                      , password: Nothing
                      }).decoder "OK")
        (Right unit)
