const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();

const getAllSuppliers = async (req, res, next) =>{
    try {
        const suppliers = await prisma.supplier.findMany();
        if (suppliers.length > 0) {
            res.locals.data = suppliers;
            return next();
        }
        return res.status(404).json({error:"No suppliers found"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:"Internal server error"});
    }
}
const getSingleSupplier = async (req, res) =>{
    try {
        const id = parseInt(req.params.id);
        if (id) {
            const supplier = await prisma.supplier.findFirst({
                where:{
                    id: id
                }
            })
            if (supplier){
                return res.status(200).json({message:"Success",data:supplier});
            }
            return res.status(404).json({error:"No supplier found"});
        }
        return res.status(400).json({error:"Invalid id or id not provided"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:"Internal server error"});
    }
}
const createNewSupplier = async (req, res) =>{
    try {
        const {name, email, phone, address} = req.body;
        if (name && email && phone && address){
            const supplier = await prisma.supplier.create({
                data:{name, email, phone, address}
            })
            if (supplier) {
                return res.status(201).json({message:"Supplier created", data:supplier});
            }
            return res.status(500).json({error:"Error occured while creating supplier"});
        }
        return res.status(400).json({
            error:"Name or email or phone or address invalid or not provided"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:"Internal server error"});
    }
}
const updateSingleSupplier = async (req, res) =>{
    try {
        const {name, email, phone, address} = req.body;
        const id = parseInt(req.params.id);
        if (id && name && email && phone && address) {
            const supplier = await prisma.supplier.findFirst({
                where:{id:id}
            });
            if (!supplier) {
                return res.status(404).json({
                    error:"No supplier found with the associated id"
                });
            }
            const updatedSupplier = await prisma.supplier.update({
                where:{id: id},
                data:{
                    name: name, address: address, email:email, phone:phone
                },
            });
            if (updatedSupplier) {
                console.log(updatedSupplier);
                return res.status(200).json({
                    message:"Success",
                    data: updatedSupplier
                });
            }
            return res.status(500).json({
                error:"Error while updating supplier information"
            });
        }
        return res.status(400).json({
            error:"Id or name or email or phone or address invalid or not provided"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:"Internal server error"});
    }
}
const deleteSingleSupplier = async (req, res) =>{
    try {
        const id = parseInt(req.params.id);
        if (id) {
            const supplier = await prisma.supplier.findFirst({
                where:{id:id}
            })
            if (supplier) {
                const deletedSupplier = await prisma.supplier.delete({
                    where:{id:id}
                });
                return res.status(200).json({
                    message:"Supplier deleted successfully",
                    data: deletedSupplier
                });
            }
            return res.status(404).json({
                error:"No supplier found"
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
const getSupplierProducts = async (req,res)=>{
    try {
        const id = parseInt(req.params.id);
        if (id) {
            const supplier = await prisma.supplier.findFirst({
                where:{id:id}
            });
            if (!supplier) {
                return res.status(404).json({
                    error:"No supplier found with the given id"
                });
            }
            const supplierProducts = await prisma.supplier.findMany({
                where:{id:id},
                include:{
                    products:true,
                    createdAt:false,
                    updatedAt:false
                }
            });
            if (!supplierProducts || supplierProducts.length == 0) {
                return res.status(404).json({
                    error:"No products found for this supplier"
                });
            }
            return res.status(200).json({
                message:"Success",
                data: supplierProducts
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
module.exports = {
    getAllSuppliers,
    getSingleSupplier,
    createNewSupplier,
    updateSingleSupplier,
    deleteSingleSupplier,

    getSupplierProducts
}