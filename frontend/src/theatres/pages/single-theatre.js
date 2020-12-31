import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UI/error-modal";
import LoadingSpinner from "../../shared/components/UI/loadingSpinner";
import TheatreShows from "./theatreshows";

const SingleTheatre = (props) => {
  const hallId = useParams().hallId;
  const [loadedHall, setLoadedHall] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const fetchHall = async () => {
      try {
        let responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/api/hall/open/${hallId}`
        ); // fetch url
        setLoadedHall(responseData.hall);
      } catch (err) {
        console.log("Single hall failed");
      }
    };
    fetchHall();
  }, [sendRequest, hallId]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner asOverlay />
        </div>
      )}
      {!isLoading && loadedHall && (
        <TheatreShows
          id={loadedHall._id}
          name={loadedHall.name}
          address={loadedHall.address}
          shows={loadedHall.shows}
        />
      )}

      {/* {!isLoading && loadedHall && (
        <Theatreui
          name={loadedHall.name}
          address={loadedHall.address}
          currentMovie={loadedHall.currentMovie}
          seats={loadedHall.seats}
          hallId={hallId}
        />
      )} */}
    </React.Fragment>
  );
};

export default SingleTheatre;
