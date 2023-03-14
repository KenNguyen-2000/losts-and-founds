import React from 'react';
import Sidebar from '../Sidebar/Sidebar.component';

const LayoutedPage = ({ component }: any) => {
  return (
    <div className='flex min-h-screen'>
      <Sidebar />
      <div className='flex-grow min-h-screen bg-gray-100'>{component}</div>
    </div>
  );
};

export default LayoutedPage;
