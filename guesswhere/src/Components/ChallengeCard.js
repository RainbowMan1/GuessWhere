import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import { useHistory } from "react-router-dom";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
  root: {
    maxHeight: 345,
    maxWidth: 345,
  },
});

export default function ChallengeCard(props) {
  const classes = useStyles();
  const history = useHistory();
  const routeToChallenge = () => {
    history.replace({ pathname: `/Challenge/${props.challengeId}` });
  };
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
          Highscore: {props.hscore}
        </Typography>
        <Typography gutterBottom variant="body1">
          By: {props.by}
        </Typography>
      </CardContent>
    </Card>
  );
}
