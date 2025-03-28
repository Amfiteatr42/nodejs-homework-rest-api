const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const contactsRouter = require("./routes/api/contacts");
const usersRouter = require("./routes/api/usersRoutes");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// ROUTES:
app.use("/api/contacts", contactsRouter);
app.use("/api/users", usersRouter);

// 404 HANDLER
app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

// OTHER ERRORS HANDLER
app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

module.exports = app;
