import { Button, makeStyles, Modal } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { Redirect } from "react-router-dom";
import { AuthContext } from "../AuthProvider";

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    margin: "auto",
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const mapContainerStyle = {
  height: "25vh",
  width: "25vw",
};
const options = {
  disableDefaultUI: true,
  zoomControl: true,
};
const center = {
  lat: 39.693649,
  lng: -100.548059,
};

function AddSubChallengeModal(props) {
  const { currentUser } = useContext(AuthContext);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });
  const [marker, setMarker] = useState(null);
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [files, setFiles] = React.useState([]);

  const handleUpload = (event) => {
    var tempfiles = [];
    for (var i = 0; i < event.target.files.length; i++) {
      const file = event.target.files[i];
      tempfiles.push(file);
    }
    setFiles(tempfiles);
  };

  const handleMapClick = (event) => {
    setMarker({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
  };

  const resetModal = () => {
    setFiles([]);
    setMarker(null);
    setButtonDisabled(true);
  };

  const closeModal = () => {
    resetModal();
    props.handleClose();
  };
  const handleSubmit = () => {
    props.onSubmit(files, marker);
    resetModal();
    props.handleClose();
  };

  useEffect(() => {
    if (files.length !== 0 && marker !== null) {
      setButtonDisabled(false);
    }
  }, [marker, files]);
  if (!currentUser) {
    return <Redirect to="/" />;
  }
  if (loadError) return "Error";
  if (!isLoaded) return "Loading...";
  return (
    <Modal
      open={props.open}
      onClose={closeModal}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <div style={modalStyle} className={classes.paper}>
        <h2> Add Sub Challenge </h2>
        <div>
          Add images:
          {files.map((file, i) => (
            <div key={i}>{file.name}</div>
          ))}
          <input
            accept="image/*"
            className={classes.input}
            style={{ display: "none" }}
            id="upload-images"
            multiple
            type="file"
            onChange={handleUpload}
          />
          <label htmlFor="upload-images">
            <Button
              variant="outlined"
              component="span"
              className={classes.button}
            >
              Choose Images
            </Button>
          </label>
        </div>
        <div> Add location </div>
        <div>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={3}
            center={center}
            onClick={handleMapClick}
          >
            <Marker
              position={marker}
              icon={{
                url: `/Images/flag.png`,
                origin: new window.google.maps.Point(0, 0),
                anchor: new window.google.maps.Point(15, 15),
                scaledSize: new window.google.maps.Size(30, 30),
              }}
            />
          </GoogleMap>
        </div>
        <Button color="primary" variant="contained" onClick={closeModal}>
          Cancel
        </Button>
        <Button
          color="primary"
          variant="contained"
          disabled={buttonDisabled}
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </div>
    </Modal>
  );
}

export default AddSubChallengeModal;
