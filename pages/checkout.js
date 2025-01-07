// filepath: /home/ceptar/_HULL/HULL2/pages/checkout.js
import React, { useState } from 'react';
import CheckoutForm from '@components/checkout/CheckoutForm';
import ShippingForm from '@components/checkout/ShippingForm';
import { useCartItems, useCartTotals } from '@lib/context';

const CheckoutPage = () => {
  const [shippingDetails, setShippingDetails] = useState({});
  const [paymentDetails, setPaymentDetails] = useState(null);
  const cartItems = useCartItems();
  const { subTotal } = useCartTotals();

  const handleShippingSubmit = (details) => {
    setShippingDetails(details);
  };

  const handlePaymentSubmit = (details) => {
    setPaymentDetails(details);
  };

  return (
    <div>
      <h1>Checkout</h1>
      <ShippingForm onSubmit={handleShippingSubmit} />
      <CheckoutForm
        shippingDetails={shippingDetails}
        cartItems={cartItems}
        subTotal={subTotal}
        onSubmit={handlePaymentSubmit}
      />
      {paymentDetails && <div>Payment Successful!</div>}
    </div>
  );
};

export default CheckoutPage;