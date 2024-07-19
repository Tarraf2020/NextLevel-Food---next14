import React from "react";
import classes from "./loading.module.css";

const MealsLoadingPage = () => {
  return <p className={classes.loading}>Fetching meals...</p>;
};

export default MealsLoadingPage;

// this page can be named as only loading.js where it will appear whenever loding is required
