import {
  clear_journeys,
  get_journeys,
  save_journey_data,
} from "../../controllers/journey"
import { dummy_journey_A } from "../../../__mocks__/data"
import Journey from "../../models/journey"

//Testing the controller from an internal perspective 
describe("Journey Params", () => {
  it("Should give 400 if page query param is invalid", async () => {
    //Have one journey in database
    const journey = { ...dummy_journey_A, _id: undefined }
    await save_journey_data(journey)

    const mock_request: any = {
      query: {
        page: "not_valid",
        limit: 10,
        order: "desc",
        sort: "departure_station_name",
      },
    }

    const mock_response: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    }

    await get_journeys(mock_request, mock_response)
    expect(mock_response.status).toBeCalledWith(400)
    expect(mock_response.json.mock.calls[0][0].message).toBe(
      'Invalid query params : "page" must be a number'
    )
  })

  it("Should give 400 if limit query param is invalid", async () => {
    const mock_request: any = {
      query: {
        page: 1,
        limit: "not_valid",
        order: "desc",
        sort: "departure_station_name",
      },
    }

    const mock_response: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    }

    await get_journeys(mock_request, mock_response)
    expect(mock_response.status).toBeCalledWith(400)
    expect(mock_response.json.mock.calls[0][0].message).toBe(
      'Invalid query params : "limit" must be a number'
    )
  })

  it("Should give 400 if order query param is invalid", async () => {
    const mock_request: any = {
      query: {
        page: 1,
        limit: 10,
        order: "not_valid",
        sort: "departure_station_name",
      },
    }

    const mock_response: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    }

    await get_journeys(mock_request, mock_response)
    //check that returned status is 400

    expect(mock_response.status).toBeCalledWith(400)
    expect(mock_response.json.mock.calls[0][0].message).toBe(
      'Invalid query params : "order" must be one of [asc, desc]'
    )
  })

  it("Should give 400 if sort query param is invalid", async () => {
    const mock_request: any = {
      query: {
        page: 1,
        limit: 10,
        order: "desc",
        sort: "fake_key",
      },
    }

    const mock_response: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    }

    await get_journeys(mock_request, mock_response)
    expect(mock_response.status).toBeCalledWith(400)
    expect(mock_response.json.mock.calls[0][0].message).toBe(
      'Invalid query params : "sort" must be one of [departure_station_name, return_station_name, covered_distance, duration]'
    )

    //clear database for test
    await clear_journeys()
    const document_count = await Journey.countDocuments()
    expect(document_count).toBe(0)
  })
})
