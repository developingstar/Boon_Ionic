module Boon.Bridge
  ( ToastType
  , apiBaseUrl
  , appendFile
  , showToast
  , success
  , warning
  ) where

import Boon.Common

import Web.File.File (File)
import Web.XHR.FormData (EntryName, FormData)

type ToastType = String

success :: ToastType
success = "success"

warning :: ToastType
warning = "warning"

foreign import apiBaseUrl :: Effect String
foreign import appendFile :: FormData -> EntryName -> File -> Effect Unit
foreign import showToast :: ToastType -> Int -> String -> Effect Unit
