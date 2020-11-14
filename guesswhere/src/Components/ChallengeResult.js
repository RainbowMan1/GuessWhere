import { Button, Typography } from "@material-ui/core";
import { GoogleMap, Marker, Polyline } from "@react-google-maps/api";
import React from "react";

const mapContainer = {
  left: "0%",
  height: "65vh",
  width: "100vw",
};

const center = {
  lat: 39.693649,
  lng: -100.548059,
};

const lineSymbol = {
  path: "M 0,-1 0,1",
  strokeOpacity: 1,
  scale: 4,
};

function ChallengeResult(props) {
  const handleContinue = () => {};

  const pathCoordinates = [...props.totalMarkers];
  console.log(pathCoordinates);
  return (
    <div>
      <GoogleMap mapContainerStyle={mapContainer} zoom={3} center={center}>
        {props.totalMarkers.map((markers, i) => {
          console.log(markers.actual);

          <Marker
            position={{ lat: markers.actual.lat, lng: markers.actual.lng }}
          />;
        })}
        <Polyline
          path={pathCoordinates}
          geodesic={true}
          options={{
            strokeColor: "#ff2527",
            strokeOpacity: 0,
            strokeWeight: 2,
            icons: [
              {
                icon: lineSymbol,
                offset: "0",
                repeat: "20px",
              },
            ],
          }}
        />
      </GoogleMap>
      <Typography variant="h6">Your total score is {}</Typography>
      <Button color="primary" variant="contained" onClick={handleContinue}>
        Continue
      </Button>
    </div>
  );
}

export default ChallengeResult;
