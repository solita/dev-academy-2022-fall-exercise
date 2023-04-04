import {
  EuiText,
  EuiSkeletonText,
  EuiTitle,
  EuiFlexGroup,
  EuiFlexItem,
} from "@elastic/eui"
import React from "react"
import { FC } from "react"
import { Station_stats } from "src/server/controllers/station"

interface Station_total_stats_props {
  station_stats: Station_stats | undefined
}

const Station_total_stats: FC<Station_total_stats_props> = ({ station_stats }) => {
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

  return (
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
}

export default Station_total_stats