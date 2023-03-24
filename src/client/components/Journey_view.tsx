import React, { useEffect, useState } from "react"
import {
  EuiBasicTable,
  EuiBasicTableColumn,
  EuiFieldSearch,
  EuiFlexGroup,
  EuiFlexItem,
  EuiSearchBar,
  EuiSearchBarProps,
  Pagination,
  Query,
  SearchFilterConfig,
} from "@elastic/eui"
import axios from "axios"
import moment from "moment"
import { uniqBy } from "lodash"
import { Journey_data, Stored_journey_data } from "../../common"
import { Journey_query_result } from "../../server/controllers/journey"

export const Journey_view = () => {
  const [journey_data, set_journey_data] = useState<Stored_journey_data[]>([])
  const [search_query, set_search_query] = useState<Query | string>("")
  const [pagination, set_pagination] = useState<Pagination>({
    pageIndex: 0,
    pageSize: 10,
    totalItemCount: 3000,
    pageSizeOptions: [10, 25, 50],
    showPerPageOptions: true,
  })

  const get_journey_data = async () => {
    try {
      const response = await axios.get<Journey_query_result>("/journeys", {
        params: { page: pagination.pageIndex, limit: pagination.pageSize },
      })
      console.log("journey data length", response.data.journeys.length)
      console.log("total_journeys", response.data.total_journeys)
      console.log("total_pages", response.data.total_journeys)
      set_journey_data(response.data.journeys)
      set_pagination({
        ...pagination,
        totalItemCount: response.data.total_journeys,
      })
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    get_journey_data()
  }, [pagination.pageIndex, pagination.pageSize])

  const columns: EuiBasicTableColumn<Journey_data>[] = [
    {
      field: "departure_station_name",
      name: "Departure station",
      sortable: true,
    },
    {
      field: "return_station_name",
      name: "Return station",
      sortable: true,
    },
    {
      field: "covered_distance",
      name: "Covered distance",
      //Display distance in a more readable formate
      render: (covered_distance: number) => {
        if (covered_distance < 1000) {
          return `${covered_distance} m`
        } else {
          return `${(covered_distance / 1000).toFixed(2)} km`
        }
      },
      sortable: true,
    },
    {
      field: "duration",
      name: "Duration",
      render: (duration: number) => moment.duration(duration, "seconds").humanize(),
      sortable: true,
    },
  ]

  const filters: SearchFilterConfig[] = [
    {
      type: "field_value_selection",
      field: "departure_station_name",
      name: "Departure station",
      multiSelect: false,
      options: uniqBy(journey_data, "departure_station_name").map(
        (journey_data) => ({
          value: journey_data.departure_station_name,
          view: journey_data.departure_station_name,
        })
      ),
    },
    {
      type: "field_value_selection",
      field: "return_station_name",
      name: "Return station",
      multiSelect: false,
      options: uniqBy(journey_data, "return_station_name").map((journey_data) => ({
        value: journey_data.return_station_name,
        view: journey_data.return_station_name,
      })),
    },
  ]

  const queried_items = EuiSearchBar.Query.execute(search_query, journey_data, {
    defaultFields: ["departure_station_name", "return_station_name", "t"],
  })

  const onChange: EuiSearchBarProps["onChange"] = ({ query, error }) => {
    if (error) {
      console.log(error)
      // setError(error);
    } else {
      // setError(null);
      set_search_query(query)
    }
  }

  return (
    <EuiFlexGroup gutterSize="m" direction="column">
      <EuiFlexItem grow={false}>
        <EuiSearchBar
          box={{
            incremental: true,
            // schema,
          }}
          filters={filters}
          onChange={onChange}
        />
      </EuiFlexItem>

      <EuiFlexItem>
        <EuiBasicTable
          items={queried_items}
          columns={columns}
          pagination={pagination}
          onChange={({ page: { index, size } }) =>
            set_pagination({ ...pagination, pageIndex: index, pageSize: size })
          }
          sorting={{
            sort: {
              field: "id",
              direction: "desc",
            },
          }}
        />
      </EuiFlexItem>
    </EuiFlexGroup>
  )
}
