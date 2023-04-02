import { Chart, Metric } from "@elastic/charts"
import {
  EuiDatePicker,
  EuiDatePickerRange,
  EuiFlexGroup,
  EuiFlexItem,
  EuiIcon,
  EuiListGroup,
  EuiListGroupItem,
  EuiLoadingSpinner,
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

import "leaflet/dist/leaflet.css"
import "leaflet/dist/images/marker-icon.png"
import "leaflet/dist/images/marker-shadow.png"
import "leaflet/dist/images/marker-icon-2x.png"
import "leaflet/dist/images/layers.png"
import "leaflet/dist/images/layers-2x.png"

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet"
import moment from "moment"

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

  //Assuming the dataset only goes back 10 years or less
  const [start_date, set_start_date] = useState(moment().subtract(10, "years"))
  const [end_date, set_end_date] = useState(moment())

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
        `/stations/${station_doc_id}/stats`,
        {
          params: {
            start_date: start_date.toISOString(),
            end_date: end_date.toISOString(),
          },
        }
      )
      set_station_stats(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    get_station_stats()
  }, [start_date, end_date])

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
              icon: () =>
                station_stats ? (
                  <EuiIcon type="arrowRight" />
                ) : (
                  <EuiLoadingSpinner size="s" />
                ),
              title: "Journeys started at this station",
              value: station_stats?.average_distance_started ?? 0,
              valueFormatter: convert_distance_to_km,
            },
          ],
          [
            {
              color: "#6ECCB1",
              icon: () =>
                station_stats ? (
                  <EuiIcon type="arrowLeft" />
                ) : (
                  <EuiLoadingSpinner size="s" />
                ),
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
          <EuiTitle size="m">
            <h2>Average Covered Distance</h2>
          </EuiTitle>
        </EuiPanel>
      </EuiFlexItem>

      <EuiFlexItem grow={true}>
        <EuiPanel>{distance_chart}</EuiPanel>
      </EuiFlexItem>
    </EuiFlexGroup>
  )

  const top_return_stations_list = station_stats?.top_5_return_stations.map(
    (station, index) => <EuiListGroupItem label={`${index + 1}. ${station.nimi}`} />
  )
  const popular_return_station_chart = (
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

  const top_departure_stations_list = station_stats?.top_5_departure_stations.map(
    (station, index) => <EuiListGroupItem label={`${index + 1}. ${station.nimi}`} />
  )
  const popular_departure_station_chart = (
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

  const popular_stat_column = (
    <EuiFlexGroup direction="column">
      <EuiFlexItem grow={false}>
        <EuiPanel>
          <EuiTitle>
            <h2>Top Popular stations</h2>
          </EuiTitle>
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

  const station_name = station ? (
    <EuiTitle size="l">
      <h2>{station.nimi}</h2>
    </EuiTitle>
  ) : (
    <EuiSkeletonTitle />
  )
  const station_address = station ? (
    <EuiText size="m">{station?.osoite}</EuiText>
  ) : (
    <EuiSkeletonText lines={1} />
  )
  const title_and_address = (
    <>
      {station_name}
      <EuiTitle size="s">
        <EuiFlexGroup direction="row" gutterSize="xs">
          <EuiFlexItem grow={false}>
            <EuiIcon type="visMapCoordinate" />
          </EuiFlexItem>
          <EuiFlexItem grow={true}>{station_address}</EuiFlexItem>
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

  const date_picker = (
    <EuiDatePickerRange
      isInvalid={start_date > end_date}
      startDateControl={
        <EuiDatePicker
          selected={start_date}
          onChange={(date) => date && set_start_date(date)}
          startDate={start_date}
          maxDate={end_date}
          endDate={end_date}
          aria-label="Start date"
        />
      }
      endDateControl={
        <EuiDatePicker
          selected={end_date}
          onChange={(date) => date && set_end_date(date)}
          startDate={start_date}
          maxDate={moment()}
          endDate={end_date}
          aria-label="End date"
        />
      }
    />
  )

  const information_section = (
    <EuiFlexGroup direction="column" style={{ height: "100%" }}>
      <EuiFlexItem grow={false}>
        <EuiPanel>
          <EuiFlexGroup direction="row" alignItems="baseline">
            <EuiFlexItem style={{ minWidth: "30%" }} grow={false}>
              {title_and_address}
            </EuiFlexItem>
            <EuiFlexItem grow={true}>{station_total_stats}</EuiFlexItem>
            <EuiFlexItem grow={false}>{date_picker}</EuiFlexItem>
          </EuiFlexGroup>
        </EuiPanel>
      </EuiFlexItem>

      <EuiFlexItem grow={true}>
        <EuiPanel>{graph_columns}</EuiPanel>
      </EuiFlexItem>
    </EuiFlexGroup>
  )

  const station_map_section = station && (
    <EuiPanel>
      <MapContainer
        style={{ width: "100%", height: "100%" }}
        center={[station.y, station.x]}
        zoom={19}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[station.y, station.x]}>
          <Popup>{station.nimi}</Popup>
        </Marker>
      </MapContainer>
    </EuiPanel>
  )

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

const modal_style: CSSProperties = {
  maxWidth: "89vw",
  width: "89vw",
  height: "89vh",
  maxHeight: "89vh",
  //This will ensure that the modal displays in the center of the screen

  position: "absolute",
  top: "49%",
  left: "49%",

  //Using this over transform: translate(-51%, -50%) because it is not applied straight away
  marginTop: "-46vh",
  marginLeft: "-46vw",
}

export default Single_station_view
