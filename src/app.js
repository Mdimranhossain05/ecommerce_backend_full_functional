const express = require('express');
const cors = require('cors')
const createError = require('http-errors');
const xssClean = require('xss-clean');
const rateLimit = require('express-rate-limit');
const userRouter = require('./routers/userRouter');
const seedRouter = require("./routers/seedRouter");
const {errorResponse} = require("./controllers/responseController");
const authRouter = require('./routers/authRouter');
const cookieParser = require("cookie-parser");
const categoryRouter = require('./routers/categoryRouter');
const productRouter = require('./routers/productRouter');

const app = express();

const rateLimiter = rateLimit({
    windowMs: 1*60 *1000,
    max: 50,
    message: "Too many requests from this IP. Plz try again later"
});

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, 
}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(xssClean());
app.use(rateLimiter);
app.use(cookieParser());

app.use('/api/users',userRouter);
app.use("/api/seed", seedRouter);
app.use("/api/auth", authRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/products", productRouter)


app.get("/", (req, res)=>{
    res.status(200).json({
        message: "Response from / endpoint"});
});

//Client error handle
app.use((req, res, next)=>{
    next(createError(404, 'Route not found'));
});

//Server error
app.use((err, req, res, next) => {
    return errorResponse(res, {statusCode: err.status, message: err.message});
});

module.exports = app;