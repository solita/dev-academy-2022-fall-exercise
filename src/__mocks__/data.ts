import moment from "moment"
import { Stored_journey_data, Stored_station_data } from "../common"

export const dummy_journey_A: Stored_journey_data = {
  _id: "1",
  departure_date: moment("2021-01-01"),
  return_date: moment("2021-01-02"),
  departure_station_id: "1",
  departure_station_name: "departure_station_A",
  return_station_id: "2",
  return_station_name: "return_station_A",
  covered_distance: 1000,
  duration: 1000,
}

export const dummy_journey_B: Stored_journey_data = {
  _id: "2",
  departure_date: moment("2021-01-02"),
  return_date: moment("2021-01-03"),
  departure_station_id: "3",
  departure_station_name: "departure_station_B",
  return_station_id: "4",
  return_station_name: "return_station_B",
  covered_distance: 2000,
  duration: 2000,
}

//List of journeys
export const dummy_journeys: Stored_journey_data[] = [dummy_journey_A, dummy_journey_B]

//Values need to be unique to help with testing
export const dummy_station_A: Stored_station_data = {
  _id: "1",
  fid: "1",
  station_id: "1",
  nimi: "finnish_station_A",
  namn: "swedish_station_A",
  name: "english_station_A",
  osoite: "finnish_address_A",
  adress: "swedish_address_A",
  kaupunki: "finnish_city_A",
  stad: "swedish_city_A",
  operaattor: "operator_A",
  kapasiteet: "10",
  x: 111.111,
  y: 111.111,
}

export const dummy_station_B: Stored_station_data = {
  _id: "2",
  fid: "2",
  station_id: "2",
  nimi: "finnish_station_B",
  namn: "swedish_station_B",
  name: "english_station_B",
  osoite: "finnish_address_B",
  adress: "swedish_address_B",
  kaupunki: "finnish_city_B",
  stad: "swedish_city_B",
  operaattor: "operator_B",
  kapasiteet: "20",
  x: 222.222,
  y: 222.222,
}

export const dummy_stations: Stored_station_data[] = [dummy_station_A, dummy_station_B]
