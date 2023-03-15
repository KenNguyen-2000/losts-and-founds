import React from 'react';
import Sidebar from '../Sidebar/Sidebar.component';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY as string);

const LayoutedPage = ({ component }: any) => {
  const options = {
    // passing the client secret obtained in step 3
    clientSecret: process.env.REACT_APP_STRIPE_SECRET_KEY,
    // Fully customizable with appearance API.
    appearance: {
      /*...*/
    },
  };
  return (
    <div className='flex min-h-screen'>
      <Sidebar />
      <div className='flex-grow min-h-screen bg-gray-100'>{component}</div>
    </div>
  );
};

export default LayoutedPage;
