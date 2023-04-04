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
import { Stored_station_data } from "../../../common"
import { Station_stats } from "../../../server/controllers/station"

import moment from "moment"
import Distance_chart from "./components/Distance_chart"
import Station_total_stats from "./components/Station_total_stats"
import Title_and_address from "./components/Title_and_address"
import Station_map from "./components/Station_map"

interface Single_station_view_props {
  station_doc_id: string
  on_close: () => void
}

const Single_station_view: FC<Single_station_view_props> = ({
  station_doc_id,
  on_close,
}) => {
  const [view_station_id, set_view_station_id] = useState(station_doc_id)
  const [station, set_station] = useState<Stored_station_data>()
  const [station_stats, set_station_stats] = useState<Station_stats>()

  //Assuming the dataset only goes back 10 years or less
  const [start_date, set_start_date] = useState(moment().subtract(6, "years"))
  const [end_date, set_end_date] = useState(moment())

  const get_station = async () => {
    try {
      const response = await axios.get<Stored_station_data>(
        `/stations/${view_station_id}`
      )

      set_station(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const get_station_stats = async () => {
    set_station_stats(undefined)
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
  }, [view_station_id])

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
        <EuiPanel>
          <Distance_chart station_stats={station_stats} />
        </EuiPanel>
      </EuiFlexItem>
    </EuiFlexGroup>
  )

  const switch_station = (station_doc_id: string) => {
    set_view_station_id(station_doc_id)
  }
  const top_return_stations_list = station_stats?.top_5_return_stations.map(
    (station, index) => (
      <EuiListGroupItem
        onClick={() => switch_station(station._id)}
        label={`${index + 1}. ${station.nimi}`}
      />
    )
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
    (station, index) => (
      <EuiListGroupItem
        onClick={() => switch_station(station._id)}
        label={`${index + 1}. ${station.nimi}`}
      />
    )
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

  const date_picker = (
    <EuiDatePickerRange
      isInvalid={start_date > end_date}
      startDateControl={
        <EuiDatePicker
          selected={start_date}
          onChange={(date) => date && set_start_date(date)}
          startDate={start_date}
          maxDate={moment()}
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
              <Title_and_address station={station} />
            </EuiFlexItem>
            <EuiFlexItem grow={true}>
              <Station_total_stats station_stats={station_stats} />
            </EuiFlexItem>
            <EuiFlexItem grow={false}>{date_picker}</EuiFlexItem>
          </EuiFlexGroup>
        </EuiPanel>
      </EuiFlexItem>

      <EuiFlexItem grow={true}>
        <EuiPanel>{graph_columns}</EuiPanel>
      </EuiFlexItem>
    </EuiFlexGroup>
  )

  return (
    <EuiModal onClose={on_close} style={modal_style}>
      <EuiModalBody>
        <EuiFlexGroup style={{ height: "100%" }}>
          <EuiFlexItem grow={true}>{information_section}</EuiFlexItem>
          <EuiFlexItem grow={true} style={{ width: "25%"}}>
            <Station_map station={station} />
          </EuiFlexItem>
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
