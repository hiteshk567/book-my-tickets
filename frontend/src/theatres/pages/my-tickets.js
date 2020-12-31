import React, { useState, useEffect, useContext } from "react";

import { AuthContext } from "../../shared/context/auth-context";
import LoadingSpinner from "../../shared/components/UI/loadingSpinner";
import ErrorModal from "../../shared/components/UI/error-modal";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { useParams } from "react-router-dom";
import Card from "../../shared/components/UI/card";

const MyTickets = () => {
  const auth = useContext(AuthContext);
  const [loadedTickets, setLoadedTickets] = useState();
  const uid = useParams().uid;
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/api/hall/mytickets/${uid}`,
          "GET",
          null,
          {
            Authorization: "bearer " + auth.token,
          }
        );
        setLoadedTickets(responseData.tickets);
        console.log(loadedTickets);
      } catch (err) {
        console.log("Change something");
      }
    };
    fetchTickets();
  }, [sendRequest, uid]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner asOverlay />
        </div>
      )}
      {!isLoading && loadedTickets && (
        <ul className="theatre_list">
          {loadedTickets.map((ticket, index) => {
            return (
              <li key={index}>
                <Card>
                  <h3>Theater Id : {ticket.theaterId}</h3>
                  <h4>Movie Id: {ticket.showId}</h4>
                  <h5>
                    Seat Row : {ticket.row}, Seat Col : {ticket.col}
                  </h5>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </React.Fragment>
  );
};

export default MyTickets;
