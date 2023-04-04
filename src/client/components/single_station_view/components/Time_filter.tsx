import { EuiRangeProps, EuiRange, EuiRangeTick } from "@elastic/eui"
import { FC, useEffect, useState } from "react"
import use_debounce_handler from "../../../hooks/use_debounce_handler"
import React from "react"
import axios from "axios"

interface Time_filter_props {
  set_date_filter: (month: string) => void
}

/**
 * Component that allows the user to filter the data by month
 *
 * @param set_date_filter method that is called when the user selects a month, 
 * it is debounce to prevent too many requests
 * @returns
 */
const Time_filter: FC<Time_filter_props> = ({ set_date_filter }) => {
  const debounce_handler = use_debounce_handler(set_date_filter, 500)

  const [month_value, set_month_value] = useState("0")

  const on_month_select_handler: EuiRangeProps["onChange"] = (e) => {
    set_month_value(e.currentTarget.value)
    debounce_handler(e.currentTarget.value)
  }

  const ticks: EuiRangeTick[] = [
    { label: "Any", value: 0 },
    { label: "Jan", value: 1 },
    { label: "Feb", value: 2 },
    { label: "Mar", value: 3 },
    { label: "Apr", value: 4 },
    { label: "May", value: 5 },
    { label: "Jun", value: 6 },
    { label: "Jul", value: 7 },
    { label: "Aug", value: 8 },
    { label: "Sep", value: 9 },
    { label: "Oct", value: 10 },
    { label: "Nov", value: 11 },
    { label: "Dec", value: 12 },
  ]

  return (
    <EuiRange
      title="Filter by Month"
      min={0}
      max={12}
      step={1}
      showTicks
      fullWidth
      ticks={ticks}
      showInput={false}
      value={month_value}
      onChange={on_month_select_handler}
      aria-label="Time month filter"
    />
  )
}

export default Time_filter
