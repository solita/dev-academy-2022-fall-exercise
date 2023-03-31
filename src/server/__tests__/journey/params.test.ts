import {
  get_journeys,
  save_journey_data,
} from "../../controllers/journey"
import { dummy_journey_A, dummy_journey_B } from "../../../__mocks__/data"
import journey from "../../models/journey"

//Testing the controller from an internal perspective
describe("Get Journeys Params", () => {
  it("Should give 400 if page query param is invalid", async () => {
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
        page: 0,
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
        page: 0,
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
        page: 0,
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
  })

  it("Should sort items in desc order correctly", async () => {
    //have two journeys in the database for these tests
    //@ts-ignore the id is not expected but it is removed
    await save_journey_data({ ...dummy_journey_A, _id: undefined })
    //@ts-ignore
    await save_journey_data({ ...dummy_journey_B, _id: undefined })
    const count = await journey.countDocuments()
    expect(count).toBe(2)

    const mock_request: any = {
      query: {
        page: 0,
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
    expect(mock_response.status).toBeCalledWith(200)

    const journeys = mock_response.json.mock.calls[0][0].journeys 

    const first_journey = journeys[0]
    expect(first_journey).toBeDefined()
    const second_journey = journeys[1]
    expect(second_journey).toBeDefined()
    
    expect(first_journey.departure_station_name).toBe(dummy_journey_B.departure_station_name)
    expect(second_journey.departure_station_name).toBe(dummy_journey_A.departure_station_name)
  })

  it("Should sort items in asc order correctly", async () => {
    //have two journeys in the database for these tests
    //@ts-ignore the id is not expected but it is removed
    await save_journey_data({ ...dummy_journey_A, _id: undefined })
    //@ts-ignore
    await save_journey_data({ ...dummy_journey_B, _id: undefined })
    const count = await journey.countDocuments()
    expect(count).toBe(2)

    const mock_request: any = {
      query: {
        page: 0,
        limit: 10,
        order: "asc",
        sort: "departure_station_name",
      },
    }

    const mock_response: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    }

    await get_journeys(mock_request, mock_response)
    expect(mock_response.status).toBeCalledWith(200)

    const journeys = mock_response.json.mock.calls[0][0].journeys 

    const first_journey = journeys[0]
    expect(first_journey).toBeDefined()
    const second_journey = journeys[1]
    expect(second_journey).toBeDefined()
    
    expect(first_journey.departure_station_name).toBe(dummy_journey_A.departure_station_name)
    expect(second_journey.departure_station_name).toBe(dummy_journey_B.departure_station_name)
  })
})
