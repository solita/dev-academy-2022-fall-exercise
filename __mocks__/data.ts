import { Stored_journey_data, Stored_station_data } from "../src/common"

//One journey
export const dummy_journey: Stored_journey_data = {
  _id: "1",
  departure_date: "2021-01-01",
  return_date: "2021-01-02",
  departure_station_id: "1",
  departure_station_name: "departure_station_A",
  return_station_id: "1",
  return_station_name: "return_station_A",
  covered_distance: 1000,
  duration: 1000,
}

//List of journeys
export const dummy_journeys: Stored_journey_data[] = [
  {
    _id: "1",
    departure_date: "2021-01-01",
    return_date: "2021-01-02",
    departure_station_id: "1",
    departure_station_name: "departure_station_A",
    return_station_id: "1",
    return_station_name: "return_station_A",
    covered_distance: 1000,
    duration: 1000,
  },
  {
    _id: "2",
    departure_date: "2021-01-02",
    return_date: "2021-01-03",
    departure_station_id: "2",
    departure_station_name: "departure_station_B",
    return_station_id: "2",
    return_station_name: "departure_station_B",
    covered_distance: 2000,
    duration: 2000,
  },
]

export const dummy_station: Stored_station_data = {
  _id: "1",
  fid: "1",
  station_id: "1",
  nimi: "station_A",
  namn: "station_A",
  name: "station_A",
  osoite: "address_A",
  adress: "address_A",
  kaupunki: "city_A",
  stad: "city_A",
  operaattor: "operator_A",
  kapasiteet: "10",
  x: 111.111,
  y: 111.111,
}

export const dummy_stations: Stored_station_data[] = [
  {
    _id: "1",
    fid: "1",
    station_id: "1",
    nimi: "station_A",
    namn: "station_A",
    name: "station_A",
    osoite: "address_A",
    adress: "address_A",
    kaupunki: "city_A",
    stad: "city_A",
    operaattor: "operator_A",
    kapasiteet: "10",
    x: 111.111,
    y: 111.111,
  },
  {
    _id: "2",
    fid: "2",
    station_id: "2",
    nimi: "station_B",
    namn: "station_B",
    name: "station_B",
    osoite: "address_B",
    adress: "address_B",
    kaupunki: "city_B",
    stad: "city_B",
    operaattor: "operator_B",
    kapasiteet: "20",
    x: 222.222,
    y: 222.222,
  },
]
