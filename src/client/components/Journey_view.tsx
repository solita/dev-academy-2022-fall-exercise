import React, { useEffect, useState } from "react"
import {
  EuiBasicTable,
  EuiBasicTableColumn,
  EuiForm,
  EuiFormRow,
  EuiSearchBar,
  EuiSearchBarProps,
  EuiTableSortingType,
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
  const [is_loading, set_is_loading] = useState(false)
  const [journey_data, set_journey_data] = useState<Stored_journey_data[]>([])
  const [sorting, set_sorting] = useState<EuiTableSortingType<Stored_journey_data>>({
    sort: { field: "id", direction: "desc" },
  })
  const [search_query, set_search_query] = useState<Query | string>("")
  const [error, set_error] = useState<Error | null>(null)
  const [pagination, set_pagination] = useState<Pagination>({
    pageIndex: 0,
    pageSize: 10,
    totalItemCount: 3000,
    pageSizeOptions: [10, 25, 50],
    showPerPageOptions: true,
  })

  //Fetch data from the server
  const get_journey_data = async () => {
    try {
      const response = await axios.get<Journey_query_result>("/journeys", {
        params: { page: pagination.pageIndex, limit: pagination.pageSize },
      })
      set_journey_data(response.data.journeys)
      set_pagination({
        ...pagination,
        totalItemCount: response.data.total_journeys,
      })
      set_is_loading(false)
    } catch (error) {
      console.log(error)
    }
  }

  //Fetch data on page load and when pagination changes
  useEffect(() => {
    set_is_loading(true)
    get_journey_data()
  }, [pagination.pageIndex, pagination.pageSize])

  //Create filters for the search bar
  const filters: SearchFilterConfig[] = [
    {
      type: "field_value_selection",
      field: "departure_station_name",
      name: "Departure station",
      multiSelect: false,
      //Create options from the unique departure stations
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
      //Create options from the unique return stations
      options: uniqBy(journey_data, "return_station_name").map((journey_data) => ({
        value: journey_data.return_station_name,
        view: journey_data.return_station_name,
      })),
    },
  ]

  //Filter the data based on the search query
  const queried_items = EuiSearchBar.Query.execute(search_query, journey_data, {
    defaultFields: ["departure_station_name", "return_station_name", "t"],
  })

  const on_search_change: EuiSearchBarProps["onChange"] = ({ query, error }) => {
    if (error) {
      console.log(error)
      set_error(error)
    } else {
      set_error(null)
      set_search_query(query)
    }
  }

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
      //Display duration in a more readable formate
      render: (duration: number) => moment.duration(duration, "seconds").humanize(),
      sortable: true,
    },
  ]

  return (
    <>
      <EuiSearchBar
        box={{
          incremental: true,
        }}
        filters={filters}
        onChange={on_search_change}
      />

      <EuiBasicTable
        loading={is_loading}
        items={queried_items}
        columns={columns}
        pagination={pagination}
        onChange={({ page: { index, size }, sort }) => {
          set_pagination({ ...pagination, pageIndex: index, pageSize: size })
          if (sort) {
            set_sorting({ sort: { field: sort.field, direction: sort.direction } })
          }
        }}
        sorting={sorting}
      />
    </>
  )
}
