import { Button, Grid } from "@material-ui/core";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import React, { useCallback, useContext, useEffect, useState } from "react";
import Carousel from "react-material-ui-carousel";
import { AuthContext } from "../AuthProvider";
import firebase from "../firebase";
import ChallengeResult from "./ChallengeResult";
import SubChallengeResult from "./SubChallengeResult";
import ParticlesBg  from "particles-bg";

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

const getRandomSubarray = (arr, size) => {
  var shuffled = arr.slice(0),
    i = arr.length,
    temp,
    index;
  while (i--) {
    index = Math.floor((i + 1) * Math.random());
    temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }
  return shuffled.slice(0, size);
};

function RandomChallenge(props) {
  const { currentUser } = useContext(AuthContext);

  const [mapstyle, setMapStyle] = useState(mapContainerStyleNoMouse);
  const [subchallenges, setSubchallenges] = useState([]);
  const [totalMarkers, setTotalMarkers] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [currentChallenge, setCurrentChallenge] = useState(0);

  const [showResult, setShowResult] = useState(false);
  const [marker, setMarker] = useState(null);
  const [currentMarkers, setCurrentMarkers] = useState(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

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
    console.log(subchallenges[currentChallenge].location);
    const actualMarker = {
      lat: subchallenges[currentChallenge].location.latitude,
      lng: subchallenges[currentChallenge].location.longitude,
    };
    const markersToSend = {
      actual: actualMarker,
      guess: marker,
    };
    setCurrentMarkers(markersToSend);
    setShowResult(true);
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
      const challengedata = await db.collection("Sub-challenges").get();
      var subchallenges = challengedata.docs;
      if (subchallenges.length > 5) {
        subchallenges = getRandomSubarray(subchallenges, 5);
      }
      const tempchallenges = await getSubChallenges(subchallenges);
      console.log(tempchallenges[0]);
      setSubchallenges(tempchallenges);
    };
    fetchChallenge();
  }, []);

  const handleContinue = useCallback(
    (points) => {
      console.log("updating");
      console.log(points);
      setTotalPoints((currentPoints) => currentPoints + points);
      setMarker(null);
      setTotalMarkers((total) => [...total, currentMarkers]);
      setCurrentMarkers(null);
      setCurrentChallenge((current) => current + 1);
      setShowResult(false);
    },
    [currentChallenge, currentMarkers]
  );

  if (loadError) return "Error";
  if (!isLoaded || subchallenges.length === 0) return "Loading...";
  if (currentChallenge >= subchallenges.length) {
    console.log(totalPoints);
    return (
      <ChallengeResult totalPoints={totalPoints} totalMarkers={totalMarkers} />
    );
  }
  if (showResult) {
    return (
      <SubChallengeResult
        Markers={currentMarkers}
        onContinue={handleContinue}
      />
    );
  }
  return (
    <div>
      <div>
      <h1 style={{fontSize: "40px", textAlign: "center", color:"black"}} >Random Challenge!</h1>
      <ParticlesBg type="circle" bg={true} />
      </div>
      <Grid
        container
        direction="row"
        alignItems="center"
        justify="center"
        spacing={0}
      >
        <Grid item xs={"auto"} sm={2} md={2} lg={2} />
        <Grid item xs={12} sm={8} md={8} lg={8}>
          <Carousel>
            {subchallenges[currentChallenge].images.map((item, i) => (
              <img src={item} alt={i} key={i} height={"550"} width={"800"} />
            ))}
          </Carousel>
          <Button
            color="primary"
            size="large"
            variant="contained"
            disabled={marker === null}
            onClick={handleGuess}
          >
            Guess
          </Button>
        </Grid>
        <Grid item xs={"auto"} sm={2} md={2} lg={2} />
      </Grid>
      <div onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
        <GoogleMap
          mapContainerStyle={mapstyle}
          zoom={3}
          center={center}
          onClick={handleMapClick}
        >
          <Marker
            position={marker}
            icon={{
              url: `/Images/guess.png`,
              origin: new window.google.maps.Point(0, 0),
              anchor: new window.google.maps.Point(15, 15),
              scaledSize: new window.google.maps.Size(30, 30),
            }}
          />
        </GoogleMap>
      </div>
    </div>
  );
}

export default RandomChallenge;
