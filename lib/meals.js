import sql from "better-sqlite3";
import slugify from "slugify";
import xss from "xss";
// import fs from "fs/promises";
import { S3 } from "@aws-sdk/client-s3";

const s3 = new S3({
  region: "us-east-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
const db = sql("meals.db");

export const getMeals = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  // throw new Error("Loading meals failed.");
  return db.prepare("SELECT * From meals").all();
};

export const getMeal = (slug) => {
  return db.prepare("SELECT * From meals WHERE slug = ?").get(slug); // the question mark is to protect from sql injection
};

export const addMeal = async (meal) => {
  // Use slugify to create a URL-friendly version of the meal title
  // Converts the title to lowercase and replaces spaces and special characters with hyphens
  meal.slug = slugify(meal.title, { lower: true });

  // Use xss to sanitize the meal instructions
  // This helps prevent XSS (Cross-Site Scripting) attacks by removing potentially harmful scripts
  meal.instructions = xss(meal.instructions);

  const imageExtension = meal.image.name.split(".").pop();
  const fileName = `${meal.slug}.${imageExtension}`;

  // // // ADDING IMAGE TO SERVER
  // const stream = fs.createWriteStream(`public/images/${fileName}`); // it will create a strem taht allows us to write data into a certain file
  // const bufferImage = await meal.image.arrayBuffer();
  // stream.write(Buffer.from(bufferImage), (error) => {
  //   if (error) {
  //     throw new Error("Saving image filed!");
  //   }
  // });
  // meal.image = `/images/${fileName}`; // Public should not be included cuz it will enter the folder by default as root level

  // // // ADDING IMAGE TO  AWS S3 BUCKET
  const bufferedImage = await meal.image.arrayBuffer();

  s3.putObject({
    Bucket: "alitarraf-nextjs-demo-users-image",
    Key: fileName,
    Body: Buffer.from(bufferedImage),
    ContentType: meal.image.type,
  });

  meal.image = `/${fileName}`;

  // the order should be the same (title summary, : @title, @summary)
  db.prepare(
    `INSERT INTO meals (title, summary, image, creator, creator_email, slug, instructions) VALUES (@title, @summary, @image, @creator, @creator_email, @slug, @instructions)`
  ).run(meal);
};
