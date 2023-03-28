import React from "react"
import Journey_view from "../src/client/components/Journey_view"
import { screen, render, fireEvent } from "@testing-library/react"
import server from "../__mocks__/server"
import { rest } from "msw"
import { dummy_journey } from "../__mocks__/data"

describe("Journey", () => {
  it("Renders", async () => {
    render(<Journey_view />)
    const element = await screen.findByTestId("journey_table")
    expect(element).toBeInTheDocument()
  })

  it("Displays journey data", async () => {
    render(<Journey_view />)
    const element = await screen.findByText(dummy_journey.departure_station_name)
    expect(element).toBeInTheDocument()
  })

  it("Sort journey data", async () => {
    render(<Journey_view />)
    const element = await screen.findByText(dummy_journey.departure_station_name)
    expect(element).toBeInTheDocument()
  })
})
