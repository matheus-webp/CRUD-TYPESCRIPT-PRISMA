import express from "express";
import { dbSetup } from "./dbconfig";
import { router } from "./routes/userRoute";
import { postRouter } from "./routes/postRoute";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(router, postRouter);

const setup = async () => {
  await dbSetup();
  app.listen(8686, () => {
    console.log("Server Running!");
  });
};

setup();
