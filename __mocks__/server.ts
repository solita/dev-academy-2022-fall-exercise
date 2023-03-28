import { DefaultBodyType, MockedRequest, rest, RestHandler } from "msw"
import { setupServer } from "msw/node"
import { Stored_journey_data, Stored_station_data } from "../src/common"
import { Journey_query_result } from "../src/server/controllers/journey"
import { Station_query_result } from "../src/server/controllers/station"

export const dummy_journey: Stored_journey_data = {
  _id: "123",
  departure_date: "2021-01-01",
  return_date: "2021-01-02",
  departure_station_id: "123",
  departure_station_name: "Helsinki",
  return_station_id: "456",
  return_station_name: "Tampere",
  covered_distance: 1000,
  duration: 1000,
}

export const dummy_journey_data: Journey_query_result = {
  journeys: [dummy_journey],
  total_journeys: 1,
  total_pages: 1,
}

export const dummy_station: Stored_station_data = {
  _id: "123",
  fid: "123",
  station_id: "123",
  nimi: "Helsinki",
  namn: "Helsinki",
  name: "Helsinki",
  osoite: "Golfpolku 3",
  adress: "",
  kaupunki: "Espoo",
  stad: "Esbo",
  operaattor: "CityBike Finland",
  kapasiteet: "10",
  x: 111.111,
  y: 222.222
}

export const dummy_station_data: Station_query_result = {
  stations: [dummy_station],
  total_stations: 1,
  total_pages: 1,
}

const handlers:RestHandler<MockedRequest<DefaultBodyType>>[] = [
  rest.get("http://localhost/journeys", (req, res, ctx) => {
    console.log("journey request")
    return res(ctx.json(dummy_journey_data))
  }),
  rest.get("http://localhost/stations", (req, res, ctx) => {
    console.log("station request")
    return res(ctx.json(dummy_station_data))
  })
]

const server = setupServer(...handlers)

export default server