module Settings.CustomFields (component, Query) where

import Boon.Common

import Boon.Bridge (showToast, warning)
import Boon.Elements (button, itemList)
import Boon.Forms (inputGroup)
import Data.Array as Array
import Data.String as String
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Properties as HP
import Model.Common (class RequestContent, Request, send, showErrors)
import Model.Field (Field)
import Model.Field as Field
import Settings.Common (formHeader)

data State
  = ListView { fields :: Array Field }
  | NewFieldView { name :: String }
  | EditFieldView { field :: Field }

data Query a
  = CreateField a
  | GoToEditFieldView Field a
  | GoToListView a
  | GoToNewFieldView a
  | UpdateField a
  | UpdateName String a

formView :: String -> String -> String -> (Unit -> Query Unit) -> HH.HTML Void (Query Unit)
formView headerAction buttonAction value confirmQuery =
  let
    isInvalid = String.null value
    maybeQuery = if isInvalid then Nothing else Just confirmQuery in
  HH.div_
  [ formHeader headerAction buttonAction "Field" GoToListView maybeQuery
  , HH.form [HP.autocomplete false] [inputGroup "Name" isInvalid HP.InputText UpdateName value]
  ]

updateName :: String -> State -> State
updateName newName state =
  case state of
    ListView _ -> state
    NewFieldView internal -> NewFieldView (internal { name = newName })
    EditFieldView internal -> EditFieldView (internal { field { name = newName}})

component :: H.Component HH.HTML Query Unit Unit Aff
component =
  H.lifecycleComponent {
    initialState: const initialState
    , render
    , eval: (\query -> H.get >>= eval query)
    , receiver: const Nothing
    , initializer: Just (H.action GoToListView)
    , finalizer: Nothing
    }
  where
  initialState :: State
  initialState = ListView { fields: [] }

  render :: State -> H.ComponentHTML Query
  render (ListView state) =
    HH.div_
    [ HH.div [HP.class_ $ HH.ClassName "header"]
      [ HH.h2_ [HH.text "Custom Fields"]
      , button (Just GoToNewFieldView) "Add New Field"
      ]
    , map (\f -> {label: f.name, query: GoToEditFieldView f}) state.fields |> itemList
    ]
  render (NewFieldView state) =
    formView "New" "Create" state.name CreateField
  render (EditFieldView state) =
    formView "Edit" "Update" state.field.name UpdateField

  eval :: forall a. Query a -> State -> H.ComponentDSL State Query Unit Aff a
  eval (CreateField next) state@(NewFieldView {name}) =
    whenRequestSuccessful (Field.create name) state next
  eval (CreateField next) _ =
    pure next
  eval (GoToNewFieldView next) _ = do
    H.put $ NewFieldView { name: ""}
    pure next
  eval (GoToEditFieldView field next) _ = do
    H.put $ EditFieldView { field }
    pure next
  eval (GoToListView next) _ = do
    response <- H.liftAff $ send Field.getAll
    case response of
      Left _ -> pure unit
      Right fields -> H.put $ ListView { fields: Array.sortWith (_.name >>> String.toLower) fields }
    pure next
  eval (UpdateName name next) _ = do
    H.modify_ $ updateName name
    pure next
  eval (UpdateField next) state@(EditFieldView {field}) =
    whenRequestSuccessful (Field.update field) state next
  eval (UpdateField next) _ =
    pure next

  -- Goes to list view when the request is successful, otherwise shows a warning toast.
  whenRequestSuccessful :: forall a b c. RequestContent a => Request a b -> State -> c -> H.ComponentDSL State Query Unit Aff c
  whenRequestSuccessful request state next = do
    response <- H.liftAff $ send request
    case response of
      Left e -> do
        H.liftEffect $ showToast warning 2000 (showErrors e)
        pure next
      Right _ ->
        eval (GoToListView next) state
