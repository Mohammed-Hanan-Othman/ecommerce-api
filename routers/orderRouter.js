const {Router} = require("express");
const {paginate} = require("../middlewares/paginate");
const orderController = require("../controllers/orderController");
const orderRouter = Router();

orderRouter.get("/",
    orderController.getAllOrders, paginate(), (req, res) =>{
        return res.status(200).json({
            message:"Success",
            metadata: res.paginatedResult.metadata,
            data: res.paginatedResult.data
        });
});
orderRouter.get("/search", 
    orderController.searchOrders, paginate(), (req, res) =>{
        return res.status(200).json({
            message:"Success",
            metadata: res.paginatedResult.metadata,
            data: res.paginatedResult.data
        });
});
orderRouter.get("/customer/:customerId",orderController.getOrdersByCustomer);
orderRouter.get("/:id",orderController.getSingleOrder);
orderRouter.post("/",orderController.createNewOrder);
orderRouter.put("/:id",orderController.updateSingleOrder);
orderRouter.delete("/:id",orderController.deleteSingleOrder);

module.exports = {orderRouter};