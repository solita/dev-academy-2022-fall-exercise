import {
  EuiListGroupItem,
  EuiTitle,
  EuiSpacer,
  EuiListGroup,
  EuiSkeletonText,
} from "@elastic/eui"
import React from "react"
import { FC } from "react"
import { Station_stats } from "src/server/controllers/station"

interface Popular_departures_props {
  station_stats: Station_stats | undefined
  switch_station: (station_id: string) => void
}
const Popular_departures: FC<Popular_departures_props> = ({
  station_stats,
  switch_station,
}) => {
  const top_departure_stations_list = station_stats?.top_5_departure_stations.map(
    (station, index) => (
      <EuiListGroupItem
        key={station._id}
        //Adding colour to make the item look more clickable
        color="primary"
        onClick={() => switch_station(station._id)}
        label={`${index + 1}. ${station.nimi}`}
      />
    )
  )

  return (
    <>
      <EuiTitle size="s">
        <h2>Departing stations</h2>
      </EuiTitle>
      <EuiSpacer size="s" />
      <EuiListGroup flush={true} bordered={true} title="Ending from here">
        {station_stats ? top_departure_stations_list : <EuiSkeletonText lines={5} />}
      </EuiListGroup>
    </>
  )
}

export default Popular_departures