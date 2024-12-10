"use client"
import React, { useState } from 'react';
import { signInAdmin } from './auth';  // Import the sign-in function

// Correct function declaration
export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Explicitly type 'e' as React.FormEvent<HTMLFormElement>
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Call the sign-in function from auth.js
      const { user, idToken } = await signInAdmin(email, password);

      console.log('Admin logged in:', user);
      console.log('ID Token:', idToken);

      // Send this ID token to your backend for verification
      const response = await fetch('http://localhost:8090/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();
      console.log('Backend response:', data);

    } catch (err: unknown) {  // Explicitly type 'err' as 'unknown'
      // Type assertion to 'Error'
      if (err instanceof Error) {
        setError('Failed to login: ' + err.message);
      } else {
        setError('Unknown error occurred');
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}