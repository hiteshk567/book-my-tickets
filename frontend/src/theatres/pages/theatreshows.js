import React, { useContext, useEffect, useState } from "react";
import axios from "axios";

import "./theatreshows.css";
import Card from "../../shared/components/UI/card";
import Button from "../../shared/components/formUI/button";
import Modal from "../../shared/components/UI/modal";
import { AuthContext } from "../../shared/context/auth-context";
import Map from "../../shared/components/UI/map";

const TheatreShows = (props) => {
  const auth = useContext(AuthContext);
  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [coordinates, setCoordinates] = useState(null);

  const openMapHandler = () => setShowMap(true);

  const closeMapHandler = () => setShowMap(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${props.address}.json?access_token=${process.env.REACT_APP_API_KEY}`
      );

      let center = response.data.features[0].geometry.coordinates;
      console.log(center);
      setCoordinates(center);
    };
    fetchData();
  }, []);

  return (
    <Card>
      <h2>Theater Name : {props.name}</h2>
      <h3>Address : {props.address}</h3>
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className="map-container">
          <Map center={coordinates} address={props.address} zoom={16} />
        </div>
      </Modal>
      <Button inverse onClick={openMapHandler}>
        VIEW ON MAP
      </Button>
      {props.shows &&
        props.shows.length > 0 &&
        props.shows.map((show, index) => {
          {
            /* <Card key={show._id}> */
          }
          return (
            <Card key={index}>
              <div className="single-show" key={show._id}>
                <h3>Movie Name: {show.name}</h3>
                <h4>Schedule Date: {show.date.split("T")[0]}</h4>
                <h4>Movie Timing: {show.timing} hour</h4>
                <h4>Movie Duration: {show.duration} min</h4>
                <h4>Ticket Price: Rs. {show.price}</h4>
                <Button inverse to={`/theater/${show._id}/seats`}>
                  BOOK SEATS
                </Button>
              </div>
            </Card>
          );
        })}
      {auth.isLoggedIn && auth.role === "admin" && (
        <Button to={`/${props.id}/newShow`}>ADD NEW SHOW</Button>
      )}
    </Card>
  );
};

export default TheatreShows;
