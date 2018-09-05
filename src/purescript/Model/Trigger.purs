module Model.Trigger
  ( Trigger(..)
  , FieldUpdatedRecord
  , PipelineAssignedRecord
  , StageAssignedRecord
  , TriggerBaseFields
  ) where

import Boon.Common

import Foreign (F, Foreign, ForeignError(..), fail)
import Simple.JSON (class ReadForeign, readImpl)


type TriggerBaseFields a = { id :: Maybe Int | a }

type FieldUpdatedRecord = TriggerBaseFields (fieldId :: Int, value :: String)
type PipelineAssignedRecord = TriggerBaseFields (pipelineId :: Int)
type StageAssignedRecord = TriggerBaseFields (stageId :: Int)

data Trigger
  = FieldUpdated FieldUpdatedRecord
  | PipelineAssigned PipelineAssignedRecord
  | StageAssigned StageAssignedRecord

instance showTrigger :: Show Trigger where
  show (FieldUpdated _) = "Field Updated"
  show (PipelineAssigned _) = "Pipeline Assigned"
  show (StageAssigned _) = "Stage Assigned"

derive instance eqTrigger :: Eq Trigger

type RawTriggerBaseFields a = { id :: Int | a }
type RawTriggerSkeleton = { type :: String }
type RawFieldUpdated = (RawTriggerBaseFields (data :: { field_id :: Int, value :: String }))
type RawPipelineAssigned = (RawTriggerBaseFields (data :: { pipeline_id :: Int }))
type RawStageAssigned = (RawTriggerBaseFields (data :: { stage_id :: Int }))

instance readForeignTrigger :: ReadForeign Trigger where
  readImpl = readTrigger where
    readRawTriggerSkeleton :: Foreign -> F RawTriggerSkeleton
    readRawTriggerSkeleton = readImpl

    readRawFieldUpdated :: Foreign -> F RawFieldUpdated
    readRawFieldUpdated = readImpl

    readRawPipelineAssigned :: Foreign -> F RawPipelineAssigned
    readRawPipelineAssigned = readImpl

    readRawStageAssigned :: Foreign -> F RawStageAssigned
    readRawStageAssigned = readImpl

    readTrigger :: Foreign -> F Trigger
    readTrigger raw = do
      skeleton <- readRawTriggerSkeleton raw
      case skeleton.type of
        "field_updated" ->
          (\r -> FieldUpdated { id: Just r.id
                              , fieldId: r.data.field_id
                              , value: r.data.value
                              }
          ) <$> readRawFieldUpdated raw
        "pipeline_assigned" ->
          (\r -> PipelineAssigned { id: Just r.id
                                  , pipelineId: r.data.pipeline_id
                                  }
          ) <$> readRawPipelineAssigned raw
        "stage_assigned" ->
          (\r -> StageAssigned { id: Just r.id
                               , stageId: r.data.stage_id
                               }
          ) <$> readRawStageAssigned raw
        _ -> fail $ TypeMismatch "type" skeleton.type
