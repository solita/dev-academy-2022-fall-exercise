import { EuiLoadingSpinner, EuiPanel } from "@elastic/eui"
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet"
import React, { useEffect, useState } from "react"
import { FC } from "react"
import { Stored_station_data } from "src/common"

import "leaflet/dist/leaflet.css"
import "leaflet/dist/images/marker-icon.png"
import "leaflet/dist/images/marker-shadow.png"
import "leaflet/dist/images/marker-icon-2x.png"
import "leaflet/dist/images/layers.png"
import "leaflet/dist/images/layers-2x.png"
import { LatLngExpression } from "leaflet"

interface Station_map_props {
  station: Stored_station_data | undefined
}

const Station_map: FC<Station_map_props> = ({ station }) => {
  if (!station)
    return (
      <EuiPanel>
        <EuiLoadingSpinner size="xl" />
      </EuiPanel>
    )

  const position: LatLngExpression = [station.y, station.x]

  return (
    <EuiPanel>
      <MapContainer
        //putting the station id as the key forces the map to re-render when the station changes
        key={station._id}
        style={{ width: "100%", height: "100%" }}
        center={position}
        zoom={19}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>{station.nimi}</Popup>
        </Marker>
      </MapContainer>
    </EuiPanel>
  )
}

export default Station_map
