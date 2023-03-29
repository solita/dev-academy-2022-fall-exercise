import { DefaultBodyType, MockedRequest, rest, RestHandler } from "msw"
import { setupServer } from "msw/node"
import { Journey_query_result } from "../src/server/controllers/journey"
import { Station_query_result } from "../src/server/controllers/station"
import { dummy_journeys, dummy_station } from "./data"

export const dummy_journey_data: Journey_query_result = {
  journeys: dummy_journeys,
  total_journeys: 2,
  total_pages: 1,
}

export const dummy_station_data: Station_query_result = {
  stations: [dummy_station],
  total_stations: 2,
  total_pages: 1,
}

const handlers: RestHandler<MockedRequest<DefaultBodyType>>[] = [
  rest.get("http://localhost/journeys", (req, res, ctx) => {
    return res(ctx.json(dummy_journey_data))
  }),
  rest.get("http://localhost/stations", (req, res, ctx) => {
    return res(ctx.json(dummy_station_data))
  }),
]

const server = setupServer(...handlers)

export default server
