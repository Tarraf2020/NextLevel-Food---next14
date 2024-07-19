"use client";

import React from "react";

const Error = ({ error }) => {
  console.log({ error });
  return (
    <main className="error">
      <h1>An error occured</h1>
      <p>Failed to create meal.</p>
    </main>
  );
};

export default Error;
