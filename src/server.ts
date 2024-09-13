import express from "express"
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet"
import usersRoutes from "./routes/users.routes";
import authRoutes from "./routes/auth.routes"; 
import ticketRoutes from "./routes/ticket.routes";
import dashboardRoutes from "./routes/dashboard.routes";


dotenv.config();

const app = express();

const corsOptions = {
  origin: "http://localhost:9000",
  methods: ["GET", "POST", "PUT", "PATCH", "OPTIONS"],
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(cors(corsOptions));

app.use("/users", usersRoutes);
app.use("/auth", authRoutes);
app.use("/ticket", ticketRoutes);
app.use("/dashboard", dashboardRoutes);

app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

