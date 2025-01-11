const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();

const getAllProducts = async (req, res, next) =>{
    try {
        const products = await prisma.product.findMany();
        if (products.length > 0) {
            res.locals.data = products;
            return next();
        }
        return res.status(404).json({error:"No products found"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:"Internal server error"});
    }
}
const getSingleProduct = async (req, res) =>{
    try {
        const id = parseInt(req.params.id);
        if (id) {
            const product = await prisma.product.findFirst({
                where:{
                    id: id
                }
            })
            if (product){
                return res.status(200).json({message:"Success",data:product});
            }
            return res.status(404).json({error:"No product found"});
        }
        return res.status(400).json({error:"Invalid id or id not provided"});
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:"Internal server error"});
    }
}
const createNewProduct = async (req, res) =>{
    try {
        const {name, description} = req.body;
        const quantity = parseInt(req.body.quantity);
        const price = parseInt(req.body.price);
        const supplierId = parseInt(req.body.supplierId);
        if (name && quantity && price && supplierId){
            const product = await prisma.product.create({
                data:{name, description, quantity, price, supplierId}
            })
            if (product) {
                return res.status(201).json({
                    message:"Product created", 
                    data:product
                });
            }
            return res.status(500).json({
                error:"Error occured while creating product"
            });
        }
        return res.status(400).json({
            error:"Name or description or quantity or price or supplierId invalid or not provided"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:"Internal server error"});
    }
}
const updateSingleProduct = async (req, res) =>{
    try {
        const {name, description} = req.body;
        const quantity = parseInt(req.body.quantity);
        const price = parseInt(req.body.price);
        const supplierId = parseInt(req.body.supplierId);
        const id = parseInt(req.params.id);

        if (id && name && quantity && price && supplierId) {
            const product = await prisma.product.findFirst({
                where:{id:id}
            });
            if (!product) {
                return res.status(404).json({
                    error:"No product found with the associated id"
                });
            }
            const updatedProduct = await prisma.product.update({
                where:{id: id},
                data:{name, description, quantity, price, supplierId},
            });
            if (updatedProduct) {
                console.log(updatedProduct);
                return res.status(200).json({
                    message:"Success",
                    data: updatedProduct
                });
            }
            return res.status(500).json({
                error:"Error while updating product information"
            });
        }
        return res.status(400).json({
            error:"Id or name or description or quantity or price or supplierId invalid or not provided"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:"Internal server error"});
    }
}
const deleteSingleProduct = async (req, res) =>{
    try {
        const id = parseInt(req.params.id);
        if (id) {
            const product = await prisma.product.findFirst({
                where:{id:id}
            })
            if (product) {
                const deletedProduct = await prisma.product.delete({
                    where:{id:id}
                });
                return res.status(200).json({
                    message:"Product deleted successfully",
                    data: deletedProduct
                });
            }
            return res.status(404).json({
                error:"No product found"
            });
        }
        return res.status(400).json({
            error:"Invalid id or id not provided"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:"Internal server error"});
    }
}

const searchProduct = async (req, res, next) =>{
    try {
        const name = req.query.name || "";
        const minPrice = parseFloat(req.query.minPrice) || 0;
        const maxPrice = parseFloat(req.query.maxPrice) || 1000;
        console.log({name, minPrice,maxPrice});
        const products = await prisma.product.findMany({
            where:{
                name:{contains:name},
                AND:{price:{gte:minPrice,lte:maxPrice}}
            },
            orderBy:[{price:"asc"},{quantity:"desc"},{name:"asc"}]
        });
        if (products.length < 1) {
            return res.status(404).json({
                error:"No matching products found"
            });
        }
        res.locals.data = products;
        return next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:"Internal server error"});
    }
}

const topSellingProducts = async (req, res) =>{
    try {
        res.json({message:"Top selling products"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:"Internal server error"});
    }
}
module.exports = {
    getAllProducts,
    getSingleProduct,
    createNewProduct,
    updateSingleProduct,
    deleteSingleProduct,

    searchProduct,
    topSellingProducts
}