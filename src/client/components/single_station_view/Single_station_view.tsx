import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiModal,
  EuiModalBody,
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
import Popular_returns from "./components/Popular_returns"
import Popular_departures from "./components/Popular_departures"
import _, { set } from "lodash"
import Time_filter from "./components/Time_filter"

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

  //The year will be hardcoded for 2021 for now
  const default_start_date = moment().year(2021).startOf("year")
  const default_end_date = moment().year(2021).endOf("year")

  const [start_date, set_start_date] = useState(default_start_date)
  const [end_date, set_end_date] = useState(default_end_date)

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
    get_station()
    get_station_stats()
  }, [view_station_id])

  const distance_stat_column = (
    <EuiFlexGroup direction="column">
      <EuiFlexItem grow={false}>
        <EuiTitle size="m">
          <h2>Average Covered Distance</h2>
        </EuiTitle>
      </EuiFlexItem>

      <EuiFlexItem grow={true}>
        <Distance_chart station_stats={station_stats} />
      </EuiFlexItem>
    </EuiFlexGroup>
  )

  const switch_station = (station_doc_id: string) => {
    set_view_station_id(station_doc_id)
  }

  const popular_stat_column = (
    <EuiFlexGroup direction="column">
      <EuiFlexItem grow={false}>
        <EuiTitle>
          <h2>Top Popular stations</h2>
        </EuiTitle>
      </EuiFlexItem>

      <EuiFlexItem grow={true}>
        <Popular_returns
          station_stats={station_stats}
          switch_station={switch_station}
        />
      </EuiFlexItem>

      <EuiFlexItem grow={true}>
        <Popular_departures
          station_stats={station_stats}
          switch_station={switch_station}
        />
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

  const modal_header = (
    <EuiFlexGroup direction="row" alignItems="baseline">
      <EuiFlexItem style={{ minWidth: "30%" }} grow={false}>
        <Title_and_address station={station} />
      </EuiFlexItem>

      <EuiFlexItem grow={true}>
        <Station_total_stats station_stats={station_stats} />
      </EuiFlexItem>
    </EuiFlexGroup>
  )

  const set_date_filter = (month: string) => {
    if (month === "0") {
      //Reset to looking at the whole year
      set_start_date(default_start_date)
      set_end_date(default_end_date)
    } else {
      //set the start date to the first day of the selected month and year
      //set the end date to the last day of the selected month and year
      set_start_date(moment(`2021-${month}-01`, "YYYY-MM-DD"))
      set_end_date(moment(`2021-${month}-01`, "YYYY-MM-DD").endOf("month"))
    }
  }

  useEffect(() => {
    get_station_stats()
  }, [start_date])
  
  const information_section = (
    <EuiFlexGroup direction="column" style={{ height: "100%" }}>
      <EuiFlexItem grow={false}>{modal_header}</EuiFlexItem>

      <EuiFlexItem grow={false} style={{ width: "100%" }}>
        <Time_filter set_date_filter={set_date_filter} />
      </EuiFlexItem>

      <EuiFlexItem grow={true}>{graph_columns}</EuiFlexItem>
    </EuiFlexGroup>
  )

  return (
    <EuiModal onClose={on_close} style={modal_style}>
      <EuiModalBody>
        <EuiFlexGroup style={{ height: "100%" }}>
          <EuiFlexItem grow={true}>{information_section}</EuiFlexItem>
          <EuiFlexItem grow={true} style={{ width: "25%" }}>
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
