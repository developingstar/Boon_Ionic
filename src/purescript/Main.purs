module Main where

import Boon.Common
import Halogen.Aff as HA
import Halogen.VDom.Driver (runUI)
import Web.HTML (HTMLElement)

import Settings.CustomFields as Settings.CustomFields
import Settings.TeamMembers as Settings.TeamMembers


showSettingsCustomFields :: HTMLElement -> Effect Unit
showSettingsCustomFields el =
  HA.runHalogenAff do
    runUI Settings.CustomFields.component unit el


showSettingsTeamMembers :: HTMLElement -> Effect Unit
showSettingsTeamMembers el =
  HA.runHalogenAff do
    runUI Settings.TeamMembers.component unit el
