import { Chart, Metric } from "@elastic/charts"
import { EuiIcon, EuiLoadingSpinner } from "@elastic/eui"
import React, { FC } from "react"
import { Station_stats } from "src/server/controllers/station"

interface Distance_chart_props {
  station_stats: Station_stats | undefined
}

const Distance_chart: FC<Distance_chart_props> = ({ station_stats }) => {
  const convert_distance_to_km = (distance: number) => {
    if (distance < 1000) {
      return `${distance} m`
    } else {
      return `${(distance / 1000).toFixed(2)} km`
    }
  }

  return (
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
}

export default Distance_chart
