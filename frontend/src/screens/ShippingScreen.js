import React, { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import { saveShippingAddress } from "../actions/cartActions";

const ShippingScreen = ({ history }) => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;
  const [address, setAddress] = useState(
    shippingAddress ? shippingAddress.address : ""
  );
  const [city, setCity] = useState(shippingAddress ? shippingAddress.city : "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress ? shippingAddress.postalCode : ""
  );
  const [country, setCountry] = useState(
    shippingAddress ? shippingAddress.country : ""
  );
  const [message, setMessage] = useState(false);
  const dispatch = useDispatch();

  const submitHandler = (e) => {
    // e.preventDefalut();
    // console.log("submit");
    if (address != "" && city != "" && postalCode != "" && country != "") {
      setMessage(false);
      dispatch(saveShippingAddress({ address, city, postalCode, country }));
      history.push("/payment");
    } else {
      setMessage(true);
    }
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 />
      <h1>Shipping</h1>
      {message && <Alert variant="danger">Please fill all the fields</Alert>}

      <Form>
        {" "}
        <Form.Group controlId="address">
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Address"
            value={address || ""}
            required
            onChange={(e) => setAddress(e.target.value)}
          ></Form.Control>
        </Form.Group>{" "}
        <Form.Group controlId="address">
          <Form.Label>City</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter City"
            value={city || ""}
            required
            onChange={(e) => setCity(e.target.value)}
          ></Form.Control>
        </Form.Group>{" "}
        <Form.Group controlId="postalCode">
          <Form.Label>Postal Code</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Postal Code"
            value={postalCode || ""}
            required
            onChange={(e) => setPostalCode(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="country">
          <Form.Label>Country</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Country"
            value={country || ""}
            required
            onChange={(e) => setCountry(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button onClick={submitHandler} variant="primary">
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default ShippingScreen;
