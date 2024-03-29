import { Button, makeStyles } from "@material-ui/core";
import React, { Component } from "react";
import ParticlesBg from "particles-bg";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  container: {
    //height: "1000px",
    //position: "relative",
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    zIndex: "-1",
  },

  center: {
    margin: 0,
    position: "absolute",
    top: "50%",
    left: "50%",
    "-ms-transform": "translate(-50%, -50%)",
    transform: "translate(-50%, -50%)",
  },
  centerB: {
    margin: 0,
    position: "absolute",
    top: "40%",
    left: "50%",
    "-ms-transform": "translate(-50%, -50%)",
    transform: "translate(-50%, -50%)",
  },
}));

function Home() {
  const classes = useStyles();

  const history = useHistory();

  const handleStart = () => {
    history.push(`/Browse`);
  };

  return (
    <div className={classes.container}>
      <heading>
        <ParticlesBg type="circle" bg={true} />
      </heading>

      <html>
        <div className={classes.centerB}>
          <h1 style={{ fontSize: "70px" }}>Guess Where!</h1>
        </div>
      </html>

      <div className={classes.center}>
        <Button
          color="primary"
          size="large"
          variant="contained"
          onClick={handleStart}
        >
          Start
        </Button>
      </div>
    </div>
  );
}

export default Home;
