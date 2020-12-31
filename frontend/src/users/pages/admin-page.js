import React, { useContext, useState } from "react";

import "./admin-page.css";
import { AuthContext } from "../../shared/context/auth-context";
import LoadingSpinner from "../../shared/components/UI/loadingSpinner";
import ErrorModal from "../../shared/components/UI/error-modal";
import Button from "../../shared/components/formUI/button";
import { useHttpClient } from "../../shared/hooks/http-hook";
import DashboardUsers from "../components/dashboardUsers";
// import DashboardTheaters from "../components/dashboardTheaters";
import DashboardTheater from "../components/dashboardTheaters";

const AdminPage = (props) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [allUsers, setAllUsers] = useState();
  const [allTheaters, setAllTheaters] = useState();
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const handleChange = (event) => {
    let value = event.target.value;
    if (!value) return;
    setSelectedOption(value);
  };

  const handleClick = async () => {
    if (selectedOption === "allUsers") {
      try {
        let responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/api/admin/getAllUsers`,
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );
        setAllTheaters(null);
        setAllUsers(responseData.allUsers);
      } catch (error) {
        console.log(error);
      }
    }

    if (selectedOption === "allTheaters") {
      try {
        let responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/api/admin/getAllTheaters`,
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );
        setAllUsers(null);
        setAllTheaters(responseData.allTheaters);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const errorHandler = () => {
    clearError();
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={errorHandler} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      <div className="center">
        <select
          className="select-tag"
          onChange={handleChange}
          name="adminOptions"
          id="admin"
        >
          <option value=""> SELECT OPTION </option>
          <option value="allUsers"> GET ALL USERS </option>
          <option value="allTheaters"> GET ALL THEATERS </option>
        </select>
        <Button onClick={handleClick}>FETCH</Button>
      </div>

      {!isLoading && allUsers
        ? allUsers.map((user) => {
            return (
              <DashboardUsers
                key={user._id}
                name={user.name}
                seats={user.bookedSeats}
              />
            );
          })
        : allTheaters
        ? allTheaters.map((theater) => {
            return (
              <DashboardTheater
                key={theater._id}
                name={theater.name}
                totalShows={theater.shows.length}
              />
            );
          })
        : null}
    </React.Fragment>
  );
};

export default AdminPage;
