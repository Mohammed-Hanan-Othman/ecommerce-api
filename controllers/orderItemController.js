const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();

const getAllOrderItems = async (req, res, next) =>{
    try {
        const orderItems = await prisma.orderItem.findMany();
        if (orderItems.length > 0) {
            res.locals.data = orderItems;
            return next();
        }
        return res.status(404).json({error:"No order items found"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:"Internal server error"});
    }
}
const getSingleOrderItem = async (req, res) =>{
    try {
        const id = parseInt(req.params.id);
        if (id) {
            const orderItem = await prisma.orderItem.findFirst({
                where:{
                    id: id
                }
            })
            if (orderItem){
                return res.status(200).json({message:"Success",data:orderItem});
            }
            return res.status(404).json({error:"No order item found"});
        }
        return res.status(400).json({error:"Invalid id or id not provided"});
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:"Internal server error"});
    }
}

module.exports = {
    getAllOrderItems,
    getSingleOrderItem
}