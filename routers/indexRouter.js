const {Router} = require("express");

const indexRouter = Router();

indexRouter.get("/",(req,res)=>{
    return res.status(200).json({message:"Welcome to the ecommerce api"});
})

module.exports = {indexRouter};