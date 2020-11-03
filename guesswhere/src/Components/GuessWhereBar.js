import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { AppBar, Toolbar, Typography, Button } from "@material-ui/core/";
import firebase from "../firebase";
import { AuthContext } from "../AuthProvider";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    "margin-bottom": "2%",
  },
  loggedin: {
    display: "flex",
    "align-items": "center",
  },
  home: {
    "margin-right": "75%",
  },
}));

export default function GuessWhereBar() {
  const classes = useStyles();
  const history = useHistory();
  const { currentUser } = useContext(AuthContext);

  const onLogin = () => {
    console.log("hello");
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
  };

  const browseChallenges = () => {
    history.push(`/Browse`);
  };

  const goHome = () => {
    history.push(`/`);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" onClick={goHome} className={classes.home}>
            GuessWhere
          </Button>
          {currentUser ? (
            <div className={classes.loggedin}>
              <Button color="inherit" onClick={browseChallenges}>
                Challenges
              </Button>
              <Typography variant="h6">{currentUser.displayName}</Typography>
            </div>
          ) : (
            <Button color="inherit" onClick={onLogin}>
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}
