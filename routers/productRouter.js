const {Router} = require("express");
const {paginate} = require("../middlewares/paginate");
const productController = require("../controllers/productController");
const productRouter = Router();

productRouter.get("/",
    productController.getAllProducts, paginate(), (req, res) =>{
        return res.status(200).json({
            message:"Success",
            metadata: res.paginatedResult.metadata,
            data: res.paginatedResult.data
        });
});
productRouter.get("/search",
    productController.searchProduct ,paginate(), (req, res) =>{
        return res.status(200).json({
            message:"Success",
            metadata: res.paginatedResult.metadata,
            data: res.paginatedResult.data
        });
});
productRouter.get("/top",productController.topSellingProducts);
productRouter.get("/:id", productController.getSingleProduct);
productRouter.post("/",productController.createNewProduct);
productRouter.put("/:id",productController.updateSingleProduct);
productRouter.delete("/:id",productController.deleteSingleProduct);

module.exports = {productRouter};