import express from "express"
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet"
import bodyParser from "body-parser";
import usersRoutes from "./routes/users.routes";
import authRoutes from "./routes/auth.routes"; 

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

// app.use(bodyParser.json({ limit: "30mb" }));
// app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

app.use("/users", usersRoutes);
app.use("/auth", authRoutes);


app.get("/", (req,res) => {
    res.send("Hello world")
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

