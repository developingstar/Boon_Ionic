module Settings.TeamMembers (component, Query) where

import Boon.Common

import Boon.Bridge (appendFile, showToast, warning)
import Boon.Elements (button, classIf, classList, onClick)
import Data.Array as Array
import Data.Maybe (fromMaybe, maybe)
import Data.MediaType (MediaType(..))
import Data.String as String
import Effect.Class (liftEffect)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Model.Common (class RequestContent, Request, send, showErrors)
import Model.PhoneNumber as PhoneNumber
import Model.User (User)
import Model.User as User
import Web.Event.Event (Event, target)
import Web.File.File (File)
import Web.File.FileList as FileList
import Web.HTML.HTMLInputElement as HTMLInputElement
import Web.XHR.FormData (EntryName(..))
import Web.XHR.FormData as FormData

data State
  = ListView { users :: Array User }
  | NewUserView { user ::
                  { avatar_url :: Maybe String
                  , email :: String
                  , name :: String
                  , phone_number :: Maybe String
                  , password :: Maybe String
                  }
                , phone_numbers :: Array (Maybe String)
                }
  | EditUserView { user :: User
                 , phone_numbers :: Array (Maybe String)
                 }

data Query a
  = CreateUser a
  | GoToEditUserView User a
  | GoToListView a
  | GoToNewUserView a
  | UpdateAvatar Event a
  | UpdateField (String -> State -> State) String a
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

formView :: String
            -> String
            -> Boolean
            -> forall r. { user ::
                           { avatar_url :: Maybe String
                           , email :: String
                           , name :: String
                           , phone_number :: Maybe String
                           , password :: Maybe String
                           | r
                           }
                         , phone_numbers :: Array (Maybe String)
                         }
            -> (Unit -> Query Unit)
            -> HH.HTML Void (Query Unit)
formView headerAction buttonAction hideAvatar state confirmQuery =
  let
    isInvalid = String.null state.user.email || String.null state.user.name
    maybeQuery = if isInvalid then Nothing else Just confirmQuery in
  HH.div_
  [ HH.div [HP.class_ $ HH.ClassName "header"]
    [ HH.div_
      [ HH.a [classList "back-link", onClick GoToListView] [HH.text "< Back"]
      , HH.h2_ [HH.text $ headerAction <> " User"]
      ]
    , button maybeQuery $ buttonAction <> " User"
    ]
  , HH.form [HP.autocomplete false]
    [ HH.div [classIf hideAvatar "hidden"]
      [ HH.label [classList "label label-md"] [HH.text "Avatar"]
      , HH.img [classList "avatar", HP.src $ fromMaybe "assets/icon/settings/avatar.svg" state.user.avatar_url]
      , HH.input
        [ HP.type_ HP.InputFile
        , HP.accept $ MediaType ".png, .jpg, .jpeg"
        , HE.onChange (HE.input UpdateAvatar)
        ]
      ]
    , HH.label [classList "label label-md"] [HH.text "E-mail"]
    , HH.input
      [ classIf (String.null state.user.email) "invalid"
      , HP.type_ HP.InputEmail
      , HP.autofocus true
      , HE.onValueInput (HE.input $ UpdateField updateEmail)
      , HP.value state.user.email
      ]
    , HH.label [classList "label label-md"] [HH.text "Name"]
    , HH.input
      [ classIf (String.null state.user.name) "invalid"
      , HP.type_ HP.InputText
      , HE.onValueInput (HE.input $ UpdateField updateName)
      , HP.value state.user.name
      ]
    , HH.label [classList "label label-md"] [HH.text "Password"]
    , HH.input
      [ classIf (String.length (fromMaybe "" state.user.password) < 6 && String.length (fromMaybe "" state.user.password) > 0) "invalid"
      , HP.type_ HP.InputPassword
      , HE.onValueInput (HE.input $ UpdateField updatePassword)
      , HP.value $ fromMaybe "" state.user.password
      ]
    , HH.label [classList "label label-md"] [HH.text "Phone number"]
    , HH.select [ HE.onSelectedIndexChange (HE.input $ UpdatePhoneNumber state.phone_numbers)]
      (map
        (\v -> HH.option
                [HP.selected $ v == state.user.phone_number]
                [HH.text $ fromMaybe "" v]
        )
        state.phone_numbers)
    ]
  ]

