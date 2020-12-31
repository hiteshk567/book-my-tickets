import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import "./theatre-UI.css";
import Card from "../../shared/components/UI/card";
import Button from "../../shared/components/formUI/button";
import Node from "./node";
import Modal from "../../shared/components/UI/modal";
import ErrorModal from "../../shared/components/UI/error-modal";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";

import "./theatre-UI.css";

const createNode = (row, col, isAvailable, bookedBy) => {
  return {
    row,
    col,
    isAvailable,
    bookedBy,
    isSelected: false,
  };
};

const loadRazorScript = () => {
  return new Promise((resolve) => {
    const razorScript = document.createElement("script");
    razorScript.src = "https://checkout.razorpay.com/v1/checkout.js";
    razorScript.onload = () => resolve(true);
    razorScript.onerror = () => resolve(false);
    document.body.appendChild(razorScript);
  });
};

const displayRazorpay = async (billingInfo, userData) => {
  const res = await loadRazorScript();

  if (!res) {
    console.log("razor pay failed to load");
  }

  var options = {
    key: "rzp_test_OVYJMlxIJomuFC", // Enter the Key ID generated from the Dashboard
    amount: billingInfo.amount.toString(), // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    currency: billingInfo.currency,
    name: "BOOK MY TICKET",
    description: "Test Transaction",
    image:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxzZWFyY2h8OHx8dGhlYXRlcnxlbnwwfHwwfA%3D%3D&auto=format&fit=crop&w=500&q=60",
    order_id: billingInfo.orderId, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    handler: function (response) {
      console.log(response);
      // alert(response.razorpay_payment_id);
      // alert(response.razorpay_order_id);
      // alert(response.razorpay_signature);
    },
    prefill: {
      name: userData.name,
      email: userData.email,
    },
  };
  var razorObject = new window.Razorpay(options);
  razorObject.open();
  razorObject.on("payment.failed", function (response) {
    alert(response);
    console.log(response);
  });
};

let seatsRow = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

const initialGrid = (seats) => {
  let seatsObject = {};
  for (let i = 0; i < 10; i++) {
    let tempArray = [];
    for (let j = 0; j < 10; j++) {
      // console.log(seats[seatsRow[i]]);
      tempArray.push({
        isAvailable: seats[seatsRow[i]][j].isAvailable,
        bookedBy: seats[seatsRow[i]][j].bookedBy,
        isSelected: false,
      });
    }
    seatsObject[seatsRow[i]] = tempArray;
  }
  return seatsObject;
};

const TheatreUI = (props) => {
  const auth = useContext(AuthContext);
  const [grid, setGrid] = useState();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [movieStatus, setMovieStatus] = useState(true);

  useEffect(() => {
    let getGrid = initialGrid(props.seats);
    let dateArray = props.date.split("T")[0].split("-");
    let year = dateArray[0],
      month = dateArray[1],
      day = dateArray[2];
    let fullDate = `${month}/${day}/${year} ${props.timing}`;
    setGrid(getGrid);
    const currentTime = new Date().getTime();
    const movieTime = new Date(fullDate).getTime();
    console.log(currentTime, movieTime);
    if (movieTime - currentTime <= 0) {
      setMovieStatus(false);
    } else {
      setMovieStatus(true);
    }
  }, [props.seats, movieStatus, props.timing, props.date]);

  const addSeat = (row, col, isSelected, isAvailable) => {
    if (isAvailable) {
      const newObject = { ...grid };
      newObject[row][col].isSelected = true;
      // newArray[row][col].isSelected = true;
      setSelectedSeats((prevVal) => [
        ...prevVal,
        { row, col, isSelected, isAvailable },
      ]);
      setGrid(newObject);
      // setTotalPrice(selectedSeats.length);
    }
  };

  const history = useHistory();

  const removeSeat = (r, c, isSelected, isAvailable) => {
    console.log("hitesh");
    if (isAvailable) {
      const newObject = { ...grid };
      newObject[r][c].isSelected = false;
      setSelectedSeats((prevVal) =>
        prevVal.filter((seat) => {
          return r !== seat.row || c !== seat.col;
        })
      );
      setGrid(newObject);
      console.log(selectedSeats);
      // setTotalPrice(selectedSeats.length);
    }
  };

  const handleClick = async () => {
    try {
      let responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/api/hall/bookTickets/${props.id}`,
        "POST",
        JSON.stringify({ bookedTickets: selectedSeats, showId: props.showId }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      console.log(responseData);

      displayRazorpay(responseData.razorResponse, responseData.userInfo);

      history.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/api/hall/${props.showId}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      history.push(`/`);
    } catch (err) {
      console.log("Something went wrong in frontend while deleting");
    }
  };

  return (
    <Card>
      <ErrorModal error={error} onClear={clearError} />

      <h2>Movie Name : {props.name}</h2>
      <hr />
      <h4 style={{ color: movieStatus ? "green" : "red" }}>
        Current Status: {movieStatus ? "Tickets available" : "Booking closed"}
      </h4>
      <h3>Schedule Date: {props.date.split("T")[0]}</h3>
      <h3>Show Timing: {props.timing} hour</h3>
      <h4>Movie duration: {props.duration} min</h4>
      <h4>Ticket Price: Rs. {props.price} per seat</h4>
      {
        <div className="grid">
          {grid &&
            Object.keys(grid).map((columns, index) => {
              return (
                <div key={index}>
                  {grid[columns].map((node, index2) => {
                    const { isAvailable, bookedBy, isSelected } = node;
                    return (
                      <Node
                        row={columns}
                        col={index2}
                        isAvailable={isAvailable}
                        isSelected={isSelected}
                        bookedBy={bookedBy}
                        addSeat={addSeat}
                        removeSeat={removeSeat}
                      />
                    );
                  })}
                </div>
              );
            })}
        </div>
      }
      <div className="screen">
        <i className="fas fa-desktop fa-6x"></i>
      </div>
      {movieStatus &&
        auth.isLoggedIn &&
        selectedSeats &&
        selectedSeats.length > 0 && (
          <Button inverse onClick={handleClick}>
            BOOK TICKETS
          </Button>
        )}
      {auth.isLoggedIn && auth.role == "admin" && (
        <Button danger onClick={handleDelete}>
          DELETE
        </Button>
      )}
    </Card>
  );
};

export default TheatreUI;
