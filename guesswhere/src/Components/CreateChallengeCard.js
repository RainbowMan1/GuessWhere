import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
});

function CreateChallengeCard(props) {
  const classes = useStyles();
  const history = useHistory();
  const routeToCreate = () => {
    history.replace({ pathname: `/Create` });
  };

  return (
    <Card className={classes.root}>
      <CardActionArea onClick={routeToCreate}>
        <CardMedia
          className={classes.media}
          image="../Images/add.png"
          title="Create Challenge"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            Create Challenge
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default CreateChallengeCard;
