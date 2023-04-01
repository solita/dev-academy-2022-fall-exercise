import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiModal,
  EuiModalBody,
  EuiPanel,
  EuiText,
  EuiTitle,
} from "@elastic/eui"
import axios from "axios"
import React, { FC, useEffect, useState } from "react"
import { Stored_station_data } from "src/common"

interface Single_station_view_props {
  station_id: string
}

const Single_station_view: FC<Single_station_view_props> = ({ station_id }) => {
  const [station, set_station] = useState<Stored_station_data | undefined>(undefined)

  const get_station = async () => {
    const response = await axios.get<Stored_station_data>("/stations/" + station_id)
    set_station(response.data)
  }

  useEffect(() => {
    get_station
  }, [])

  const graph_column = (
    <EuiFlexGroup direction="column">
      <EuiFlexItem grow={false}>
        <EuiPanel>
          <EuiTitle>
            <EuiText>Graph Title</EuiText>
          </EuiTitle>
        </EuiPanel>
      </EuiFlexItem>

      <EuiFlexItem grow={true}>
        <EuiPanel>Graph 1</EuiPanel>
      </EuiFlexItem>

      <EuiFlexItem grow={true}>
        <EuiPanel>Graph 2</EuiPanel>
      </EuiFlexItem>
    </EuiFlexGroup>
  )

  const graph_columns = (
    <EuiFlexGroup direction="row" style={{ height: "100%" }}>
      <EuiFlexItem grow={false} style={{ width: "100%" }}>
        {graph_column}
      </EuiFlexItem>

      <EuiFlexItem grow={false} style={{ width: "100%" }}>
        {graph_column}
      </EuiFlexItem>

      <EuiFlexItem grow={false} style={{ width: "100%" }}>
        {graph_column}
      </EuiFlexItem>
    </EuiFlexGroup>
  )

  const information_section = (
    <EuiFlexGroup direction="column" style={{ height: "100%" }}>
      <EuiFlexItem grow={false}>
        <EuiPanel>
          <EuiTitle>
            <EuiText>Station Name</EuiText>
          </EuiTitle>
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
  const [show, set_show] = useState(true)

  const station_modal = (
    <EuiModal
      onClose={() => set_show(false)}
      style={{
        maxWidth: "90vw",
        width: "89vw",
      }}
    >
      <EuiModalBody>
        <EuiFlexGroup style={{ height: "100%" }}>
          <EuiFlexItem grow={true}>{information_section}</EuiFlexItem>
          <EuiFlexItem grow={true}>{station_map_section}</EuiFlexItem>
        </EuiFlexGroup>
      </EuiModalBody>
    </EuiModal>
  )

  if (show) {
    return station_modal
  } else {
    return <div></div>
  }
}

export default Single_station_view
