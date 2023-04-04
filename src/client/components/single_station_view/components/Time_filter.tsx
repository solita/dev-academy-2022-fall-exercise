import { EuiRangeProps, EuiRange, EuiRangeTick } from "@elastic/eui"
import { FC, useState } from "react"
import use_debounce_handler from "../../../hooks/use_debounce_handler"
import React from "react"

interface Time_filter_props {
  set_date_filter: (month: string) => void
}

const Time_filter: FC<Time_filter_props> = ({ set_date_filter }) => {
  const debounce_handler = use_debounce_handler(set_date_filter, 500)

  //Alternative date picker where you can select the month and year
  const [month_value, set_month_value] = useState("0")
  const [year_value, set_year_value] = useState("0")

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
      aria-label="Time filter"
    />
  )
}

export default Time_filter
