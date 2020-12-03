import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import { useHistory } from "react-router-dom";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import firebase from "../firebase";
import { Rating } from "@material-ui/lab";

const db = firebase.firestore();

var avgRating = 0.0;
var score = 0;
var totalRating = 0;
var cnt = 0;
const useStyles = makeStyles({
  root: {
    maxHeight: 345,
    maxWidth: 345,
  },
});

export default function ChallengeCard(props) {
  const classes = useStyles();
  const history = useHistory();
  const [challengeCreatorName, setChallengeCreatorName] = useState("");
  const routeToChallenge = () => {
    //Added UID to URL path so it could be save with rating and high score
    history.replace({
      pathname: `/Challenge/${props.challengeId}/${props.uid}`,
    });
  };

  useEffect(() => {
    const fetchname = async () => {
      const userDoc = await db.collection("Users").doc(props.uid).get();
      if (userDoc.exists) {
        setChallengeCreatorName(userDoc.data().name);
      }
    };
    fetchname();
  }, []);

  totalRating = 0;
  cnt = 0;
  //Query Firebase for hi score for each chall using props.challengID in where clause to filter
  //const data= db.collection("Challenge Rating").where("ChallengeID","==" , props.challengeId);

  //Querty firease for all rating then divide by count to get avg rating per chall
  return (
    <Card className={classes.root}>
      <CardActionArea onClick={routeToChallenge}>
        <CardContent>
          <Typography gutterBottom variant="h5">
            {props.name}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardContent>
        <Button size="small" color="primary" onClick={routeToChallenge}>
          Play
        </Button>
        <Typography gutterBottom variant="body1">
          Created By: {challengeCreatorName}
        </Typography>
        <Typography gutterBottom variant="body1">
          Average Rating : {avgRating}
        </Typography>
      </CardContent>
      <CardContent>
        <Rating value={0} max={5} />
      </CardContent>
    </Card>
  );
}
