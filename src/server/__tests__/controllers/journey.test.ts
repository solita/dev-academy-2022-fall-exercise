import { Journey_data } from "src/common"
import { dummy_journey_A } from "../../../__mocks__/data"
import Journey from "../../models/journey"

describe("Journey Controller", () => {
  it("Should save journey data", async () => {
    //store journey data in without _id
    const journey = new Journey({ ...dummy_journey_A, _id: undefined })
    await journey.save()

    const saved_journey = await Journey.findOne({
      _id: journey._id,
    })

    console.log(saved_journey)
    expect(saved_journey).toBeDefined()
  })
})
