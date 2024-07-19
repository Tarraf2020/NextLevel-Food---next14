"use client";

import React from "react";
import classes from "@/app/meals/share/page.module.css";
import { useFormStatus } from "react-dom";

const MealsFormSubmit = () => {
  const { pending } = useFormStatus();
  return (
    <p className={classes.actions}>
      <button disabled={pending}>
        {pending ? "Submitting..." : "Share Meal"}
      </button>
    </p>
  );
};

export default MealsFormSubmit;
