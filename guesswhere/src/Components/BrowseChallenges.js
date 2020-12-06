import { Grid, makeStyles, Typography } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { AuthContext } from "../AuthProvider";
import firebase from "../firebase";
import ChallengeCard from "./ChallengeCard";
import CreateChallengeCard from "./CreateChallengeCard";
import ParticlesBg  from "particles-bg";

const db = firebase.firestore();

const useStyles = makeStyles((theme) => ({
  browseheading: {
    "margin-bottom": "1%",
  },
  cards: {
    "margin-bottom": "0.5%",
  },
}));

function BrowseChallenges(props) {
  const classes = useStyles();
  const [challenges, setChallenges] = useState([]);
  const { currentUser } = useContext(AuthContext);
  useEffect(() => {
    const fetchChallenges = async () => {
      const data = await db.collection("Challenges").get();
      setChallenges(data.docs);
      console.log(data.docs);
    };
    fetchChallenges();
  }, []);

  if (!currentUser) {
    return <Redirect to="/" />;
  }
  return (
    <div>
  

      <div>
      <Grid container direction="row" spacing={0}>
        <Grid item xs={1} />
        <Grid item xs={10}>
          
      
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
      <ParticlesBg type="circle" bg={true} height="1000px" />
      </div>
      
          <h1 variant="h4" style={{fontSize: "50px", textAlign: "center", color: "black"}} className={classes.browseheading}>
            Browse Challenges
          </h1>
          <Grid container direction="row" alignItems="center" spacing={0}>
            <Grid className={classes.browseheading} item xs={4}>
              <CreateChallengeCard />
            </Grid>

            {challenges.map((doc, i) => (
              <Grid key={i} className={classes.cards} item xs={4}>
                <ChallengeCard
                  name={doc.data().name}
                  challengeId={doc.id}
                  uid={doc.data().uid}
                  by={doc.data().By}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid item xs={1} />
      </Grid>
      </div>
    </div>
  );
}

export default BrowseChallenges;