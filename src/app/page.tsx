'use client';

import React from 'react';
import AccountList from '../components/overview/AccountList';

const Home = () => {

  return (
    <div className="items-center justify-items-center min-h-screen p-8 gap-16 sm:p-10 font-[family-name:var(--font-geist-sans)]">
      <div className="flex flex-col gap-8 items-center sm:items-start">
        <div>
          <h1>Finance Tracker</h1>
          <p>Welcome to the Finance Tracker app! This app will help you keep track of your finances.</p>
        </div>

        <AccountList />
      </div>
    </div>
  );
}

export default Home;