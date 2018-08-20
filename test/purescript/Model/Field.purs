module Test.Model.Field where

import Boon.Common
import Data.List.NonEmpty (singleton)
import Data.String (joinWith)
import Foreign (ForeignError(..))
import Model.Field as Field
import Test.Helpers (AlphaString(..))
import Test.QuickCheck ((===))
import Test.Unit (TestSuite, describe, it)
import Test.Unit.Assert as Assert
import Test.Unit.QuickCheck (quickCheck)

suite :: TestSuite
suite = do
  describe "getAll" do
    it "doesn't send any content" do
      Assert.equal Field.getAll.content Nothing
    it "works for valid JSON" do
      Assert.equal
        (Field.getAll.decoder """{"data": {"fields": [{"id": 123, "name": "Website"}]}}""") $
        Right [{id: 123, name: "Website"}]
    it "returns error for invalid JSON" do
      Assert.equal
        (Field.getAll.decoder """{"data": {"fields": [{"id": 123, "name": "Website"}, {"name": "Just a name"}]}}""") $
        Left (singleton (ErrorAtProperty "data" (ErrorAtProperty "fields" (ErrorAtProperty "id" (TypeMismatch "Int" "Undefined")))))

  describe "create" do
    it "sends proper content" do
      quickCheck \(AlphaString s) ->
        (Field.create s).content ===
        Just (joinWith "" ["{\"field\":{\"name\":\"", s, "\"}}"])
    it "ignores the response" do
      Assert.equal
        ((Field.create "Website").decoder "OK")
        (Right unit)

  describe "update" do
    it "sends proper content" do
      quickCheck \(AlphaString s) i ->
        (Field.update {name: s, id: i}).content ===
        Just (joinWith "" ["{\"field\":{\"name\":\"", s, "\",\"id\":" , show i, "}}"])
    it "ignores the response" do
      Assert.equal
        ((Field.update {name: "Website", id: 1234}).decoder "OK")
        (Right unit)
