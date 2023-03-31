const app = require("../../index")
import superTest from "supertest"
import { save_station_data } from "../../controllers/station"
import { dummy_station_A } from "../../../__mocks__/data"
import Station from "../../models/station"

//Testing the routes from an external perspective
describe("Station Routes", () => {
  it("Should return 200 when getting stations", async () => {
    //store station data without _id
    const new_station = { ...dummy_station_A, _id: undefined }
    await save_station_data(new_station)

    const saved_station = await Station.findOne({
      _id: new_station._id,
    })

    expect(saved_station).toBeDefined()
    const response = await superTest(app).get("/stations").query({
      page: 1,
      limit: 10,
      order: "desc",
      sort: "nimi",
    })

    expect(response.status).toBe(200)
  })
})
