const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();

const getAllOrders = async (req, res, next) =>{
    try {
        const orders = await prisma.order.findMany({
            include:{orderItems:true}
        });
        if (orders.length > 0) {
            res.locals.data = orders;
            return next();
        }
        return res.status(404).json({error:"No orders found"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:"Internal server error"});
    }
}
const getSingleOrder = async (req, res) =>{
    try {
        const id = parseInt(req.params.id);
        if (id) {
            const order = await prisma.order.findFirst({
                where:{id: id},
                include:{orderItems:true}
            })
            if (order){
                return res.status(200).json({message:"Success",data:order});
            }
            return res.status(404).json({error:"No order found"});
        }
        return res.status(400).json({error:"Invalid id or id not provided"}); 
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:"Internal server error"});
    }
}
const createNewOrder = async (req, res) =>{
    try {
        const {customerId, items} = req.body;
        if (customerId, items){
            var order; 
            const result = await prisma.$transaction(async (prisma)=>{
                // Create an empty order with "pending" status
                order = await prisma.order.create({
                    data:{
                        customerId: customerId,
                        totalAmount:0,
                        status:"Pending"
                    }
                });
                // Create order items associated with the new order
                const orderItems = items.map(item => ({
                    orderId: order.id,
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price,
                }));
                await prisma.orderItem.createMany({ data: orderItems });

                // Calculate the total amount 
                const totalAmountData = await prisma.orderItem.findMany({
                    where: { orderId: order.id },
                    select: { price: true, quantity: true },
                });
                const totalAmount = totalAmountData.reduce(
                    (sum, item) => sum + item.price * item.quantity, 0
                );

                // Update the order's total amount
                const updatedOrder = await prisma.order.update({ 
                    where: { id: order.id }, 
                    data: { totalAmount } 
                });

                // Update Product quantity
                for (const item of items) {
                    await prisma.product.update({
                        where:{
                            id: item.productId
                        },
                        data:{
                            quantity:{
                                decrement: item.quantity
                            }
                        }
                    });
                }
            });
            const completeOrder = await prisma.order.findFirst({
                where:{
                    id: order.id
                }
            });
            return res.status(201).json({
                message: "Order created successfully",
                data:completeOrder
            });
        }
        return res.status(400).json({
            error:"Customer id or items invalid or not provided"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:"Internal server error"});
    }
}
const updateSingleOrder = async (req, res) =>{
    try {
        const id = parseInt(req.params.id);
        const {status} = req.body;
        if (id && status) {
            const order = await prisma.order.findFirst({
                where:{id: id}
            });
            if (!order) {
                return res.status(404).json({
                    error:"No order found with the associated id"
                });
            }
            const updatedOrder = await prisma.order.update({
                where:{id: id},
                data:{status},
            });
            if (updatedOrder) {
                console.log(updatedOrder);
                return res.status(200).json({
                    message:"Success",
                    data: updatedOrder
                });
            }
            return res.status(500).json({
                error:"Error while updating order information"
            });
        }
        return res.status(400).json({
            error:"Order id or order status invalid or not provided"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:"Internal server error"});
    }
}
const deleteSingleOrder = async (req, res) =>{
    try {
        const id = parseInt(req.params.id);
        if (id) {
            const order = await prisma.order.findFirst({
                where:{id:id}
            })
            if (order) {
                await prisma.$transaction(async (prisma) =>{
                    await prisma.orderItem.deleteMany({
                        where:{ orderId: id }
                    });

                    await prisma.order.delete({
                        where:{ id:id }
                    });
                });
                return res.status(200).json({
                    message:"Order deleted successfully",
                    data: order
                });
            }
            return res.status(404).json({
                error:"No order found with associated id"
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

const getOrdersByCustomer = async (req, res)=>{
    try {
        const customerId = parseInt(req.params.customerId);
        if (customerId) {
            const customer = await prisma.customer.findFirst({
                where:{id:customerId}
            });
            if (!customer){
                return res.status(404).json({
                    error:"No customer found with the given customer id"
                });
            }
            const customerOrders = await prisma.order.findMany({
                where:{customerId},
                select:{id:true,status:true,totalAmount:true,orderItems:true,createdAt:true,updatedAt:true,},
                orderBy:{id:"asc"},
            });
            if (!customerOrders || customerOrders.length == 0) {
                return res.status(404).json({
                    error:"No orders found"
                });
            }
            return res.status(200).json({
                message:"Success",
                data: {
                    customerId: customerId,
                    orders: customerOrders
                }
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

const searchOrders = async (req, res, next) =>{
    try {
        const {status} = req.query || "completed";
        const minTotal = parseFloat(req.query.minTotal) || 0;
        const maxTotal = parseFloat(req.query.maxTotal) || 1000;
        console.log({status,minTotal,maxTotal});
        const orders = await prisma.order.findMany({
            where:{
                status:{contains:status},
                AND:{
                    totalAmount:{gte:minTotal, lte:maxTotal}
                }
            },
            include:{customer:true},
            orderBy:[{updatedAt:"desc"},{totalAmount:"desc"}]
        });
        if(orders.length < 1){
            return res.status(404).json({
                error:"No matching products found"
            });
        }
        res.locals.data = orders;
        return next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:"Internal server error"});
    }
}

module.exports = {
    getAllOrders,
    getSingleOrder,
    createNewOrder,
    updateSingleOrder,
    deleteSingleOrder,

    getOrdersByCustomer,
    searchOrders
}