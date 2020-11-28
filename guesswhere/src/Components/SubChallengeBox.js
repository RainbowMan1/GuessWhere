import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ClearSharpIcon from "@material-ui/icons/ClearSharp";
import PermMediaIcon from "@material-ui/icons/PermMedia";
import { IconButton } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "darkgray",
    display: "flex",
    "justify-content": "center",
  },
  listitem: {},
  button: {},
}));

export default function SubChallengeBox(props) {
  const classes = useStyles();

  const handleClearSubChallenge = () => {
    props.handleRemove(props.index);
  };

  return (
    <div className={classes.root}>
      <ListItem className={classes.listitem}>
        <ListItemText primary={"Sub Challenge #" + (props.index + 1)} />
        <ListItemIcon>
          <ListItemText primary={props.numImages} />
          <PermMediaIcon />
        </ListItemIcon>
      </ListItem>
      <IconButton
        className={classes.button}
        aria-label="clear"
        color="secondary"
        onClick={handleClearSubChallenge}
      >
        <ClearSharpIcon />
      </IconButton>
    </div>
  );
}
