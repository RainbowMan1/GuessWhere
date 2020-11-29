import { Grid, makeStyles, Typography } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { AuthContext } from "../AuthProvider";
import firebase from "../firebase";
import ChallengeCard from "./ChallengeCard";
import CreateChallengeCard from "./CreateChallengeCard";


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
      <Typography variant="h4" className={classes.browseheading}>
        Browse Challenges
      </Typography>
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
    </div>
  );
}

export default BrowseChallenges;
