import React, { useContext, useState } from "react";
import AddSubChallengeModal from "./AddSubChallengeModal";
import firebase from "../firebase";
import { AuthContext } from "../AuthProvider";
import { Redirect } from "react-router-dom";
import { Button } from "@material-ui/core";

const db = firebase.firestore();

function CreateChallenge(props) {
  const { currentUser } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [subchallenges, setSubchallenges] = useState([]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChallengeSubmit = async () => {
    subchallenges.map((subchallenge) => {
      subchallenge.files.map(async (file) => {
        const storageRef = firebase.storage().ref();
        const fileRef = storageRef.child(file.name);
        await fileRef.put(file);
        const fileUrl = await fileRef.getDownloadURL();
      });
    });
    // const file = files[0];

    // await db.collection("sub-challenges").doc().set({
    //   uid: currentUser.uid,
    //   images: fileUrl,
    // });
  };
  const handleSubChallengeSubmit = async (files, marker) => {
    const subchallenge = { files, marker };
    setSubchallenges((current) => [...current, subchallenge]);
  };
  console.log(subchallenges);
  if (!currentUser) {
    return <Redirect to="/" />;
  }
  return (
    <div>
      <h2>Create Challenge</h2>
      <div>
        <Button size="small" color="primary" onClick={handleOpen}>
          Add a Sub Challenge
        </Button>
        <AddSubChallengeModal
          open={open}
          handleClose={handleClose}
          onSubmit={handleSubChallengeSubmit}
        />
        <ul>
          {subchallenges.map((subchallenge, i) => (
            <p key={i}>{subchallenge.marker.toString()}</p>
          ))}
        </ul>
        <Button size="small" color="primary" onClick={handleChallengeSubmit}>
          Submit
        </Button>
      </div>
    </div>
  );
}
export default CreateChallenge;
