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
  left: "50%",
  top: "100%",
  height: "30vh",
  width: "25vw",
  "-ms-transform": "translate(-50%, -50%)",
  transform: "translate(-50%, -50%)",
};

const mapContainerStyleMouse = {
  position: "absolute",
  left: "50%",
  top: "100%",
  height: "40vh",
  width: "100%",
  "-ms-transform": "translate(-50%, -50%)",
  transform: "translate(-50%, -50%)",
};

const center = {
  lat: 39.693649,
  lng: -100.548059,
};

function PlayChallenge(props) {
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
      <div
      
      style={{
        position: "fixed", 
        top:"0", 
        left:"0", 
        width:"100%", 
        height:"100%",
        zIndex: "-1"
      }}
      >
        <ParticlesBg type="circle" bg={true} />
      </div>
        <div>
        <h1 style={{fontSize: "40px", textAlign: "center", color:"black"}} >Play Challenge!</h1>
        </div>
      <div>
      <Grid
        container
        direction="row"
        alignItems="center"
        justify="center"
        spacing={0}
      >
        <Grid item xs={"auto"} sm={2} md={2} lg={2} />
        <Grid item xs={12} sm={8} md={8} lg={8}>
          <Carousel
           >
            {subchallenges[currentChallenge].images.map((item, i) => (
              <img 
                style={{
                align: "center",
                display:"block",
                width: "auto",
                border: "5px dotted black",
                padding: "20px",
                marginLeft: "auto",
                marginRight: "auto"
              }}
              src={item} alt={i} key={i} height={"450"} width={"700"} marginLeft= {"auto"}
              marginRight= {"auto"} class={"center"}/>
            ))}
          </Carousel>
        </Grid>
        <Grid item xs={"auto"} sm={2} md={2} lg={2} />
      </Grid>
      </div>
      <div>
      <Button
            color="primary"
            variant="contained"
            size="large"
            disabled={marker === null}
            onClick={handleGuess}

            style={{
              position: "aboslute", 
              top: "50%",
              left: "50%",
              display:"block",
              align:"center",
              "-ms-transform": "translate(-50%, -50%)",
              transform: "translate(-50%, -50%)",
            
            }}
          >
            Guess
          </Button>
      </div>
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
            style={{
              align: "center",
              width: "auto",
              marginLeft: "auto",
              marginRight: "auto",

              position: "fixed", 
              bottom:"0",
            }}
          />
        </GoogleMap>
      </div>
    </div>
  );
}

export default PlayChallenge;
