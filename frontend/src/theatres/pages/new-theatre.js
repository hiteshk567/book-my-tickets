import React, { useContext } from "react";
import { useHistory } from "react-router-dom";

import "./new-theatre.css";
import { AuthContext } from "../../shared/context/auth-context";
import LoadingSpinner from "../../shared/components/UI/loadingSpinner";
import ErrorModal from "../../shared/components/UI/error-modal";
import Card from "../../shared/components/UI/card";
import Input from "../../shared/components/formUI/input";
import Button from "../../shared/components/formUI/button";
import { useForm } from "../../shared/hooks/form-hook";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/validator/validation";
import { useHttpClient } from "../../shared/hooks/http-hook";

const NewTheater = (props) => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm(
    {
      name: {
        value: "",
        isValid: false,
      },
      address: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const history = useHistory();

  const theaterSubmithandler = async (event) => {
    event.preventDefault();
    let formData = {
      name: formState.inputs.name.value,
      address: formState.inputs.address.value,
    };

    try {
      let responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/api/hall/newTheater`,
        "POST",
        JSON.stringify(formData),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      history.push("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Card>
        <form className="place-form" onSubmit={theaterSubmithandler}>
          {isLoading && <LoadingSpinner asOverlay />}
          <Input
            id="name"
            element="input"
            type="text"
            label="Hall Name"
            validators={[VALIDATOR_REQUIRE()]}
            onInput={inputHandler}
            errorText="Please enter a valid name"
          />

          {/* <Input
          id="currentMovie"
          element="text"
          type="text"
          label="Current Movie"
          validators={[VALIDATOR_REQUIRE()]}
          onInput={inputHandler}
          errorText="Please enter a valid movie name"
        /> */}

          <Input
            id="address"
            element="input"
            type="text"
            label="Address"
            validators={[VALIDATOR_REQUIRE()]}
            onInput={inputHandler}
            errorText="Please enter a valid address"
          />

          <Button type="submit" disabled={!formState.isValid}>
            ADD NEW THEATER
          </Button>
        </form>
      </Card>
    </React.Fragment>
  );
};

export default NewTheater;
