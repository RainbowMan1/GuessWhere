import { Button, Typography } from "@material-ui/core";
import { GoogleMap, Marker, Polyline } from "@react-google-maps/api";
import React from "react";
import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Rating from 'material-ui-rating';
import firebase from "../firebase";
import { AuthContext } from "../AuthProvider";

const db = firebase.firestore();

const handleRating =(value) =>{
  alert('onChange ' + value);

  //Add ChallID and UID
  db.collection('Challenge Rating').add({Rating: value});
};

const mapContainer = {
  left: "0%",
  height: "65vh",
  width: "100vw",
};



const getMidpoint = (actualMarker, guessMarker) => {
  var lat1 = actualMarker.lat;
  var lng1 = actualMarker.lng;
  var lat2 = guessMarker.lat;
  var lng2 = guessMarker.lng;
  const lat3 = (lat1 + lat2) / 2;
  const lng3 = (lng1 + lng2) / 2;
  return { lat: lat3, lng: lng3 };
};

const lineSymbol = {
  path: "M 0,-1 0,1",
  strokeOpacity: 1,
  scale: 4,
};

function ChallengeResult(props) {
  const { currentUser } = useContext(AuthContext);
  const history = useHistory();
  const midpoints = [];
  props.totalMarkers.forEach((element) =>
    midpoints.push(getMidpoint(element.actual, element.guess))
  );
  var center = midpoints[0];
  for (var i = 0; i < midpoints.length - 1; i++) {
    center = getMidpoint(center, midpoints[i + 1]);
  }

  const handleContinue = () => {
    history.replace({ pathname: `/Browse/` });
    //Add in challID and UID 
    db.collection('Challenge Leaderboards').add({Score: parseFloat(props.totalPoints)});
  };

  const getPathCoordinates = (total) => {
    const pathArray = [];
    total.forEach((markers) => {
      const path = [
        { lat: markers.actual.lat, lng: markers.actual.lng },
        { lat: markers.guess.lat, lng: markers.guess.lng },
      ];
      pathArray.push(path);
    });
    return pathArray;
  };
  const pathCoordinates = getPathCoordinates(props.totalMarkers);

  console.log(pathCoordinates);
  return (
    <div>
      <GoogleMap mapContainerStyle={mapContainer} zoom={3} center={center}>
        {props.totalMarkers.map((markers, i) => {
          return (
            <Marker
              key={i}
              position={markers.guess}
              icon={{
                url: `/Images/guess.png`,
                origin: new window.google.maps.Point(0, 0),
                anchor: new window.google.maps.Point(15, 15),
                scaledSize: new window.google.maps.Size(30, 30),
              }}
            />
          );
        })}
        {props.totalMarkers.map((markers, i) => {
          return (
            <Marker
              key={i}
              position={markers.actual}
              icon={{
                url: `/Images/flag.png`,
                origin: new window.google.maps.Point(0, 0),
                anchor: new window.google.maps.Point(15, 15),
                scaledSize: new window.google.maps.Size(30, 30),
              }}
            />
          );
        })}
        {pathCoordinates.map((path, i) => {
          return (
            <Polyline
              key={i}
              path={path}
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
          );
        })}
      </GoogleMap>
      <Typography variant="h6">
        Your total score is {parseFloat(props.totalPoints)}
      </Typography>
      <Rating
      value={5}
      max={5}
      onChange={handleRating}
    />
      <Button color="primary" variant="contained" onClick={handleContinue}>
        Continue
      </Button>
    </div>  
  );
}

export default ChallengeResult;
