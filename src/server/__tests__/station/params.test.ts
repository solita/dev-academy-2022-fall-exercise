import {
  clear_stations,
  get_stations,
  save_station_data,
} from "../../controllers/station"
import { dummy_station_A } from "../../../__mocks__/data"
import Station from "../../models/station"

//Testing the controller from an internal perspective
describe("Station Params", () => {
  it("Should give 400 if page query param is invalid", async () => {
    //Have one station in database
    const station = { ...dummy_station_A, _id: undefined }
    await save_station_data(station)

    const mock_request: any = {
      query: {
        page: "not_valid",
        limit: 10,
        order: "desc",
        sort: "nimi",
      },
    }

    const mock_response: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    }

    await get_stations(mock_request, mock_response)
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
        sort: "nimi",
      },
    }

    const mock_response: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    }

    await get_stations(mock_request, mock_response)
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
        sort: "nimi",
      },
    }

    const mock_response: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    }

    await get_stations(mock_request, mock_response)
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

    await get_stations(mock_request, mock_response)
    expect(mock_response.status).toBeCalledWith(400)
    expect(mock_response.json.mock.calls[0][0].message).toBe(
      'Invalid query params : "sort" must be one of [nimi, namn, osoite, kapasiteet]'
    )

    //clear database for test
    await clear_stations()
    const document_count = await Station.countDocuments()
    expect(document_count).toBe(0)
  })
})
