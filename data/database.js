import mongoose from "mongoose";
export const connectDb=()=>{
    mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("db is running");
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
  });
}