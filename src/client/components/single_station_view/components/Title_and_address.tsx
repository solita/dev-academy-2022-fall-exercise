import {
  EuiTitle,
  EuiSkeletonTitle,
  EuiText,
  EuiSkeletonText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiIcon,
} from "@elastic/eui"
import React from "react"
import { FC } from "react"
import { Stored_station_data } from "src/common"

interface Title_and_address_props {
  station: Stored_station_data | undefined
}

const Title_and_address: FC<Title_and_address_props> = ({ station }) => {
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

  return (
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
}

export default Title_and_address
