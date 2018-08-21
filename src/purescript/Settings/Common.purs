module Settings.Common (formHeader) where

import Boon.Common

import Boon.Elements (button, classList, onClick)
import Halogen.HTML as HH
import Halogen.HTML.Properties as HP

formHeader :: forall a. String -> String -> String -> (Unit -> a Unit) -> Maybe (Unit -> a Unit) -> HH.HTML Void (a Unit)
formHeader headerAction buttonAction label goBackQuery buttonQuery =
  HH.div [HP.class_ $ HH.ClassName "header"]
    [ HH.div_
      [ HH.a [classList "back-link", onClick goBackQuery] [HH.text "< Back"]
      , HH.h2_ [HH.text $ headerAction <> " " <> label]
      ]
    , button buttonQuery $ buttonAction <> " " <> label
    ]
