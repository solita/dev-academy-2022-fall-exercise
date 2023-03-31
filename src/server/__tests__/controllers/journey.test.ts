import {
  clear_journeys,
  get_journeys,
  read_csv_journey_data,
  save_journey_data,
} from "../../controllers/journey"
import { dummy_journey_A } from "../../../__mocks__/data"
import Journey from "../../models/journey"
import path from "path"

const mock_datasets_path = path.join(__dirname, "../../../", "__mocks__", "journeys")
const good_journeys_csv_file = path.join(mock_datasets_path, "good_journeys.csv")
const bad_journeys_csv_file = path.join(mock_datasets_path, "bad_journeys.csv")

describe("Journey Controller", () => {
  it("Should save journey data", async () => {
    //store journey data without _id
    const journey = { ...dummy_journey_A, _id: undefined }
    await save_journey_data(journey)

    const saved_journey = await Journey.findOne({
      _id: journey._id,
    })

    expect(saved_journey).toBeDefined()
  })

  it("Should delete all journey data", async () => {
    await clear_journeys()

    const new_document_count = await Journey.countDocuments()
    expect(new_document_count).toBe(0)
  })

  it("Should parse valid journey data from csv file", async () => {
    await read_csv_journey_data(good_journeys_csv_file)

    const stored_journey = await Journey.findOne({
      departure_station_name: dummy_journey_A.departure_station_name,
    })

    expect(stored_journey).toBeDefined()
  })

  it("Should not store journey data with duration of less than 10 seconds", async () => {
    //Find a journey with a duration less than 10 seconds
    const stored_journey = await Journey.findOne({
      duration: { $lt: 10 },
    })

    expect(stored_journey).toBeNull()
  })

  it("Should not store journey data with cover distance of less than 10 meters", async () => {
    //Find a journey with a duration less than 10 seconds
    const stored_journey = await Journey.findOne({
      covered_distance: { $lt: 10 },
    })

    expect(stored_journey).toBeNull()
  })

  it("Should not parse invalid journey data from csv file", async () => {
    //clear database for test
    await clear_journeys()
    const document_count = await Journey.countDocuments()
    expect(document_count).toBe(0)

    //No valid journey data is stored within this csv file
    await read_csv_journey_data(bad_journeys_csv_file)

    const new_document_count = await Journey.countDocuments()
    expect(new_document_count).toBe(0)
  })

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
