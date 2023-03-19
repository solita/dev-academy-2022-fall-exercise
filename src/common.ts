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
