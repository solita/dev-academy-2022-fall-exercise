import React from "react"
import Journey_view from "../src/client/components/Journey_view"
import { screen, render } from "@testing-library/react"
import { dummy_journey } from "../__mocks__/server"

describe("Journey", () => {
  render(<Journey_view />)

  it("Renders", async () => {
    const element = await screen.findByTestId("journey_table")
    expect(element).toBeInTheDocument()
  })

  it("Displays journey data", async () => {
    const element = await screen.findByText(dummy_journey.departure_station_name)
    expect(element).toBeInTheDocument()
  })
})
