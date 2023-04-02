import moment from "moment"

export interface Journey_csv_data {
  Departure: string
  Return: string
  "Departure station id": string
  "Departure station name": string
  "Return station id": string
  "Return station name": string
  "Covered distance (m)": string
  "Duration (sec.)": string
}

export interface Journey_data {
  departure_date: string
  return_date: string
  departure_station_id: string
  departure_station_name: string
  return_station_id: string
  return_station_name: string
  covered_distance: number
  duration: number
}

export interface Stored_journey_data extends Journey_data {
  _id: string;
}

export interface Station_csv_data {
  FID: string
  ID: string
  Nimi: string
  Namn: string
  Name: string
  Osoite: string
  Adress: string
  Kaupunki: string
  Stad: string
  Operaattor: string
  Kapasiteet: string
  x: string
  y: string
}

export interface Station_data {
  fid: string
  station_id: string
  nimi: string
  namn: string
  name: string
  osoite: string
  adress: string
  kaupunki: string
  stad: string
  operaattor: string
  kapasiteet: string
  x: number
  y: number
}

export interface Stored_station_data extends Station_data {
  _id: string;
}