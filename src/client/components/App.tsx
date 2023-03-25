import axios from "axios"
import React, { useEffect } from "react"
import { FC } from "react"
import "@elastic/eui/dist/eui_theme_dark.css"

import { EuiPage, EuiPageBody, EuiPageSection, EuiProvider } from "@elastic/eui"
import { Journey_view } from "./Journey_view"

const App: FC = () => {
  return (
    <EuiProvider colorMode="dark">
      <EuiPage>
        <EuiPageBody>
          <EuiPageSection>
            <Journey_view />
          </EuiPageSection>
        </EuiPageBody>
      </EuiPage>
    </EuiProvider>
  )
}

export default App
