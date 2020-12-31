import React, { useContext, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";

import { AuthContext } from "../../shared/context/auth-context";
import LoadingSpinner from "../../shared/components/UI/loadingSpinner";
import ErrorModal from "../../shared/components/UI/error-modal";
import Card from "../../shared/components/UI/card";
import Input from "../../shared/components/formUI/input";
import Button from "../../shared/components/formUI/button";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/validator/validation";
import { useForm } from "../../shared/hooks/form-hook";
import "react-datepicker/dist/react-datepicker.css";
import { useHttpClient } from "../../shared/hooks/http-hook";

let seatsRow = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

const makeSeats = () => {
  let seatsObject = {};

  for (let i = 0; i < 10; i++) {
    let tempArray = [];
    for (let j = 0; j < 10; j++) {
      tempArray.push({
        isAvailable: true,
        bookedBy: "",
        seatNo: seatsRow[i] + j,
      });
    }
    seatsObject[seatsRow[i]] = tempArray;
  }
  return seatsObject;
};

const NewHall = (props) => {
  const [selectedDate, setSelectedDate] = useState(null);
  let theaterId = useParams().theaterId;
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm(
    {
      name: {
        value: "",
        isValid: false,
      },
      timing: {
        value: "",
        isValid: false,
      },
      duration: {
        value: "",
        isValid: false,
      },
      price: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const history = useHistory();

  const placeSubmithandler = async (event) => {
    event.preventDefault();
    let allSeats = makeSeats();
    let hallData = {
      name: formState.inputs.name.value,
      timing: formState.inputs.timing.value,
      duration: formState.inputs.duration.value,
      price: formState.inputs.price.value,
      date: selectedDate,
      seats: allSeats,
    };

    // const formData = new FormData();
    // formData.append("name", formState.inputs.name.value);
    // formData.append("currentMovie", formState.inputs.currentMovie.value);
    // formData.append("address", formState.inputs.address.value);
    // formData.append("seats", makeSeats());
    // console.log(formState, hallData, formData);
    // formData.append("creator", auth.userId);
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/api/hall/${theaterId}/newShow`,
        "POST",
        JSON.stringify(hallData),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      history.push("/"); //redirect to home page
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Card>
        <form className="place-form" onSubmit={placeSubmithandler}>
          {isLoading && <LoadingSpinner asOverlay />}
          <Input
            id="name"
            element="input"
            type="text"
            label="Movie Name"
            validators={[VALIDATOR_REQUIRE()]}
            onInput={inputHandler}
            errorText="Please enter a valid name"
          />

          <label>
            <b>Pick Date</b>
          </label>
          <br />
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            minDate={new Date()}
            dateFormat="MM/dd/yyyy"
          />

          <Input
            id="timing"
            element="input"
            type="text"
            label="Movie Timing"
            validators={[VALIDATOR_REQUIRE()]}
            onInput={inputHandler}
            errorText="Please enter a valid movie timing"
          />

          <Input
            id="duration"
            element="input"
            type="text"
            label="Duration"
            validators={[VALIDATOR_REQUIRE()]}
            onInput={inputHandler}
            errorText="Please enter a movie duration"
          />

          <Input
            id="price"
            element="input"
            type="text"
            label="Ticket Price"
            validators={[VALIDATOR_REQUIRE()]}
            onInput={inputHandler}
            errorText="Please enter ticket price"
          />

          <Button type="submit" disabled={!formState.isValid}>
            ADD NEW SHOW
          </Button>
        </form>
      </Card>
    </React.Fragment>
  );
};

export default NewHall;
