import React, { useState, useEffect } from "react";
import { Form, Button, Alert, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import { savePaymentMethod } from "../actions/cartActions";

const PaymentScreen = ({ history }) => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;
  if (!shippingAddress) {
    history.push("/shipping");
  }
  const [paymentMethod, setPaymentMethod] = useState("PayPal");

  const [message, setMessage] = useState(false);
  const dispatch = useDispatch();

  const submitHandler = (e) => {
    setMessage(false);
    dispatch(savePaymentMethod(paymentMethod));
    history.push("/placeorder");
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h1>Payment Method</h1>
      {message && <Alert variant="danger">Please fill all the fields</Alert>}

      <Form>
        <Form.Group>
          <Form.Label as="legend">Select Method</Form.Label>

          <Col>
            <Form.Check
              type="radio"
              label="Paypal or Cerdit Card"
              id="PayPal"
              name="paymentMethod"
              value="PayPal"
              checked
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check>
            <Form.Check
              type="radio"
              label="Stripe"
              id="Stripe"
              name="paymentMethod"
              value="Stripe"
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check>
          </Col>
        </Form.Group>
        <Button onClick={submitHandler} variant="primary">
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default PaymentScreen;
