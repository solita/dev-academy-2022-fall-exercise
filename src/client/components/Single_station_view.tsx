import { Chart, Metric } from "@elastic/charts"
import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiIcon,
  EuiListGroup,
  EuiListGroupItem,
  EuiModal,
  EuiModalBody,
  EuiPanel,
  EuiSkeletonText,
  EuiSkeletonTitle,
  EuiSpacer,
  EuiText,
  EuiTitle,
} from "@elastic/eui"
import axios from "axios"
import React, { CSSProperties, FC, useEffect, useState } from "react"
import { Stored_station_data } from "../../../src/common"
import { Station_stats } from "../../../src/server/controllers/station"

interface Single_station_view_props {
  station_doc_id: string
  on_close: () => void
}

const Single_station_view: FC<Single_station_view_props> = ({
  station_doc_id,
  on_close,
}) => {
  const [station, set_station] = useState<Stored_station_data>()
  const [station_stats, set_station_stats] = useState<Station_stats>()

  const get_station = async () => {
    try {
      const response = await axios.get<Stored_station_data>(
        `/stations/${station_doc_id}`
      )

      set_station(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const get_station_stats = async () => {
    try {
      const response = await axios.get<Station_stats>(
        `/stations/${station_doc_id}/stats`
      )
      set_station_stats(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    get_station()
    get_station_stats()
  }, [])

  const convert_distance_to_km = (distance: number) => {
    if (distance < 1000) {
      return `${distance} m`
    } else {
      return `${(distance / 1000).toFixed(2)} km`
    }
  }

  //TODO Add trend data into chart
  const distance_chart = (
    <Chart>
      <Metric
        id="metricId"
        data={[
          [
            {
              color: "#6ECCB1",
              icon: () => <EuiIcon type="arrowRight" />,
              title: "Journeys started at this station",
              value: station_stats?.average_distance_started ?? 0,
              valueFormatter: convert_distance_to_km,
            },
          ],
          [
            {
              color: "#6ECCB1",
              icon: () => <EuiIcon type="arrowLeft" />,
              title: "Journeys ended at this station",
              value: station_stats?.average_distance_ended ?? 0,
              valueFormatter: convert_distance_to_km,
            },
          ],
        ]}
      />
    </Chart>
  )

  const distance_stat_column = (
    <EuiFlexGroup direction="column">
      <EuiFlexItem grow={false}>
        <EuiPanel>
          <EuiText>Average Covered Distance</EuiText>
        </EuiPanel>
      </EuiFlexItem>

      <EuiFlexItem grow={true}>
        <EuiPanel>{distance_chart}</EuiPanel>
      </EuiFlexItem>
    </EuiFlexGroup>
  )

  const popular_return_station_chart = (
    <>
      <EuiTitle size="s">
        <h2>Staring from here</h2>
      </EuiTitle>
      <EuiSpacer size="s" />
      <EuiListGroup flush={true} bordered={true}>
        {station_stats?.top_5_return_stations.map((station, index) => (
          <EuiListGroupItem label={`${index + 1}. ${station.nimi}`} />
        ))}
      </EuiListGroup>
    </>
  )

  const popular_departure_station_chart = (
    <>
      <EuiTitle size="s">
        <h2>Ending from here</h2>
      </EuiTitle>
      <EuiSpacer size="s" />
      <EuiListGroup flush={true} bordered={true} title="Ending from here">
        {station_stats?.top_5_departure_stations.map((station, index) => (
          <EuiListGroupItem label={`${index + 1}. ${station.nimi}`} />
        ))}
      </EuiListGroup>
    </>
  )

  const popular_stat_column = (
    <EuiFlexGroup direction="column">
      <EuiFlexItem grow={false}>
        <EuiPanel>
          <EuiText>Top Popular stations</EuiText>
        </EuiPanel>
      </EuiFlexItem>

      <EuiFlexItem grow={true}>
        <EuiPanel>{popular_return_station_chart}</EuiPanel>
      </EuiFlexItem>

      <EuiFlexItem grow={true}>
        <EuiPanel>{popular_departure_station_chart}</EuiPanel>
      </EuiFlexItem>
    </EuiFlexGroup>
  )

  const graph_columns = (
    <EuiFlexGroup direction="row" style={{ height: "100%" }}>
      <EuiFlexItem grow={false} style={{ width: "100%" }}>
        {distance_stat_column}
      </EuiFlexItem>

      <EuiFlexItem grow={false} style={{ width: "100%" }}>
        {popular_stat_column}
      </EuiFlexItem>
    </EuiFlexGroup>
  )

  const station_name = station?.nimi ?? <EuiSkeletonTitle />
  const station_address = station?.osoite ?? <EuiSkeletonText lines={1} />
  const title_and_address = (
    <>
      <EuiTitle size="l">
        <EuiText>{station_name}</EuiText>
      </EuiTitle>

      <EuiTitle size="s">
        <EuiFlexGroup direction="row" gutterSize="xs" alignItems="baseline">
          <EuiFlexItem grow={false}>
            <EuiIcon type="visMapCoordinate" />
          </EuiFlexItem>
          <EuiFlexItem grow={true}>
            <EuiText size="m">{station_address}</EuiText>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiTitle>
    </>
  )

  const journeys_started_display = station_stats ? (
    <EuiText size="s">{station_stats.total_journeys_started}</EuiText>
  ) : (
    <EuiSkeletonText lines={1} />
  )

  const journeys_ended_display = station_stats ? (
    <EuiText size="s">{station_stats.total_journeys_ended}</EuiText>
  ) : (
    <EuiSkeletonText lines={1} />
  )

  const station_total_stats = (
    <EuiTitle>
      <>
        <EuiFlexGroup gutterSize="s" direction="row">
          <EuiFlexItem grow={false}>
            <EuiText size="s">Journeys started:</EuiText>
          </EuiFlexItem>
          <EuiFlexItem grow={true}>{journeys_started_display}</EuiFlexItem>
        </EuiFlexGroup>

        <EuiFlexGroup gutterSize="s" direction="row">
          <EuiFlexItem grow={false}>
            <EuiText size="s">Journeys ended:</EuiText>
          </EuiFlexItem>
          <EuiFlexItem grow={true}>{journeys_ended_display}</EuiFlexItem>
        </EuiFlexGroup>
      </>
    </EuiTitle>
  )

  const information_section = (
    <EuiFlexGroup direction="column" style={{ height: "100%" }}>
      <EuiFlexItem grow={false}>
        <EuiPanel>
          <EuiFlexGroup direction="row">
            <EuiFlexItem grow={false}>{title_and_address}</EuiFlexItem>
            <EuiFlexItem grow={true}>{station_total_stats}</EuiFlexItem>
          </EuiFlexGroup>
        </EuiPanel>
      </EuiFlexItem>

      <EuiFlexItem grow={true}>
        <EuiPanel>{graph_columns}</EuiPanel>
      </EuiFlexItem>
    </EuiFlexGroup>
  )

  const station_map_section = (
    <EuiPanel>
      <img
        src="https://tse3.mm.bing.net/th?id=OIP.-sWDGQIVT4rMmi7mHvvCQwAAAA&pid=Api"
        width="100%"
        height="100%"
      ></img>
    </EuiPanel>
  )

  const modal_style: CSSProperties = {
    maxWidth: "90vw",
    width: "89vw",
    height: "89vh",
    maxHeight: "90vh",
    //This will ensure that the modal displays in the center of the screen
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  }

  return (
    <EuiModal onClose={on_close} style={modal_style}>
      <EuiModalBody>
        <EuiFlexGroup style={{ height: "100%" }}>
          <EuiFlexItem grow={true}>{information_section}</EuiFlexItem>
          <EuiFlexItem grow={true}>{station_map_section}</EuiFlexItem>
        </EuiFlexGroup>
      </EuiModalBody>
    </EuiModal>
  )
}

export default Single_station_view