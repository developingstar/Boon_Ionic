module Settings.TeamMembers (component, Query) where

import Boon.Common

import Boon.Bridge (appendFile, showToast, warning)
import Boon.Elements (button, classIf, classList, onClick)
import Boon.Forms (fileInputGroup, inputGroup, selectGroup)
import Data.Array as Array
import Data.Maybe (fromMaybe, maybe)
import Data.String as String
import Effect.Class (liftEffect)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Properties as HP
import Model.Common (class RequestContent, Request, send, showErrors)
import Model.PhoneNumber (PhoneNumber)
import Model.PhoneNumber as PhoneNumber
import Model.User (User)
import Model.User as User
import Settings.Common (formHeader)
import Web.Event.Event (Event, target)
import Web.File.File (File)
import Web.File.FileList as FileList
import Web.HTML.HTMLInputElement as HTMLInputElement
import Web.XHR.FormData (EntryName(..))
import Web.XHR.FormData as FormData

type Form =
  { avatar_file :: Maybe File
  , avatar_url :: Maybe String
  , email :: String
  , name :: String
  , password :: Maybe String
  , phone_number :: Maybe String
  , phone_numbers :: Array (Maybe String)
  }

data Mode
  = Edit { id :: Int, role :: String }
  | New

data State
  = ListView { users :: Array User }
  | FormView Form Mode

data Query a
  = CreateUser a
  | GoToEditUserView User a
  | GoToListView a
  | GoToNewUserView a
  | SetAvatar Event a
  | UpdateField (Form -> String -> Form) String a
  | UpdatePhoneNumber (Array (Maybe String)) Int a
  | UpdateUser a

itemList :: forall q. Array User -> HH.HTML q (Query Unit)
itemList items =
  items
  |> map (\r ->
    HH.div [classList "item", onClick $ GoToEditUserView r]
      [ HH.div [classList "item-avatar"]
        [ HH.img [HP.src $ fromMaybe "assets/icon/settings/avatar.svg" r.avatar_url]]
      , HH.div [classList "item-details"]
        [ HH.h3_ [HH.text r.name]
        , HH.h4_ [HH.text $ fromMaybe "" r.phone_number]
        ]
      ]
  )
  |> HH.div [classList "item-list"]

