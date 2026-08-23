const orderModel = require('../models/order.model');
const tableModel = require('../models/table.model');
const menuModel = require('../models/menu.model');
const counterModel = require('../models/counter.model');

async function createOrder(req, res) {
    const {
        orderType,
        table,
        items,
        customerName,
        customerPhone,
        deliveryAddress
    } = req.body;

    try {
        //Check table for dine-in orders
        let existingTable = null;
        if (orderType === 'dine_in') {
            existingTable = await tableModel.findById(table);
            if (!existingTable) {
                return res.status(404).json({
                    success: false,
                    message: 'Table not found'
                });
            }
            if (existingTable.status !== 'available') {
                return res.status(409).json({
                    success: false,
                    message: 'Table is not available'
                });
            }
        }
        //Build order items using prices from the database
        const orderItems = [];
        for (const item of items) {
            const menuItem = await menuModel.findById(item.menu);
            if (!menuItem) {
                return res.status(404).json({
                    success: false,
                    message: `Menu item with ID ${item.menu} not found`
                });
            }
            if (!menuItem.isAvailable) {
                return res.status(409).json({
                    success: false,
                    message: `${menuItem.name} is currently unavailable`
                });
            }
            const subtotal = menuItem.price * item.quantity;
            orderItems.push({
                menu: menuItem._id,
                quantity: item.quantity,
                price: menuItem.price,
                subtotal
            });
        }
        //Calculate total amount on the backend
        const totalAmount = orderItems.reduce(
            (total, item) => total + item.subtotal,
            0
        );
        //Generate a unique order number using the counter model
        const orderNumber = await counterModel.getNextSequence('order');
        //Create the order
        const orderCreation = await orderModel.create({
            orderNumber,
            orderType,
            table: orderType === 'dine_in'
                ? table
                : null,
            items: orderItems,
            totalAmount,
            customerName: orderType !== 'dine_in'
                ? customerName
                : null,
            customerPhone: orderType !== 'dine_in'
                ? customerPhone
                : null,
            deliveryAddress: orderType === 'delivery'
                ? deliveryAddress
                : null,
            createdBy: req.user._id
        });

        //Mark table as occupied for dine-in orders
        if (orderType === 'dine_in') {
            existingTable.status = 'occupied';
            await existingTable.save();
        }
        return res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: orderCreation
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

module.exports = { createOrder };