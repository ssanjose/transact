'use client';

import { useState } from "react";
import { AccountController } from "../hooks/account.controller";

export default function Home() {
  const accounts = AccountController.getAllAccounts();
  const [accountName, setAccountName] = useState("");
  const [accountBalance, setAccountBalance] = useState("0.00");
  const [showForm, setShowForm] = useState(false);

  const handleCreateAccount = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newAccount = {
      name: accountName,
      balance: (Math.round(parseFloat(accountBalance) * 100) / 100),
    };
    await AccountController.createAccount(newAccount);
    setAccountName("");
    setAccountBalance("0.00");
    setShowForm(false); // Hide the form after creating an account
  };

  const toggleFormVisibility = () => {
    setShowForm(!showForm);
  };

  return (
    <main>
      <div>
        <h1>Finance Tracker</h1>
        <p>
          Welcome to the Finance Tracker app! This app will help you keep track of your finances.
        </p>
      </div>

      <ul>
        {accounts === undefined ? (
          <li>Loading...</li>
        ) : accounts.length === 0 ? (
          <li>No Account Created</li>
        ) : (
          accounts.map((account) => (
            <li key={account.id}>
              {account.name}: ${account.balance !== undefined ? account.balance.toFixed(2) : 0.0}
            </li>
          ))
        )}
      </ul>

      <div>
        <button onClick={toggleFormVisibility}>
          {showForm ? "Cancel" : "Open an Account"}
        </button>
        {showForm && (
          <form onSubmit={handleCreateAccount}>
            <input
              type="text"
              placeholder="Account Name"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Account Balance"
              value={accountBalance}
              onChange={(e) => setAccountBalance(e.target.value)}
            />
            <button type="submit">Create Account</button>
          </form>
        )}
      </div>
    </main>
  );
}
