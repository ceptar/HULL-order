// import React, { useState, useEffect } from 'react';
// import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
// import { useCartItems, useCartTotals } from '@lib/context';

// const CheckoutForm = ({ shippingDetails, subTotal, onSubmit }) => {
//   const stripe = useStripe();
//   const elements = useElements();
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(false);
//   const [clientSecret, setClientSecret] = useState('');

//   useEffect(() => {
//     // Fetch the client secret from the server
//     fetch('/api/create-payment-intent', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ amount: subTotal }),
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         setClientSecret(data.clientSecret);
//       });
//   }, [subTotal]);

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     if (!stripe || !elements || !clientSecret) {
//       return;
//     }

//     const paymentElement = elements.getElement(PaymentElement);

//     const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
//       payment_method: {
//         card: paymentElement,
//         billing_details: {
//           name: shippingDetails.name,
//           address: {
//             line1: shippingDetails.address,
//             city: shippingDetails.city,
//             state: shippingDetails.state,
//             postal_code: shippingDetails.zip,
//             country: shippingDetails.country,
//           },
//         },
//       },
//       appearance: {
//         theme: 'stripe',
//         variables: {
//           colorPrimary: '#000',
//           colorBackground: '#fff',
//           colorText: '#333',
//           colorDanger: '#e60000',
//           borderRadius: '4px',
//         },
//       },
//     });

//     if (error) {
//       setError(error.message);
//     } else if (paymentIntent.status === 'succeeded') {
//       setSuccess(true);
//       onSubmit(paymentIntent);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <PaymentElement />
//       <button type="submit" disabled={!stripe}>
//         Pay
//       </button>
//       {error && <div>{error}</div>}
//       {success && <div>Payment successful!</div>}
//     </form>
//   );
// };

// const CheckoutPage = () => {
//   const [shippingDetails, setShippingDetails] = useState({});
//   const [paymentDetails, setPaymentDetails] = useState(null);
//   const cartItems = useCartItems();
//   const { subTotal } = useCartTotals();

//   const handleShippingSubmit = (details) => {
//     setShippingDetails(details);
//   };

//   const handlePaymentSubmit = (details) => {
//     setPaymentDetails(details);
//   };

//   return (
//     <div>
//       <h1>Checkout</h1>
//       <ShippingForm onSubmit={handleShippingSubmit} />
//       {clientSecret && (
//         <Elements stripe={stripePromise} options={{ clientSecret }}>
//           <CheckoutForm
//             shippingDetails={shippingDetails}
//             cartItems={cartItems}
//             subTotal={subTotal}
//             onSubmit={handlePaymentSubmit}
//           />
//         </Elements>
//       )}
//       {paymentDetails && <div>Payment Successful!</div>}
//     </div>
//   );
// };

// export default CheckoutPage;