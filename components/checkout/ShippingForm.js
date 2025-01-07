import React, { useState } from 'react';

const ShippingForm = ({ onSubmit }) => {
  const [details, setDetails] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(details);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input type="text" name="name" value={details.name} onChange={handleChange} required />
      </label>
      <label>
        Address:
        <input type="text" name="address" value={details.address} onChange={handleChange} required />
      </label>
      <label>
        City:
        <input type="text" name="city" value={details.city} onChange={handleChange} required />
      </label>
      <label>
        State:
        <input type="text" name="state" value={details.state} onChange={handleChange} required />
      </label>
      <label>
        ZIP Code:
        <input type="text" name="zip" value={details.zip} onChange={handleChange} required />
      </label>
      <label>
        Country:
        <input type="text" name="country" value={details.country} onChange={handleChange} required />
      </label>
      <button type="submit">Continue to Payment</button>
    </form>
  );
};

export default ShippingForm;