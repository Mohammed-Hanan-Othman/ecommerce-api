const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();

const getAllCustomers = async (req, res, next) =>{
    try {
        const customers = await prisma.customer.findMany();
        if (customers.length > 0) {
            res.locals.data = customers;
            return next();
        }
        return res.status(404).json({error:"No customers found"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:"Internal server error"});
    }
}
const getSingleCustomer = async (req, res) =>{
    try {
        const id = parseInt(req.params.id);
        if (id) {
            const customer = await prisma.customer.findFirst({
                where:{
                    id: id
                }
            })
            if (customer){
                return res.status(200).json({message:"Success",data:customer});
            }
            return res.status(404).json({error:"No customer found"});
        }
        return res.status(400).json({error:"Invalid id or id not provided"});
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:"Internal server error"});
    }
}
const createNewCustomer = async (req, res) =>{
    try {
        const {name, email, phone, address} = req.body;
        if (name && email && phone && address){
            const customer = await prisma.customer.create({
                data:{name, email, phone, address}
            })
            if (customer) {
                return res.status(201).json({message:"Customer created", data:customer});
            }
            return res.status(500).json({error:"Error occured while creating customer"});
        }
        return res.status(400).json({
            error:"Name or email or phone or address invalid or not provided"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:"Internal server error"});
    }
}
const updateSingleCustomer = async (req, res) =>{
    try {
        const {name, email, phone, address} = req.body;
        const id = parseInt(req.params.id);
        if (id && name && email && phone && address) {
            const customer = await prisma.customer.findFirst({
                where:{id:id}
            });
            if (!customer) {
                return res.status(404).json({
                    error:"No customer found with the associated id"
                });
            }
            const updatedCustomer = await prisma.customer.update({
                where:{id: id},
                data:{
                    name: name, address: address, email:email, phone:phone
                },
            });
            if (updatedCustomer) {
                console.log(updatedCustomer);
                return res.status(200).json({
                    message:"Success",
                    data: updatedCustomer
                });
            }
            return res.status(500).json({
                error:"Error while updating customer information"
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
const deleteSingleCustomer = async (req, res) =>{
    try {
        const id = parseInt(req.params.id);
        if (id) {
           const customer = await prisma.customer.findFirst({
            where:{id:id}
           })
           if (customer) {
                const deletedCustomer = await prisma.customer.delete({
                    where:{id:id}
                });
                return res.status(200).json({
                    message:"Customer deleted successfully",
                    data: deletedCustomer
                });
            }
           return res.status(404).json({
                error:"No customer found"
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

const getCustomerOrders = async (req, res) =>{
    try {
        const id = parseInt(req.params.id);
        if (id) {
            const customer = await prisma.customer.findFirst({
                where:{id:id}
            });
            if (!customer){
                return res.status(404).json({
                    error:"No customer found with the given customer id"
                });
            }
            const customerOrders = await prisma.customer.findFirst({
                where:{id:id},
                include:{orders:true,createdAt:false,updatedAt:false}
            });
            if (!customerOrders || customerOrders.length == 0) {
                return res.status(404).json({
                    error:"No orders found"
                });
            }
            return res.status(200).json({
                message:"Success",
                data: customerOrders
            });
        }
        return res.status(400).json({
            error:"Customer id invalid or not provided"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:"Internal server error"});
    }
}


module.exports = {
    getAllCustomers,
    getSingleCustomer,
    createNewCustomer,
    updateSingleCustomer,
    deleteSingleCustomer,

    getCustomerOrders,
};