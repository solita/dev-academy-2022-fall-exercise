import {
  clear_stations,
  get_stations,
  save_station_data,
} from "../../controllers/station"
import { dummy_station_A, dummy_station_B } from "../../../__mocks__/data"
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

  it("Should sort items in desc order correctly", async () => {
    //have two stations in the database for these tests
    //@ts-ignore the id is not expected but it is removed
    await save_station_data({ ...dummy_station_A, _id: undefined })
    //@ts-ignore
    await save_station_data({ ...dummy_station_B, _id: undefined })
    const count = await Station.countDocuments()
    expect(count).toBe(2)

    const mock_request: any = {
      query: {
        page: 0,
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
    expect(mock_response.status).toBeCalledWith(200)

    const stations = mock_response.json.mock.calls[0][0].stations 

    const first_station = stations[0]
    expect(first_station).toBeDefined()
    const second_station = stations[1]
    expect(second_station).toBeDefined()
    
    expect(first_station.nimi).toBe(dummy_station_B.nimi)
    expect(second_station.nimi).toBe(dummy_station_A.nimi)
  })

  it("Should sort items in asc order correctly", async () => {
    //have two stations in the database for these tests
    //@ts-ignore the id is not expected but it is removed
    await save_station_data({ ...dummy_station_A, _id: undefined })
    //@ts-ignore
    await save_station_data({ ...dummy_station_B, _id: undefined })
    const count = await Station.countDocuments()
    expect(count).toBe(2)

    const mock_request: any = {
      query: {
        page: 0,
        limit: 10,
        order: "asc",
        sort: "nimi",
      },
    }

    const mock_response: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    }

    await get_stations(mock_request, mock_response)
    expect(mock_response.status).toBeCalledWith(200)

    const stations = mock_response.json.mock.calls[0][0].stations 

    const first_station = stations[0]
    expect(first_station).toBeDefined()
    const second_station = stations[1]
    expect(second_station).toBeDefined()
    
    expect(first_station.nimi).toBe(dummy_station_A.nimi)
    expect(second_station.nimi).toBe(dummy_station_B.nimi)
  })
})
