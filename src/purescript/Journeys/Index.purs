module Journeys.Index (component, Query) where

import Boon.Common

import Boon.Elements (button, classList, loader)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Properties as HP
import Model.Common (handleRequest)
import Model.Journey (Journey, PaginatedJourneys)
import Model.Journey as Journey


data Resource a
  = Loading
  | Loaded a
  | Failed String

data State
  = ListView { journeys :: Resource PaginatedJourneys }

data Query a
  = LoadJourneys (Maybe String) a


itemRow :: forall p i. Journey -> HH.HTML p i
itemRow journey =
  HH.tr [ classList "journey" ]
    [ HH.td_ [ HH.text journey.name ]
    , HH.td_ [ HH.text $ show journey.type ]
    , HH.td_
      [ HH.span
        [ classList $ if Journey.isPublished journey then "green-bullet" else "yellow-bullet"
        ]
        [ HH.text $ show journey.state ]
      ]
    ]

component :: H.Component HH.HTML Query Unit Unit Aff
component =
  H.lifecycleComponent {
    initialState: const initialState
    , render
    , eval: (\query -> H.get >>= eval query)
    , receiver: const Nothing
    , initializer: Just (H.action $ LoadJourneys Nothing)
    , finalizer: Nothing
    }
  where
  initialState :: State
  initialState = ListView { journeys: Loading }

  render :: State -> H.ComponentHTML Query
  render (ListView { journeys: Loading }) = loader
  render (ListView { journeys: Loaded page }) =
    let
      maybeUrlToQuery = \maybeUrl -> (\url -> LoadJourneys (Just url)) <$> maybeUrl
      prevButtonQuery = maybeUrlToQuery page.links.prev
      nextButtonQuery = maybeUrlToQuery page.links.next in
    HH.div [ classList "content-container" ]
      [ HH.table [ classList "table" ]
        [ HH.thead_
          [ HH.tr_
            [ HH.th_ [ HH.text "Name" ]
            , HH.th_ [ HH.text "type" ]
            , HH.th_ [ HH.text "Status" ]
            ]
          ]
        , HH.tbody_ $ map itemRow page.data.journeys
        , HH.tfoot_
          [ HH.tr_
            [ HH.td [ HP.colSpan 3 ]
              [ button prevButtonQuery "< prev"
              , button nextButtonQuery "next >"
              ]
            ]
          ]
        ]
      ]
  render (ListView { journeys: Failed error }) =
    HH.div_ [HH.text error]

  eval :: forall a. Query a -> State -> H.ComponentDSL State Query Unit Aff a
  eval (LoadJourneys maybeUrl next) _ = do
    H.put $ ListView { journeys: Loading }
    handleRequest
      (Journey.getPage maybeUrl)
      (\page -> do
        H.put $ ListView { journeys: Loaded page }
        pure next
      )
      (pure next)
