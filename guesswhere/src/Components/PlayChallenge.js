import { Button, Grid } from "@material-ui/core";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import React, { useContext, useEffect, useState } from "react";
import Carousel from "react-material-ui-carousel";
import { AuthContext } from "../AuthProvider";
import firebase from "../firebase";

const db = firebase.firestore();

const mapContainerStyleNoMouse = {
  position: "absolute",
  left: "80%",
  top: "74.5%",
  height: "25vh",
  width: "19.5vw",
};

const mapContainerStyleMouse = {
  position: "absolute",
  left: "65%",
  top: "55%",
  height: "45vh",
  width: "34.5vw",
};

const center = {
  lat: 39.693649,
  lng: -100.548059,
};

const getDistance = (geopoint, marker2) => {
  const R = 6371e3; // metres
  const φ1 = (geopoint.latitude * Math.PI) / 180; // φ, λ in radians
  const φ2 = (marker2.lat * Math.PI) / 180;
  const Δφ = ((marker2.lat - geopoint.latitude) * Math.PI) / 180;
  const Δλ = ((marker2.lng - geopoint.longitude) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const d = R * c; // in metres
  return d;
};

function PlayChallenge(props) {
  const { currentUser } = useContext(AuthContext);
  const [mapstyle, setMapStyle] = useState(mapContainerStyleNoMouse);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });
  const [marker, setMarker] = useState(null);
  const [subchallenges, setSubchallenges] = useState([]);
  const { match } = props;
  const { params } = match;
  const { challengeId } = params;

  const getSubChallenges = async (subchallenges) => {
    var tempchallenges = [];
    await Promise.all(
      subchallenges.map(async (subchallenge) => {
        const challengedata = await db
          .collection("Sub-challenges")
          .doc(subchallenge.id)
          .get();
        tempchallenges = [...tempchallenges, challengedata.data()];
      })
    );
    return tempchallenges;
  };

  const handleGuess = () => {
    console.log(subchallenges[0].location);
    console.log(marker);
    console.log(getDistance(subchallenges[0].location, marker));
  };

  const handleMapClick = (event) => {
    setMarker({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
  };

  const handleMouseOver = (event) => {
    setMapStyle(mapContainerStyleMouse);
  };

  const handleMouseOut = (event) => {
    setMapStyle(mapContainerStyleNoMouse);
  };

  useEffect(() => {
    const fetchChallenge = async () => {
      const challengedata = await db
        .collection("Challenges")
        .doc(challengeId)
        .get();
      const subchallenges = challengedata.data().subchallenges;

      const tempchallenges = await getSubChallenges(subchallenges);
      console.log(tempchallenges[0]);
      setSubchallenges(tempchallenges);
    };
    fetchChallenge();
  }, []);

  if (loadError) return "Error";
  if (!isLoaded || subchallenges.length === 0) return "Loading...";
  return (
    <div>
      <Grid
        container
        direction="row"
        alignItems="center"
        justify="center"
        spacing={0}
      >
        <Grid item xs={0} sm={2} md={2} lg={2} />
        <Grid item xs={12} sm={8} md={8} lg={8}>
          <Carousel>
            {subchallenges[0].images.map((item, i) => (
              <img src={item} alt={i} key={i} height={"550"} width={"800"} />
            ))}
          </Carousel>
          <Button
            color="primary"
            variant="contained"
            disabled={marker === null}
            onClick={handleGuess}
          >
            Guess
          </Button>
        </Grid>
        <Grid item xs={0} sm={2} md={2} lg={2} />
      </Grid>
      <div onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
        <GoogleMap
          mapContainerStyle={mapstyle}
          zoom={3}
          center={center}
          onClick={handleMapClick}
        >
          <Marker position={marker} />
        </GoogleMap>
      </div>
    </div>
  );
}

export default PlayChallenge;
