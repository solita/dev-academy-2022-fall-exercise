const app = require("../../index")
import superTest from "supertest"
import { save_journey_data } from "../../controllers/journey"
import { dummy_journey_A } from "../../../__mocks__/data"
import Journey from "../../models/journey"

//Testing the routes from an external perspective
describe("Journey Routes", () => {
  it("Should return 200 when getting journeys", async () => {
    //store journey data without _id
    const new_journey = { ...dummy_journey_A, _id: undefined }
    await save_journey_data(new_journey)

    const saved_journey = await Journey.findOne({
      _id: new_journey._id,
    })

    expect(saved_journey).toBeDefined()
    const response = await superTest(app).get("/journeys").query({
      page: 1,
      limit: 10,
      order: "desc",
      sort: "departure_station_name",
    })

    expect(response.status).toBe(200)
  })
})