formView :: String -> String -> Boolean -> Form -> (Unit -> Query Unit) -> HH.HTML Void (Query Unit)
formView headerAction buttonAction isCreate form confirmQuery =
  let
    password = fromMaybe "" form.password
    defaultAvatar = "assets/icon/settings/avatar.svg"
    isInvalid = String.null form.email || String.null form.name
    isPasswordInvalid = (String.length password < 6 && String.length password > 0)
    updateEmail = UpdateField \form' val -> form' {email = val}
    updateName = UpdateField \form' val -> form' {name = val}
    updatePassword = UpdateField \form' val -> form' {password = Just val}
    maybeQuery = if isInvalid then Nothing else Just confirmQuery in
  HH.div_
  [ formHeader headerAction buttonAction "User" GoToListView maybeQuery
  , HH.form [HP.autocomplete false]
    [ HH.div [classIf isCreate "hidden"]
      [ fileInputGroup "Avatar" (fromMaybe defaultAvatar form.avatar_url) SetAvatar ]
    , inputGroup "E-mail" (String.null form.email) HP.InputEmail updateEmail form.email
    , inputGroup "Name" (String.null form.name) HP.InputText updateName form.name
    , HH.div [classIf isCreate "hidden"]
      [ inputGroup "Password" isPasswordInvalid HP.InputPassword updatePassword password]
    , selectGroup "Phone number" UpdatePhoneNumber form.phone_number form.phone_numbers
    ]
  ]

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
  initialState = ListView { users: [] }

  render :: State -> H.ComponentHTML Query
  render (ListView state) =
    HH.div_
    [ HH.div [HP.class_ $ HH.ClassName "header"]
      [ HH.h2_ [HH.text "Team Members"]
      , button (Just GoToNewUserView) "Add Team Member"
      ]
    , itemList state.users
    ]
  render (FormView form New) =
    formView "New" "Create" true form CreateUser
  render (FormView form (Edit _)) =
    formView "Edit" "Update" false form UpdateUser

  eval :: forall a. Query a -> State -> H.ComponentDSL State Query Unit Aff a
  eval (CreateUser next) state@(FormView { email, name, phone_number } New) =
    whenRequestSuccessful (User.create { email, name, phone_number }) state next (GoToListView next)
  eval (CreateUser next) _ =
    pure next
  eval (GoToNewUserView next) _ = do
    response <- H.liftAff $ send PhoneNumber.getAll
    case response of
      Left _ -> pure unit
      Right phone_numbers -> H.put $ FormView
        { avatar_url: Nothing
        , avatar_file: Nothing
        , email: ""
        , name: ""
        , password: Nothing
        , phone_number: Nothing
        , phone_numbers: phoneNumbersAsSelectOptions phone_numbers
        }
        New
    pure next

  eval (GoToEditUserView user next) _ = do
    response <- H.liftAff $ send PhoneNumber.getAll
    case response of
      Left _ -> pure unit
      Right phone_numbers -> H.put $ FormView
        { avatar_url: user.avatar_url
        , avatar_file: Nothing
        , email: user.email
        , name: user.name
        , password: Nothing
        , phone_number: user.phone_number
        , phone_numbers: phoneNumbersAsSelectOptions phone_numbers
        }
        (Edit { id: user.id, role: user.role })
    pure next
  eval (GoToListView next) _ = do
    response <- H.liftAff $ send User.getAll
    case response of
      Left _ -> pure unit
      Right users -> H.put $ ListView { users: Array.sortWith (_.name >>> String.toLower) users }
    pure next
  eval (UpdateField f value next) (FormView form mode) = do
    H.put $ FormView (f form value) mode
    pure next
  eval (UpdateField f value next) _ =
    pure next
  eval (UpdatePhoneNumber phoneNumbers index next) (FormView form mode) = do
    H.put $ Array.index phoneNumbers index
      |> fromMaybe Nothing
      |> (\pn -> FormView (form {phone_number = pn}) mode)
    pure next
  eval (UpdatePhoneNumber phoneNumbers index next) _ =
    pure next
  eval (UpdateUser next) state@(FormView form@({avatar_file: Just file}) mode@(Edit {id, role})) = do
    user <- pure $ toUser id role form
    formData <- liftEffect $ FormData.new
    _ <- liftEffect $ appendFile formData (EntryName "avatar") file
    newState <- pure $ FormView (form {avatar_file = Nothing}) mode
    whenRequestSuccessful (User.updateAvatar user formData) newState next (UpdateUser next)
  eval (UpdateUser next) state@(FormView form (Edit {id, role})) =
    let user = toUser id role form in
    whenRequestSuccessful (User.update user) state next (GoToListView next)
  eval (UpdateUser next) _ =
    pure next
  eval (SetAvatar event next) state@(FormView form mode) = do
    maybeFile <- liftEffect $ fileFromEvent event
    H.put $ FormView (form {avatar_file = maybeFile}) mode
    pure next
  eval (SetAvatar event next) _ =
    pure next

  phoneNumbersAsSelectOptions :: Array PhoneNumber -> Array (Maybe String)
  phoneNumbersAsSelectOptions list =
    list
    |> map(\o -> Just o.phone_number)
    |> Array.cons Nothing

  fileFromEvent :: Event -> Effect (Maybe File)
  fileFromEvent event = do
    files <- maybe (pure Nothing) HTMLInputElement.files (target event >>= HTMLInputElement.fromEventTarget)
    pure $ files >>= (FileList.item 0)

  toUser :: Int -> String -> Form -> User
  toUser id role {avatar_url, email, name, password, phone_number} =
    { role, phone_number, name, id, email, avatar_url, password }

  whenRequestSuccessful :: forall a b c. RequestContent a => Request a b -> State -> c -> Query c -> H.ComponentDSL State Query Unit Aff c
  whenRequestSuccessful request state left right = do
    response <- H.liftAff $ send request
    case response of
      Left e -> do
        H.liftEffect $ showToast warning 2000 (showErrors e)
        pure left
      Right _ ->
        eval right state
