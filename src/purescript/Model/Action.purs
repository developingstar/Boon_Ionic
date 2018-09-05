module Model.Action
  ( Action(..)
  , ActionBaseFields
  , AssignOwnerRecord
  , AssignStageRecord
  , CreateDealRecord
  , SendEmailRecord
  , SendTextRecord
  , UpdateFieldRecord
  , WaitRecord
  ) where

import Boon.Common

import Foreign (F, Foreign, ForeignError(..), fail)
import Simple.JSON (class ReadForeign, readImpl)


type ActionBaseFields a = { id :: Maybe Int | a }

type AssignOwnerRecord = ActionBaseFields (ownerId :: Int)
type AssignStageRecord = ActionBaseFields (stageId :: Int)
type CreateDealRecord = ActionBaseFields (name :: String, ownerId :: Maybe Int, stageId :: Int, value :: Int)
type SendEmailRecord = ActionBaseFields (templateId :: Int, asOwner :: Boolean)
type SendTextRecord = ActionBaseFields (templateId :: Int, asOwner :: Boolean)
type UpdateFieldRecord = ActionBaseFields (fieldId :: Int, value :: String)
type WaitRecord = ActionBaseFields (for :: Int)

data Action
  = AssignOwner AssignOwnerRecord
  | AssignStage AssignStageRecord
  | CreateDeal CreateDealRecord
  | SendEmail SendEmailRecord
  | SendText SendTextRecord
  | UpdateField UpdateFieldRecord
  | Wait WaitRecord

instance showAction :: Show Action where
  show (AssignOwner r) = "Assign Owner with ID " <> show r.ownerId
  show (AssignStage r) = "Assign Stage with ID " <> show r.stageId
  show (CreateDeal r) = "Create " <> r.name <> " Deal"
  show (SendEmail r) | r.asOwner == true = "Send Email as owner using template with ID " <> show r.templateId
                     | otherwise         = "Send Email using template with ID " <> show r.templateId
  show (SendText r) | r.asOwner == true = "Send Text as owner using template with ID " <> show r.templateId
                    | otherwise         = "Send Text using template with ID " <> show r.templateId
  show (UpdateField r) = "Update Field with ID " <> show r.fieldId <> " with " <> show r.value
  show (Wait r) = "Wait for " <> show r.for <> " seconds"

derive instance eqAction :: Eq Action

type RawActionBaseFields a = { id :: Int | a }
type RawActionSkeleton = { type :: String }
type RawAssignOwner = (RawActionBaseFields (data :: { owner_id :: Int }))
type RawAssignStage = (RawActionBaseFields (data :: { stage_id :: Int }))
type RawCreateDeal = (RawActionBaseFields (data :: { name :: String, owner_id :: Maybe Int, stage_id :: Int, value :: Int }))
type RawSendEmail = (RawActionBaseFields (data :: { template_id :: Int, send_from_owner :: Boolean }))
type RawSendText = (RawActionBaseFields (data :: { template_id :: Int, send_from_owner :: Boolean }))
type RawUpdateField = (RawActionBaseFields (data :: { field_id :: Int, value :: String }))
type RawWait = (RawActionBaseFields (data :: { for :: Int }))

instance readForeignAction :: ReadForeign Action where
  readImpl = readAction where
    readRawActionSkeleton :: Foreign -> F RawActionSkeleton
    readRawActionSkeleton = readImpl

    readRawAssignOwner :: Foreign -> F RawAssignOwner
    readRawAssignOwner = readImpl

    readRawAssignStage :: Foreign -> F RawAssignStage
    readRawAssignStage = readImpl

    readRawCreateDeal :: Foreign -> F RawCreateDeal
    readRawCreateDeal = readImpl

    readRawSendEmail :: Foreign -> F RawSendEmail
    readRawSendEmail = readImpl

    readRawSendText :: Foreign -> F RawSendText
    readRawSendText = readImpl

    readRawUpdateField :: Foreign -> F RawUpdateField
    readRawUpdateField = readImpl

    readRawWait :: Foreign -> F RawWait
    readRawWait = readImpl

    readAction :: Foreign -> F Action
    readAction raw = do
      skeleton <- readRawActionSkeleton raw
      case skeleton.type of
        "assign_owner" ->
          (\r -> AssignOwner { id: Just r.id
                             , ownerId: r.data.owner_id
                             }
          ) <$> readRawAssignOwner raw
        "assign_stage" ->
          (\r -> AssignStage { id: Just r.id
                             , stageId: r.data.stage_id
                             }
          ) <$> readRawAssignStage raw
        "create_deal" ->
          (\r -> CreateDeal { id: Just r.id
                            , name: r.data.name
                            , ownerId: r.data.owner_id
                            , stageId: r.data.stage_id
                            , value: r.data.value
                            }
          ) <$> readRawCreateDeal raw
        "send_email" ->
          (\r -> SendEmail { id: Just r.id
                           , templateId: r.data.template_id
                           , asOwner: r.data.send_from_owner
                           }
          ) <$> readRawSendEmail raw
        "send_text" ->
          (\r -> SendText { id: Just r.id
                          , templateId: r.data.template_id
                          , asOwner: r.data.send_from_owner
                          }
          ) <$> readRawSendText raw
        "update_field" ->
          (\r -> UpdateField { id: Just r.id
                             , fieldId: r.data.field_id
                             , value: r.data.value
                             }
          ) <$> readRawUpdateField raw
        "wait" ->
          (\r ->  Wait { id: Just r.id
                       , for: r.data.for
                       }
          ) <$> readRawWait raw
        _ -> fail $ TypeMismatch "type" skeleton.type
