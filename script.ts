import express from "express";
import { dbSetup } from "./dbconfig";
import { router } from "./userRoute";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(router);

const setup = async () => {
  await dbSetup();
  app.listen(8686, () => {
    console.log("Server Running!");
  });
};

setup();
