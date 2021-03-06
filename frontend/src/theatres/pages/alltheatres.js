import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import Card from "../../shared/components/UI/card";
import SingleTheatre from "./single-theatre";
import { useHttpClient } from "../../shared/hooks/http-hook";
import LoadingSpinner from "../../shared/components/UI/loadingSpinner";
import ErrorModal from "../../shared/components/UI/error-modal";

import "./alltheater.css";

const AllTheatres = (props) => {
  const [allTheatre, setAllTheatre] = useState([]);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const fetchHalls = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/api/hall`
        );

        setAllTheatre(responseData.allHalls);
      } catch (err) {
        // setError(err.message || "Something went wrong!!");
        console.log(err);
      }
    };
    fetchHalls();
  }, [sendRequest]);

  const errorHandler = () => {
    clearError();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
      } catch (err) {}
    };

    fetchData();
  }, []);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={errorHandler} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && (
        <ul className="theatre_list">
          {allTheatre &&
            allTheatre.map((theatre) => {
              return (
                <li key={theatre._id}>
                  <Card>
                    <h2>Theater Name : {theatre.name}</h2>

                    <h4>Address : {theatre.address}</h4>
                    {/* <h3>Movie : {theatre.currentMovie}</h3> */}
                    {/* <p>Total Shows :{theatre.shows.length}</p> */}
                    <NavLink to={`/open/${theatre._id}`}>VIEW SHOWS</NavLink>
                  </Card>
                </li>
              );
            })}
        </ul>
      )}
    </React.Fragment>
  );
};

export default AllTheatres;
