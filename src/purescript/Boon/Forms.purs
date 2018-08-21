module Boon.Forms
  ( fileInputGroup
  , inputGroup
  , selectGroup
  ) where

import Boon.Common

import Boon.Elements (classIf, classList)
import Data.Maybe (Maybe, fromMaybe)
import Data.MediaType (MediaType(..))
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Web.Event.Event (Event)

fileInputGroup :: forall a b. String -> String -> (Event -> Unit -> b Unit) -> HH.HTML a (b Unit)
fileInputGroup label src query =
  HH.div_
    [ HH.label [classList "label label-md"] [HH.text label]
    , HH.img [HP.src src]
    , HH.input
      [ HP.type_ HP.InputFile
      , HP.accept $ MediaType ".png, .jpg, .jpeg"
      , HE.onChange $ HE.input query
      ]
    ]

inputGroup :: forall a b. String -> Boolean -> HP.InputType -> (String -> Unit -> b Unit) -> String -> HH.HTML a (b Unit)
inputGroup label isValid inputType query value =
  HH.div_
    [ HH.label [classList "label label-md"] [HH.text label]
    , HH.input
      [ classIf isValid "invalid"
      , HP.type_ inputType
      , HE.onValueInput $ HE.input query
      , HP.value value
      ]
    ]

selectGroup :: forall a b. String -> (Array (Maybe String) -> Int -> Unit -> a Unit) -> Maybe String -> Array (Maybe String) -> HH.HTML b (a Unit)
selectGroup label query selected options =
  HH.div_
    [ HH.label [classList "label label-md"] [HH.text label]
    , HH.select [HE.onSelectedIndexChange (HE.input $ query options)]
      (map
        (\v -> HH.option
                [HP.selected $ v == selected]
                [HH.text $ fromMaybe "" v]
        )
        options)
    ]
