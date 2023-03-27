import React from "react"
import Journey_view from "../src/client/components/Journey_view"
import App from "../src/client/components/App"
import { screen, render } from '@testing-library/react'


it("App renders without crashing", () => {
  render(<App />);
  const linkElement = screen.getByText("Journeys");
  expect(linkElement).toBeInTheDocument();
})
