import { Button, makeStyles } from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  container: {
    height: "500px",
    position: "relative",
  },

  center: {
    margin: 0,
    position: "absolute",
    top: "50%",
    left: "50%",
    "-ms-transform": "translate(-50%, -50%)",
    transform: "translate(-50%, -50%)",
  },
}));

function Home() {
  const history = useHistory();
  const startBoggle = () => {
    history.push(`/`);
  };
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <div className={classes.center}>
        <Button color="primary" variant="contained" onClick={startBoggle}>
          Start
        </Button>
      </div>
    </div>
  );
}

export default Home;
