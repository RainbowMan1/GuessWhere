import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
} from "@material-ui/core/";
import firebase from "../firebase";
import { AuthContext } from "../AuthProvider";
import { useHistory } from "react-router-dom";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import MenuIcon from "@material-ui/icons/Menu";

const db = firebase.firestore();

const useStyles = makeStyles((theme) => ({
  root1: {
    display: "flex",
    "z-index": "1",
  },
  paper: {
    marginRight: theme.spacing(2),
  },
  root2: {
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
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);
  console.log(currentUser);
  const onLogin = () => {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(function (result) {
        var user = result.user;
        db.collection("Users")
          .doc(user.uid)
          .set({ name: user.displayName }, { merge: true });
      })
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
    setOpen(false);
  };

  const playRandomChallenge = () => {
    history.push(`/Random`);
    setOpen(false);
  };

  const logOut = () => {
    var auth = new firebase.auth();
    auth.signOut();
  };

  return (
    <div className={classes.root2}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.home}>
            GuessWhere
          </Typography>
          {currentUser ? (
            <div className={classes.root1}>
              <div>
                <IconButton
                  ref={anchorRef}
                  aria-controls={open ? "menu-list-grow" : undefined}
                  aria-haspopup="true"
                  onClick={handleToggle}
                >
                  <MenuIcon />
                </IconButton>
                <Popper
                  open={open}
                  anchorEl={anchorRef.current}
                  role={undefined}
                  transition
                  disablePortal
                >
                  {({ TransitionProps, placement }) => (
                    <Grow
                      {...TransitionProps}
                      style={{
                        transformOrigin:
                          placement === "bottom"
                            ? "center top"
                            : "center bottom",
                      }}
                    >
                      <Paper>
                        <ClickAwayListener onClickAway={handleClose}>
                          <MenuList
                            autoFocusItem={open}
                            id="menu-list-grow"
                            onKeyDown={handleListKeyDown}
                          >
                            <MenuItem onClick={browseChallenges}>
                              Browse Challenges
                            </MenuItem>
                            <MenuItem onClick={playRandomChallenge}>
                              Random Challenge
                            </MenuItem>
                            <MenuItem onClick={logOut}>Logout</MenuItem>
                          </MenuList>
                        </ClickAwayListener>
                      </Paper>
                    </Grow>
                  )}
                </Popper>
              </div>
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
