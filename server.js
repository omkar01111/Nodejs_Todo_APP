import { connectDb } from "./data/database.js";
import { app } from "./app.js";
connectDb();
app.listen(process.env.PORT, () => {
  console.log(`server listening on http://localhost:${process.env.PORT}`);
});
