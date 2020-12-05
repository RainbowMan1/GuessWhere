import React, { useContext, useEffect, useState } from "react";
import AddSubChallengeModal from "./AddSubChallengeModal";
import firebase from "../firebase";
import { AuthContext } from "../AuthProvider";
import { Redirect } from "react-router-dom";
import { Button, Snackbar, TextField } from "@material-ui/core";
import SubChallengeBox from "./SubChallengeBox";
import { v4 as uuidv4 } from "uuid";
import MuiAlert from "@material-ui/lab/Alert";
import ParticlesBg  from "particles-bg";

const db = firebase.firestore();

function CreateChallenge(props) {
  const { currentUser } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [subchallenges, setSubchallenges] = useState([]);
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [wordValue, setWordValue] = useState("");
  const [snackOpen, setSnackOpen] = useState(false);
  const [errorSnackOpen, setErrorSnackOpen] = useState(false);

  const handleSnackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackOpen(false);
    setErrorSnackOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getFileUrls = async (subchallenge) => {
    var fileUrls = [];
    await Promise.all(
      subchallenge.files.map(async (file) => {
        const storageRef = firebase.storage().ref();
        const fileRef = storageRef.child(uuidv4());
        await fileRef.put(file);
        const fileUrl = await fileRef.getDownloadURL();
        fileUrls = [...fileUrls, fileUrl];
      })
    );
    return fileUrls;
  };

  const addSubChallenges = async () => {
    var subRefs = [];
    await Promise.all(
      subchallenges.map(async (subchallenge) => {
        const fileUrls = await getFileUrls(subchallenge);
        await db
          .collection("Sub-challenges")
          .add({
            images: fileUrls,
            location: new firebase.firestore.GeoPoint(
              subchallenge.marker.lat,
              subchallenge.marker.lng
            ),
          })
          .then(function (docRef) {
            subRefs = [...subRefs, docRef];
          })
          .catch(function (error) {
            setErrorSnackOpen(true);
          });
      })
    );
    return subRefs;
  };

  const handleChallengeSubmit = async () => {
    setUploading(true);
    const subRefs = await addSubChallenges();
    await db
      .collection("Challenges")
      .add({
        uid: currentUser.uid,
        subchallenges: subRefs,
        name: wordValue,
      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
      });
    setSnackOpen(true);
    setUploading(false);
    setSubchallenges([]);
    setWordValue("");
  };

  const handleSubChallengeSubmit = async (files, marker) => {
    const subchallenge = { files, marker };
    setSubchallenges((current) => [...current, subchallenge]);
  };

  const handleTextOnChange = (e) => {
    setWordValue(e.target.value);
  };

  const handleRemoveSubChallenge = (index) => {
    var tempsubarray = [...subchallenges];
    tempsubarray.splice(index, 1);
    setSubchallenges(tempsubarray);
  };

  useEffect(() => {
    if (subchallenges.length !== 0 && wordValue !== "") {
      setSubmitDisabled(false);
    } else {
      if (!uploading) {
        setSubmitDisabled(true);
      }
    }
  }, [subchallenges, wordValue]);

  //console.log(subchallenges);
  if (!currentUser) {
    return <Redirect to="/" />;
  }
  return (
    <div>
      <div>
      <h1 style={{fontSize: "50px", textAlign: "center", color:"black"}} >Create Challenge!</h1>
        <ParticlesBg type="circle" bg={true} />
      </div>
      <div
      style={{
        align: "center",
        width: "300px",
        border: "5px dotted black",
        padding: "20px",
        marginLeft: "auto",
        marginRight: "auto"}} >
      <div style={{fontSize: "20px", textAlign: "center", color: "black"}}>
        <TextField
          id="standard-basic"
          label="Challenge Name"
          value={wordValue}
          onChange={handleTextOnChange}
        />
      </div>
      <div style={{fontSize: "20px", textAlign: "center", color: "black"}}>
        <Button style={{fontSize: "12px", textAlign: "center", color: "black"}} size="small" onClick={handleOpen}>
          Add a Sub Challenge
        </Button>
        <AddSubChallengeModal
          open={open}
          handleClose={handleClose}
          onSubmit={handleSubChallengeSubmit}
        />
        {subchallenges.map((subchallenge, i) => (
          <SubChallengeBox
            key={i}
            index={i}
            numImages={subchallenge.files.length}
            handleRemove={handleRemoveSubChallenge}
          />
        ))}
      </div>
      <div style={{textAlign: "center"}}>
      <Button 
          style={{fontSize: "15px", color: "black"}}
          size="medium"
          color="primary"
          variant="outlined"
          onClick={handleChallengeSubmit}
          disabled={submitDisabled}
        >
          Submit
        </Button>
      </div>
      </div>
      <Snackbar
        open={snackOpen}
        autoHideDuration={6000}
        onClose={handleSnackBarClose}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleSnackBarClose}
          severity="success"
        >
          Challenge successfully uploaded!
        </MuiAlert>
      </Snackbar>
      <Snackbar
        open={errorSnackOpen}
        autoHideDuration={6000}
        onClose={handleSnackBarClose}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleSnackBarClose}
          severity="error"
        >
          Error Occured When Uploading Challenge!
        </MuiAlert>
      </Snackbar>
    </div>
  );
}
export default CreateChallenge;
