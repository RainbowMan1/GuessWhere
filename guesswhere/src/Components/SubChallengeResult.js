import { Button, Typography } from "@material-ui/core";
import { GoogleMap, Marker, Polyline } from "@react-google-maps/api";
import React from "react";

const mapContainer = {
  left: "0%",
  height: "65vh",
  width: "100vw",
};
/* This is for actual midpoint on a curved surface like the earth
const getMidpoint = (actualMarker, guessMarker) => {
  var lat1 = actualMarker.lat;
  var lng1 = actualMarker.lng;
  var lat2 = guessMarker.lat;
  var lng2 = guessMarker.lng;

  //-- Convert to radians
  lat1 = lat1 * (Math.PI / 180);
  lat2 = lat2 * (Math.PI / 180);
  lng1 = lng1 * (Math.PI / 180);
  lng2 = lng2 * (Math.PI / 180);
  var dLng = lng2 - lng1;

  var bX = Math.cos(lat2) * Math.cos(dLng);
  var bY = Math.cos(lat2) * Math.sin(dLng);
  var lat3 = Math.atan2(
    Math.sin(lat1) + Math.sin(lat2),
    Math.sqrt((Math.cos(lat1) + bX) * (Math.cos(lat1) + bX) + bY * bY)
  );
  var lng3 = lng1 + Math.atan2(bY, Math.cos(lat1) + bX);
  lat3 = (lat3 * 180) / Math.PI;
  lng3 = (lng3 * 180) / Math.PI;
  //-- Return result
  return { lat: lat3, lng: lng3 };
};*/

const getMidpoint = (actualMarker, guessMarker) => {
  var lat1 = actualMarker.lat;
  var lng1 = actualMarker.lng;
  var lat2 = guessMarker.lat;
  var lng2 = guessMarker.lng;
  const lat3 = (lat1 + lat2) / 2;
  const lng3 = (lng1 + lng2) / 2;
  return { lat: lat3, lng: lng3 };
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
  const center = getMidpoint(props.Markers.actual, props.Markers.guess);
  const points = getPoints(distance);
  const pathCoordinates = [
    { lat: props.Markers.actual.lat, lng: props.Markers.actual.lng },
    { lat: props.Markers.guess.lat, lng: props.Markers.guess.lng },
  ];
  console.log(props.Markers.actual);
  const handleContinue = () => {
    props.onContinue(Number(points));
  };
  return (
    <div>
      <h1 style={{fontSize: "30px", textAlign: "center"}} >Challenge Results</h1>
      <GoogleMap mapContainerStyle={mapContainer} zoom={3} center={center}>
        <Marker
          position={props.Markers.actual}
          icon={{
            url: `/Images/flag.png`,
            origin: new window.google.maps.Point(0, 0),
            anchor: new window.google.maps.Point(15, 15),
            scaledSize: new window.google.maps.Size(30, 30),
          }}
        />
        <Marker
          position={props.Markers.guess}
          icon={{
            url: `/Images/guess.png`,
            origin: new window.google.maps.Point(0, 0),
            anchor: new window.google.maps.Point(15, 15),
            scaledSize: new window.google.maps.Size(30, 30),
          }}
        />
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

      <div
      style={{
        align: "center",
        width: "auto",
        border: "5px dotted black",
        padding: "20px",
        marginLeft: "auto",
        marginRight: "auto",
        textAlign: "center",}}
      >
      <Typography variant="h6">
        Your Guess was {distance} miles away from the actual location. You get{" "}
        {points}/1000 points.
      </Typography>
      <Button color="primary" variant="contained" onClick={handleContinue}>
        Continue
      </Button>
      </div>
    </div>
  );
}

export default SubChallengeResult;
