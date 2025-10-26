import express from "express";
import morgan from "morgan";

import { apiV1Router } from "./api/v1/index.js";

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.use("/api/v1", apiV1Router);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
