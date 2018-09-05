module Model.TZDateTime (TimeZone, TZDateTime(..), format, utc, utc') where

import Boon.Common

import Control.Monad.Except (except)
import Data.Array.NonEmpty (NonEmptyArray, (!!))
import Data.DateTime (DateTime(..), Day, Hour, Millisecond, Minute, Month, Second, Time(..), Year, canonicalDate)
import Data.Either (either, note)
import Data.Enum (toEnum)
import Data.Formatter.DateTime (formatDateTime)
import Data.Int as Int
import Data.List.NonEmpty as List.NonEmpty
import Data.String.Regex as Regex
import Data.String.Regex (Regex)
import Data.String.Regex.Flags (noFlags)
import Data.String.Regex.Unsafe (unsafeRegex)
import Data.Tuple (Tuple(..))
import Foreign (F, Foreign, ForeignError(..))
import Simple.JSON (class ReadForeign, readImpl)


data TimeZone
  = UTC

derive instance eqTimeZone :: Eq TimeZone


newtype TZDateTime = TZDateTime (Tuple DateTime TimeZone)

instance readTZDateTime :: ReadForeign TZDateTime where
  readImpl = readTZDateTime' where
    readString :: Foreign -> F String
    readString = readImpl

    readTZDateTime' :: Foreign -> F TZDateTime
    readTZDateTime' raw = do
      s <- readString raw
      parseDT s

    parseDT :: String -> F TZDateTime
    parseDT s =
      let error = List.NonEmpty.singleton $ ForeignError $ "error parsing date: " <> s
          result = case Regex.match dateTimeRegex s of
            Just m ->
              (utc' <$> m `intAt` 1 <*> m `intAt` 2 <*> m `intAt` 3 <*> m `intAt` 4 <*> m `intAt` 5 <*> m `intAt` 6 <*> m `intAt` 7)
              |> join
              |> note error
            Nothing ->
              Left error
      in
      except result

    intAt :: NonEmptyArray (Maybe String) -> Int -> Maybe Int
    intAt arr index =
      arr !! index
      |> join
      >>= Int.fromString

    dateTimeRegex :: Regex
    dateTimeRegex =
      unsafeRegex "^(\\d{4})-(\\d{2})-(\\d{2})T(\\d{2}):(\\d{2}):(\\d{2}).(\\d{3})\\d+$" noFlags

instance showTZDateTime :: Show TZDateTime where
  show (TZDateTime (Tuple dt UTC)) = (show dt) <> " UTC"

derive instance eqTZDateTime :: Eq TZDateTime


format :: TZDateTime -> String
format (TZDateTime (Tuple dt UTC)) =
  either
    (const "error formatting date")
    identity
    (formatDateTime "MM/DD/YY hh:mm:ss a UTC" dt)

utc :: Year -> Month -> Day -> Hour -> Minute -> Second -> Millisecond -> TZDateTime
utc year month day hour minute second millisecond =
  let date = canonicalDate year month day
      time = Time hour minute second millisecond in
  TZDateTime (Tuple (DateTime date time) UTC)

utc' :: Int -> Int -> Int -> Int -> Int -> Int -> Int -> Maybe TZDateTime
utc' year month day hour minute second millisecond =
  utc <$> toEnum year <*> toEnum month <*> toEnum day <*> toEnum hour <*> toEnum minute <*> toEnum second <*> toEnum millisecond
