const {Router} = require("express");
const {paginate} = require("../middlewares/paginate");
const supplierController = require("../controllers/supplierController");
const supplierRouter = Router();

supplierRouter.get("/",
    supplierController.getAllSuppliers, paginate(), (req, res) =>{
        return res.status(200).json({
            message:"Success",
            metadata: res.paginatedResult.metadata,
            data: res.paginatedResult.data
        })
});

supplierRouter.get("/:id", supplierController.getSingleSupplier);
supplierRouter.get("/:id/products", supplierController.getSupplierProducts);
supplierRouter.post("/",supplierController.createNewSupplier);
supplierRouter.put("/:id",supplierController.updateSingleSupplier);
supplierRouter.delete("/:id",supplierController.deleteSingleSupplier);

module.exports = {supplierRouter};