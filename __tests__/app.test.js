import React from "react"
import Journey_view from "../src/client/components/Journey_view"
import { render, screen, fireEvent } from '@testing-library/react';
import App from "../src/client/components/App"

it("renders without crashing", () => {
  render(<App />)
  expect(screen.getByText("Journey")).toBeInTheDocument()
})
