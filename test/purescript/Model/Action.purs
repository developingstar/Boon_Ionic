module Test.Model.Action where

import Boon.Common
import Data.List.NonEmpty (singleton)
import Foreign (ForeignError(..), MultipleErrors)
import Model.Action (Action(..))
import Simple.JSON (readJSON)
import Test.Unit (TestSuite, describe, it)
import Test.Unit.Assert as Assert


readAction :: String -> Either MultipleErrors Action
readAction = readJSON

suite :: TestSuite
suite = do
  describe "readForeignAction" do
    it "works for assign owner action" do
      Assert.equal
        (readAction """{"id": 1, "type": "assign_owner", "data": {"owner_id": 2}}""")
        (Right $ AssignOwner { id: Just 1, ownerId: 2 })
    it "returns error for invalid assign owner JSON" do
      Assert.equal
        (readAction """{"id": 1, "type": "assign_owner", "data": {"owner_id": "2"}}""")
        (Left (singleton (ErrorAtProperty "data" (ErrorAtProperty "owner_id" (TypeMismatch "Int" "String")))))
    it "works for assign stage action" do
      Assert.equal
        (readAction """{"id": 1, "type": "assign_stage", "data": {"stage_id": 2}}""")
        (Right $ AssignStage { id: Just 1, stageId: 2 })
    it "returns error for invalid assign stage JSON" do
      Assert.equal
        (readAction """{"id": 1, "type": "assign_stage", "data": {"stage_id": "2"}}""")
        (Left (singleton (ErrorAtProperty "data" (ErrorAtProperty "stage_id" (TypeMismatch "Int" "String")))))
    it "works for create deal action" do
      Assert.equal
        (readAction """{"id": 1, "type": "create_deal", "data": {"name": "subscription", "owner_id": 2, "stage_id": 3, "value": 100}}""")
        (Right $ CreateDeal { id: Just 1, name: "subscription", ownerId: Just 2, stageId: 3, value: 100 })
    it "works for create deal action when owner is null" do
      Assert.equal
        (readAction """{"id": 1, "type": "create_deal", "data": {"name": "subscription", "owner_id": null, "stage_id": 2, "value": 100}}""")
        (Right $ CreateDeal { id: Just 1, name: "subscription", ownerId: Nothing, stageId: 2, value: 100 })
    it "works for create deal action when owner is missing" do
      Assert.equal
        (readAction """{"id": 1, "type": "create_deal", "data": {"name": "subscription", "stage_id": 2, "value": 100}}""")
        (Right $ CreateDeal { id: Just 1, name: "subscription", ownerId: Nothing, stageId: 2, value: 100 })
    it "returns error for invalid create deal JSON" do
      Assert.equal
        (readAction """{"id": 1, "type": "create_deal", "data": {"name": "subscription", "owner_id": null, "stage_id": 2}}""")
        (Left (singleton (ErrorAtProperty "data" (ErrorAtProperty "value" (TypeMismatch "Int" "Undefined")))))
    it "works for send email action" do
      Assert.equal
        (readAction """{"id": 1, "type": "send_email", "data": {"template_id": 2, "send_from_owner": true}}""")
        (Right $ SendEmail { id: Just 1, templateId: 2, asOwner: true })
    it "returns error for invalid send email JSON" do
      Assert.equal
        (readAction """{"id": 1, "type": "send_email", "data": {"template_id": 2, "send_from_owner": 1}}""")
        (Left (singleton (ErrorAtProperty "data" (ErrorAtProperty "send_from_owner" (TypeMismatch "Boolean" "Number")))))
    it "works for send text action" do
      Assert.equal
        (readAction """{"id": 1, "type": "send_text", "data": {"template_id": 2, "send_from_owner": true}}""")
        (Right $ SendText { id: Just 1, templateId: 2, asOwner: true })
    it "returns error for invalid send text JSON" do
      Assert.equal
        (readAction """{"id": 1, "type": "send_text", "data": {"template_id": 2, "send_from_owner": 1}}""")
        (Left (singleton (ErrorAtProperty "data" (ErrorAtProperty "send_from_owner" (TypeMismatch "Boolean" "Number")))))
    it "works for update field action" do
      Assert.equal
        (readAction """{"id": 1, "type": "update_field", "data": {"field_id": 2, "value": "new"}}""")
        (Right $ UpdateField { id: Just 1, fieldId: 2, value: "new" })
    it "returns error for invalid update field JSON" do
      Assert.equal
        (readAction """{"id": 1, "type": "update_field", "data": {"field_id": 2, "value": 1}}""")
        (Left (singleton (ErrorAtProperty "data" (ErrorAtProperty "value" (TypeMismatch "String" "Number")))))
    it "works for wait action" do
      Assert.equal
        (readAction """{"id": 1, "type": "wait", "data": {"for": 60}}""")
        (Right $ Wait { id: Just 1, for: 60 })
    it "returns error for invalid wait JSON" do
      Assert.equal
        (readAction """{"id": 1, "type": "wait", "data": {"for": "60"}}""")
        (Left (singleton (ErrorAtProperty "data" (ErrorAtProperty "for" (TypeMismatch "Int" "String")))))
    it "returns error for invalid type" do
      Assert.equal
        (readAction """{"id": 1, "type": "assign_pipeline", "data": {"pipeline_id": 2}}""")
        (Left (singleton (TypeMismatch "type" "assign_pipeline")))
