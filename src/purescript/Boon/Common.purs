module Boon.Common (
  module Data.Either
  , module Data.Maybe
  , module Effect
  , module Effect.Aff
  , module Prelude
  , (|>)
  ) where

import Data.Either (Either(..))
import Data.Function (applyFlipped)
import Data.Maybe (Maybe(..))
import Effect (Effect)
import Effect.Aff (Aff)
import Prelude

infixl 1 applyFlipped as |>
