"use server";

import { redirect } from "next/navigation";
import { addMeal } from "./meals";
import { revalidatePath } from "next/cache";

// now all the functions in this file will be treated as server functions

const isIvalidText = (text) => {
  return !text || text.trim() === "";
};

export const handleShareMeal = async (prevState, formData) => {
  const meal = {
    title: formData.get("title"), // we are getting it from the form by name
    summary: formData.get("summary"),
    instructions: formData.get("instructions"),
    image: formData.get("image"),
    creator: formData.get("name"),
    creator_email: formData.get("email"),
  };

  if (
    isIvalidText(meal.title) ||
    isIvalidText(meal.summary) ||
    isIvalidText(meal.instructions) ||
    isIvalidText(meal.creator) ||
    isIvalidText(meal.creator_email) ||
    !meal.creator_email.includes("@") ||
    !meal.image ||
    meal.image.size === 0
  ) {
    // return new Error("Invalid Input!");
    return {
      message: "invalid input!",
    };
  }

  await addMeal(meal);
  // revalidatePath('/', "layout") // revalidating the whole website
  // revalidatePath("/meals", "layout"); // by using 'layout' we can revalidate all the nested pages
  revalidatePath("/meals"); //we can use it without 'layout' where it will only revalidate the page itself)

  redirect("/meals");
};
