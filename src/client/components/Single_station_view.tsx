import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiIcon,
  EuiModal,
  EuiModalBody,
  EuiPanel,
  EuiSkeletonText,
  EuiSkeletonTitle,
  EuiText,
  EuiTitle,
} from "@elastic/eui"
import axios from "axios"
import React, { FC, useEffect, useState } from "react"
import { Stored_station_data } from "src/common"

interface Single_station_view_props {
  station_doc_id: string
  on_close: () => void
}

const Single_station_view: FC<Single_station_view_props> = ({
  station_doc_id,
  on_close,
}) => {
  const [station, set_station] = useState<Stored_station_data>()

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

  useEffect(() => {
    get_station()
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

  const station_name = station?.nimi ?? <EuiSkeletonTitle />
  const station_address = station?.osoite ?? <EuiSkeletonText lines={1} />
  const title_and_address = (
    <EuiPanel>
      <EuiTitle size="l">
        <EuiText>{station_name}</EuiText>
      </EuiTitle>
      <EuiTitle size="s">
        <EuiFlexGroup direction="row" gutterSize="xs" alignItems="center">
          <EuiFlexItem grow={false}>
            <EuiIcon type="visMapCoordinate" />
          </EuiFlexItem>
          <EuiFlexItem grow={true}>
            <EuiText size="m">{station_address}</EuiText>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiTitle>
    </EuiPanel>
  )

  const station_total_stats = (
    <EuiTitle>
      <>
        <EuiText size="s">{`Journeys started: ${2}`}</EuiText>
        <EuiText size="s">{`Journeys ended: ${2}`}</EuiText>
      </>
    </EuiTitle>
  )

  const information_section = (
    <EuiFlexGroup direction="column" style={{ height: "100%" }}>
      <EuiFlexItem grow={false}>
        <EuiFlexGroup direction="row">
          <EuiFlexItem grow={false}>{title_and_address}</EuiFlexItem>
          <EuiFlexItem grow={true}>{station_total_stats}</EuiFlexItem>
        </EuiFlexGroup>
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

  return (
    <EuiModal
      onClose={on_close}
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
}

export default Single_station_view
