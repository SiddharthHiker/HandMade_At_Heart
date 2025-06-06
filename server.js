import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import categoryRoute from "./routes/categoryRoute.js";
import productRoute from "./routes/productRoute.js";
import cors from "cors";

// configure env
dotenv.config();

// Database Connection
connectDB();

// rest object
const app = express();

//middlewares
app.use(cors());
// app.use(express.json());

// Increase payload size limit (add these lines)
app.use(express.json({ limit: '50mb' }));  // For JSON requests
app.use(express.urlencoded({ limit: '50mb', extended: true })); // For URL-encoded data


app.use(morgan("dev"));

//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/product",productRoute);

// rest api
app.get("/", (req, res) => {
  res.send({
    message: "Welcome to E-commerce app",
  });
});

// PORT
const PORT = process.env.PORT || 8080;

// Run Listen
app.listen(PORT, () => {
  console.log(
    `Server Running on ${process.env.DEV_MODE} mode on PORT ${PORT}`.bgCyan
      .white
  );
});
