import React from "react"
import { FC } from "react"
import "@elastic/eui/dist/eui_theme_dark.css"

import {
  EuiPage,
  EuiPageBody,
  EuiPageSection,
  EuiProvider,
  EuiTabbedContent,
} from "@elastic/eui"
import Journey_view from "./Journey_view"
import Station_view from "./Station_view"
import Single_station_view from "./Single_station_view"

const App: FC = () => {
  const tabs = [
    {
      id: "journey-view",
      name: "Journeys",
      content: <Journey_view />,
    },
    {
      id: "station-view",
      name: "Stations",
      content: <Station_view />,
    },
  ]

  return (
    <EuiProvider colorMode="dark">
      <EuiPage data-testid="app">
        <EuiPageBody>
          <EuiPageSection>
            <EuiTabbedContent
              tabs={tabs}
              initialSelectedTab={tabs[0]}
              autoFocus="selected"
            />
          </EuiPageSection>
        </EuiPageBody>
      </EuiPage>
    </EuiProvider>
  )
}

export default App
