module Boon.Forms
  ( fileInputGroup
  , inputGroup
  , labelled
  , selectGroup
  ) where

import Boon.Common

import Boon.Elements (attrsFromMaybeQuery, classIf, classList)
import Data.Array (cons)
import Data.Maybe (Maybe, fromMaybe)
import Data.MediaType (MediaType(..))
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Web.Event.Event (Event)

fileInputGroup :: forall a b. String -> String -> (Event -> Unit -> b Unit) -> HH.HTML a (b Unit)
fileInputGroup label src query =
  labelled label
  [ HH.img [HP.src src]
  , HH.input
    [ HP.type_ HP.InputFile
    , HP.accept $ MediaType ".png, .jpg, .jpeg"
    , HE.onChange $ HE.input query
    ]
  ]

inputGroup :: forall a b. String -> Boolean -> HP.InputType -> Maybe (String -> Unit -> b Unit) -> String -> HH.HTML a (b Unit)
inputGroup label isInvalid inputType maybeQuery value =
  let attrs = attrsFromMaybeQuery (HE.onValueInput <<< HE.input) maybeQuery in
  labelled label
    [ HH.input
      (attrs <>
       [ classIf isInvalid "invalid"
       , HP.type_ inputType
       , HP.value value
       ])
    ]

labelled :: forall a b. String -> Array (HH.HTML a (b Unit)) -> HH.HTML a (b Unit)
labelled label rest =
  HH.div_ $ cons labelEl rest
  where
    labelEl = HH.label [classList "label label-md"] [HH.text label]

selectGroup :: forall a b. String -> (Array (Maybe String) -> Int -> Unit -> a Unit) -> Maybe String -> Array (Maybe String) -> HH.HTML b (a Unit)
selectGroup label query selected options =
  labelled label
  [ HH.select [HE.onSelectedIndexChange (HE.input $ query options)]
    (map
      (\v -> HH.option
              [HP.selected $ v == selected]
              [HH.text $ fromMaybe "" v]
      )
      options)
  ]
