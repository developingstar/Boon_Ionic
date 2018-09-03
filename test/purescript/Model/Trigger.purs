module Test.Model.Trigger where

import Boon.Common
import Data.List.NonEmpty (singleton)
import Foreign (ForeignError(..), MultipleErrors)
import Model.Trigger (Trigger(..))
import Simple.JSON (readJSON)
import Test.Unit (TestSuite, describe, it)
import Test.Unit.Assert as Assert


readTrigger :: String -> Either MultipleErrors Trigger
readTrigger = readJSON

suite :: TestSuite
suite = do
  describe "readForeignTrigger" do
    it "works for field updated trigger" do
      Assert.equal
        (readTrigger """{"id": 1, "type": "field_updated", "data": {"field_id": 2, "value": "new"}}""")
        (Right $ FieldUpdated { id: Just 1, fieldId: 2, value: "new" })
    it "returns error for invalid field updated JSON" do
      Assert.equal
        (readTrigger """{"id": 1, "type": "field_updated", "data": {"field_id": 2, "value": 1}}""")
        (Left (singleton (ErrorAtProperty "data" (ErrorAtProperty "value" (TypeMismatch "String" "Number")))))
    it "works for pipeline assigned trigger" do
      Assert.equal
        (readTrigger """{"id": 1, "type": "pipeline_assigned", "data": {"pipeline_id": 2}}""")
        (Right $ PipelineAssigned { id: Just 1, pipelineId: 2 })
    it "returns error for invalid pipeline assigned JSON" do
      Assert.equal
        (readTrigger """{"id": 1, "type": "pipeline_assigned", "data": {"pipeline_id": "2"}}""")
        (Left (singleton (ErrorAtProperty "data" (ErrorAtProperty "pipeline_id" (TypeMismatch "Int" "String")))))
    it "works for stage assigned trigger" do
      Assert.equal
        (readTrigger """{"id": 1, "type": "stage_assigned", "data": {"stage_id": 2}}""")
        (Right $ StageAssigned { id: Just 1, stageId: 2 })
    it "returns error for invalid stage assigned JSON" do
      Assert.equal
        (readTrigger """{"id": 1, "type": "stage_assigned", "data": {"stage_id": "2"}}""")
        (Left (singleton (ErrorAtProperty "data" (ErrorAtProperty "stage_id" (TypeMismatch "Int" "String")))))
    it "returns error for invalid type" do
      Assert.equal
        (readTrigger """{"id": 1, "type": "owner_assigned", "data": {"owner_id": 2}}""")
        (Left (singleton (TypeMismatch "type" "owner_assigned")))
