module Boon.Elements (
  button
  , classIf
  , classList
  , itemList
  , loader
  , onClick
  ) where

import Boon.Common
import Data.String.Common (split)
import Data.String.Pattern (Pattern(Pattern))
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Web.UIEvent.MouseEvent (MouseEvent)


button :: forall q. Maybe (Unit -> q Unit) -> String -> HH.HTML Void (q Unit)
button maybeQuery label =
  let attrs = case maybeQuery of
        Just query -> [onClick query]
        Nothing -> [HP.disabled true] in
  HH.button (attrs <> [classList "boon-button"])
  [HH.text label]

classIf :: forall i r. Boolean -> String -> HP.IProp ( "class" :: String | r ) i
classIf condition klass =
  classList $ if condition then klass else ""

classList :: forall i r. String -> HP.IProp ( "class" :: String | r ) i
classList classes =
  classes
  |> split (Pattern " ")
  |> map HH.ClassName
  |> HP.classes

itemList :: forall q. Array {label :: String, query :: (Unit -> q Unit)} -> HH.HTML Void (q Unit)
itemList items =
  items
  |> map (\r -> HH.div [classList "item", onClick r.query] [HH.text r.label])
  |> HH.div [classList "item-list"]

onClick :: forall q r. (Unit -> q Unit) -> HP.IProp ( onClick :: MouseEvent | r ) (q Unit)
onClick query =
  HE.onClick (HE.input_ query)

loader :: forall p i. HH.HTML p i
loader =
  HH.div [ classList "loader" ] []
