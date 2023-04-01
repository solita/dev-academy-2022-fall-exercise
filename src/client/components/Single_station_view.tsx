import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiModal,
  EuiModalBody,
  EuiPanel,
  EuiText,
  EuiTitle,
} from "@elastic/eui"
import React, { FC, useState } from "react"

const Single_station_view: FC = () => {
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
