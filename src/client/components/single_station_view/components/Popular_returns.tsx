import {
  EuiListGroupItem,
  EuiTitle,
  EuiSpacer,
  EuiListGroup,
  EuiSkeletonText,
  EuiPanel,
} from "@elastic/eui"
import React from "react"
import { FC } from "react"
import { Station_stats } from "src/server/controllers/station"

interface Popular_returns_props {
  station_stats: Station_stats | undefined
  switch_station: (station_id: string) => void
}

const Popular_returns: FC<Popular_returns_props> = ({
  station_stats,
  switch_station,
}) => {
  const top_return_stations_list = station_stats?.top_5_return_stations.map(
    (station, index) => (
      <EuiListGroupItem
        key={station._id}
        color="primary"
        onClick={() => switch_station(station._id)}
        label={`${index + 1}. ${station.nimi}`}
      />
    )
  )

  return (
    <>
      <EuiTitle size="s">
        <h2>Return stations</h2>
      </EuiTitle>
      <EuiSpacer size="s" />
      <EuiListGroup flush={true} bordered={true}>
        {station_stats ? top_return_stations_list : <EuiSkeletonText lines={5} />}
      </EuiListGroup>
    </>
  )
}

export default Popular_returns