updateEmail :: String -> State -> State
updateEmail value state =
  case state of
    ListView _ -> state
    NewUserView internal -> NewUserView (internal { user { email = value } })
    EditUserView internal -> EditUserView (internal { user { email = value } })

updateName :: String -> State -> State
updateName value state =
  case state of
    ListView _ -> state
    NewUserView internal -> NewUserView (internal { user { name = value } })
    EditUserView internal -> EditUserView (internal { user { name = value } })

updatePassword :: String -> State -> State
updatePassword value state =
  case state of
    ListView _ -> state
    NewUserView internal -> NewUserView (internal { user { password = Just value } })
    EditUserView internal -> EditUserView (internal { user { password = Just value } })

updatePhoneNumber :: Maybe String -> State -> State
updatePhoneNumber value state =
  case state of
    ListView _ -> state
    NewUserView internal -> NewUserView (internal { user { phone_number = value } })
    EditUserView internal -> EditUserView (internal { user { phone_number = value } })

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
  render (NewUserView state) =
    formView "New" "Create" true state CreateUser
  render (EditUserView state) =
    formView "Edit" "Update" false state UpdateUser

  eval :: forall a. Query a -> State -> H.ComponentDSL State Query Unit Aff a
  eval (CreateUser next) state@(NewUserView { user:
                                              { avatar_url
                                              , email
                                              , name
                                              , phone_number
                                              , password
                                              }
                                            }) =
    whenRequestSuccessful (User.create avatar_url email name phone_number password) state next
  eval (CreateUser next) _ =
    pure next
  eval (GoToNewUserView next) _ = do
    response <- H.liftAff $ send PhoneNumber.getAll
    case response of
      Left _ -> pure unit
      Right phone_numbers -> H.put $ NewUserView
        { user:
          { avatar_url: Nothing
          , email: ""
          , name: ""
          , phone_number: Nothing
          , password: Nothing
          }
        , phone_numbers:
          phone_numbers
          |> map(\o -> Just o.phone_number)
          |> Array.cons Nothing
        }
    pure next
  eval (GoToEditUserView user next) _ = do
    response <- H.liftAff $ send PhoneNumber.getAll
    case response of
      Left _ -> pure unit
      Right phone_numbers -> H.put $ EditUserView
        { user: user
        , phone_numbers:
          phone_numbers
          |> map(\o -> Just o.phone_number)
          |> Array.cons Nothing
        }
    pure next
  eval (GoToListView next) _ = do
    response <- H.liftAff $ send User.getAll
    case response of
      Left _ -> pure unit
      Right users -> H.put $ ListView { users: Array.sortWith (_.name >>> String.toLower) users }
    pure next
  eval (UpdateField f value next) _ = do
    H.modify_ $ f value
    pure next
  eval (UpdatePhoneNumber phoneNumbers index next) _ = do
    H.modify_ $ Array.index phoneNumbers index |> fromMaybe Nothing |> updatePhoneNumber
    pure next
  eval (UpdateUser next) state@(EditUserView {user}) =
    whenRequestSuccessful (User.update user) state next
  eval (UpdateUser next) _ =
    pure next
  eval (UpdateAvatar event next) state@(EditUserView {user}) = do
    maybeFile <- liftEffect $ fileFromEvent event
    formData <- liftEffect $ FormData.new
    case maybeFile of
      Just file -> do
        _ <- liftEffect $ appendFile formData (EntryName "avatar") file
        whenRequestSuccessful (User.updateAvatar user formData) state next
      Nothing ->
        pure next
  eval (UpdateAvatar event next) _ =
    pure next

  fileFromEvent :: Event -> Effect (Maybe File)
  fileFromEvent event = do
    files <- maybe (pure Nothing) HTMLInputElement.files (target event >>= HTMLInputElement.fromEventTarget)
    pure $ files >>= (FileList.item 0)

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
