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

const getDistance = (actualMarker, guessMarker) => {
  const R = 6371e3; // metres
  const φ1 = (actualMarker.lat * Math.PI) / 180; // φ, λ in radians
  const φ2 = (guessMarker.lat * Math.PI) / 180;
  const Δφ = ((guessMarker.lat - actualMarker.lat) * Math.PI) / 180;
  const Δλ = ((guessMarker.lng - actualMarker.lng) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const d = R * c; // in metres
  return (d / 1000 / 1.609).toFixed(0);
};

const lineSymbol = {
  path: "M 0,-1 0,1",
  strokeOpacity: 1,
  scale: 4,
};

const getPoints = (distance) => {
  const points = 1000 - 0.28 * distance; //1000 * ((7926 - Math.pow(distance / 10, 1.54)) / 7926);
  if (points < 0) {
    return 0;
  }
  return points.toFixed(0);
};

function SubChallengeResult(props) {
  const distance = getDistance(props.Markers.actual, props.Markers.guess);
  const points = getPoints(distance);
  const pathCoordinates = [
    { lat: props.Markers.actual.lat, lng: props.Markers.actual.lng },
    { lat: props.Markers.guess.lat, lng: props.Markers.guess.lng },
  ];
  console.log(props.Markers.actual);
  const handleContinue = () => {
    props.onContinue();
  };
  return (
    <div>
      <GoogleMap mapContainerStyle={mapContainer} zoom={3} center={center}>
        <Marker position={props.Markers.actual} />
        <Marker position={props.Markers.guess} />
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
      <Typography variant="h6">
        Your Guess was {distance} miles away from the actual location. You get{" "}
        {points}/1000 points.
      </Typography>
      <Button color="primary" variant="contained" onClick={handleContinue}>
        Continue
      </Button>
    </div>
  );
}

export default SubChallengeResult;
