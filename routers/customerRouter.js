const {Router} = require("express");
const customerController = require("../controllers/customerController");
const {paginate} = require("../middlewares/paginate");

const customerRouter = Router();


customerRouter.get("/", 
    customerController.getAllCustomers, paginate(), (req, res) =>{
        return res.status(200).json({
            message:"Success",
            metadata: res.paginatedResult.metadata,
            data: res.paginatedResult.data
        });
});
customerRouter.get("/:id",customerController.getSingleCustomer);
customerRouter.get("/:id/orders",customerController.getCustomerOrders);
customerRouter.post("/",customerController.createNewCustomer);
customerRouter.put("/:id",customerController.updateSingleCustomer);
customerRouter.delete("/:id",customerController.deleteSingleCustomer);


module.exports = {customerRouter};