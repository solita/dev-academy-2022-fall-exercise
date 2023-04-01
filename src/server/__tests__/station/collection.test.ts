import {
  clear_stations,
  get_stations,
  read_csv_station_data,
  save_station_data,
} from "../../controllers/station"
import { dummy_station_A } from "../../../__mocks__/data"
import Station from "../../models/station"
import path from "path"

const mock_datasets_path = path.join(__dirname, "../../../", "__mocks__", "stations")
const good_stations_csv_file = path.join(mock_datasets_path, "good_stations.csv")
const bad_stations_csv_file = path.join(mock_datasets_path, "bad_stations.csv")

//These test focus on the Station Collection, such as adding and removing documents
describe("Station Collection", () => {
  it("Should save station data", async () => {
    //store station data without _id
    const station = { ...dummy_station_A, _id: undefined }
    await save_station_data(station)

    const saved_station = await Station.findOne({
      _id: station._id,
    })

    expect(saved_station).toBeDefined()
  })

  it("Should delete all station data", async () => {
    await clear_stations()

    const new_document_count = await Station.countDocuments()
    expect(new_document_count).toBe(0)
  })

  it("Should parse valid station data from csv file", async () => {
    await read_csv_station_data(good_stations_csv_file)

    const stored_station = await Station.findOne({
      nimi: dummy_station_A.nimi
    })

    expect(stored_station).toBeDefined()
  })

  it("Should not store station data with duration of less than 10 seconds", async () => {
    //Find a station with a duration less than 10 seconds
    const stored_station = await Station.findOne({
      duration: { $lt: 10 },
    })

    expect(stored_station).toBeNull()
  })

  it("Should not store station data with cover distance of less than 10 meters", async () => {
    //Find a station with a duration less than 10 seconds
    const stored_station = await Station.findOne({
      covered_distance: { $lt: 10 },
    })

    expect(stored_station).toBeNull()
  })

  it("Should not parse invalid station data from csv file", async () => {
    //clear database for test
    await clear_stations()
    const document_count = await Station.countDocuments()
    expect(document_count).toBe(0)

    //No valid station data is stored within this csv file
    await read_csv_station_data(bad_stations_csv_file)

    const new_document_count = await Station.countDocuments()
    expect(new_document_count).toBe(0)
  })
})
