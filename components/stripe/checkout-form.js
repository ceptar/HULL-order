import React, { useState, useEffect } from 'react';
import { useStripe, useElements, ExpressCheckoutElement, PaymentElement, AddressElement } from "@stripe/react-stripe-js";

export const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    
    const [errorMessage, setErrorMessage] = useState(null);
  
    const handleSubmit = async (event) => {
      event.preventDefault();
  
      if (!stripe || !elements) {
        return;
      }
  
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + '/order-confirmation',
        },
      });
  
      if (error) {
        setErrorMessage(error.message);
      }
    };
  
    return (
       <form onSubmit={handleSubmit}>
{/*         
         <ExpressCheckoutElement className="mb-32"
          onConfirm={handleSubmit}
          />
 */}
          <PaymentElement />
          <AddressElement className="mb-32" options={{mode: 'shipping'}} />



         <button className="btn is-primary is-inverted is-large is-block mt-32" type="submit" disabled={!stripe}>
           Pay Now
         </button> 
         {errorMessage && <div>{errorMessage}</div>}
       </form>
    );
  };