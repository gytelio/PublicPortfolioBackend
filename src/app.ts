import express, { type Request, type Response, type NextFunction, type Application, type ErrorRequestHandler } from "express";
import createHttpError from "http-errors";
import { config } from "dotenv";
import cors, { type CorsOptions } from "cors";
import routes from "./routes";
import mysql from "mysql2";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import { v2 as cloudinary } from "cloudinary";
import cookieParser from "cookie-parser";
config();

const app: Application = express();

// CORS options
const corsOptions: CorsOptions = {
  origin: "http://localhost:3000", // Specify the allowed origin(s)
  methods: ["GET", "POST", "PUT", "DELETE"], // Specify the allowed HTTP methods
  allowedHeaders: ["Content-Type"], // Specify the allowed headers
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};

// Enable CORS middleware with options
app.use(cors(corsOptions));

// DATABASE (TODO: Use sessions)
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
});

// CLOUD    
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET, 
});

app.use(cookieParser());

export const cloud = cloudinary;

app.use(fileUpload({
  useTempFiles : true,
  tempFileDir : "/tmp/",
}));

export const databasePool = pool.promise();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", routes);

app.use((req: Request, res: Response, next: NextFunction) => {
  next(new createHttpError.NotFound());
});

const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
};

app.use(errorHandler);

const PORT = Number(process.env.PORT || 8000);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`); 
});
