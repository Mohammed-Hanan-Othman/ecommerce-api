require("dotenv").config();
const express = require("express");
const { indexRouter } = require("./routers/indexRouter");
const { customerRouter } = require("./routers/customerRouter");
const { supplierRouter } = require("./routers/supplierRouter");
const { productRouter } = require("./routers/productRouter");
const { orderRouter } = require("./routers/orderRouter");
const { orderItemRouter } = require("./routers/orderItemRouter");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use("/", indexRouter);
app.use("/customers",customerRouter);
app.use("/suppliers",supplierRouter);
app.use("/products",productRouter);
app.use("/orders",orderRouter);
app.use("/orderItems",orderItemRouter);

// handle bad requests
app.use((req, res)=>{
    return res.status(404).json({"error":"Page not found or invalid request"});
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Express app running on ${PORT}`));