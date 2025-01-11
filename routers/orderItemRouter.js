const {Router} = require("express");
const {paginate} = require("../middlewares/paginate");
const orderItemController = require("../controllers/orderItemController");


const orderItemRouter = Router();

orderItemRouter.get("/",
    orderItemController.getAllOrderItems, paginate(), (req, res) =>{
        return res.status(200).json({
            message:"Success",
            metadata: res.paginatedResult.metadata,
            data: res.paginatedResult.data
        })
});

orderItemRouter.get("/:id",orderItemController.getSingleOrderItem);

module.exports = {orderItemRouter};