module Test.Model.Journey where

import Boon.Common
import Data.List.NonEmpty (singleton)
import Foreign (ForeignError(..))
import Model.Action (Action(..))
import Model.Journey (Journey)
import Model.Journey as Journey
import Model.JourneyType (JourneyType(..))
import Model.State (State(..))
import Model.Trigger (Trigger(..))
import Test.Unit (TestSuite, describe, it)
import Test.Unit.Assert as Assert


publishedJourney :: Journey
publishedJourney =
  { actions: [ Wait { id: Just 1, for: 60 } ]
  , id: 2
  , name: "Introduction"
  , state: Active
  , triggers: [ PipelineAssigned { id: Just 3, pipelineId: 4 } ]
  , type: Contact
  }

draftJourney :: Journey
draftJourney =
  { actions: []
  , id: 1
  , name: "Introduction"
  , state: Inactive
  , triggers: []
  , type: Contact
  }

encodedSampleJourney :: String
encodedSampleJourney =
  """{"id": 2, "name": "Introduction", "state": "active", "actions": [{"id": 1, "type": "wait", "data": {"for": 60}}], "triggers": [{"id": 3, "type": "pipeline_assigned", "data": {"pipeline_id": 4}}], "type": "contact"}"""

suite :: TestSuite
suite = do
  describe "getPage" do
    it "doesn't send any content" do
      Assert.equal (Journey.getPage Nothing).content Nothing
    it "works for valid JSON" do
      Assert.equal
        ((Journey.getPage Nothing).decoder ("""{"data": {"journeys": [""" <> encodedSampleJourney <> """]}, "links": {"prev": null, "next": "http://example.com/api/journeys?cursor=10"}, "metadata": {"count": 1}}"""))
        (Right { data: { journeys: [ publishedJourney ] }, links: { next: Just "http://example.com/api/journeys?cursor=10", prev: Nothing }, metadata: { count: 1 }})
    it "returns error for invalid JSON" do
      Assert.equal
        ((Journey.getPage Nothing).decoder ("""{"data": {"journey": """ <> encodedSampleJourney <> """}, "links": {"prev": null, "next": null}, "metadata": {"count": 1}}"""))
        (Left (singleton (ErrorAtProperty "data" (ErrorAtProperty "journeys" (TypeMismatch "array" "Undefined")))))

  describe "isPublished" do
    it "returns true when in active state" do
      Assert.equal (Journey.isPublished publishedJourney) true
    it "returns false when in inactive state" do
      Assert.equal (Journey.isPublished draftJourney) false
