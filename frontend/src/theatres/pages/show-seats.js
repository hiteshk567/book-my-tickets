import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UI/error-modal";
import LoadingSpinner from "../../shared/components/UI/loadingSpinner";
import Theatreui from "./theatre-UI";
import "./show-seats.css";

const HallSeats = (props) => {
  const showId = useParams().showId;
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedShow, setLoadedShow] = useState();

  useEffect(() => {
    const fetchShowDetails = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/api/hall/show/${showId}`
        );
        setLoadedShow(responseData.show);
      } catch (err) {
        console.log(err);
      }
    };
    fetchShowDetails();
  }, [sendRequest, showId]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner asOverlay />
        </div>
      )}

      {!isLoading && loadedShow && (
        <Theatreui
          id={loadedShow._id}
          name={loadedShow.name}
          timing={loadedShow.timing}
          duration={loadedShow.duration}
          seats={loadedShow.seats}
          date={loadedShow.date}
          showId={loadedShow._id}
          price={loadedShow.price}
        />
      )}
    </React.Fragment>
  );
};

export default HallSeats;
