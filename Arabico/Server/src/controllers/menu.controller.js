const categoryModel = require('../models/category.model');
const menuModel = require('../models/menu.model');

async function createMenu(req, res) {

    const { name, description, price, category, isAvailable } = req.body;
    try {
        const categoryExists = await categoryModel.findById(category);
        if (!categoryExists) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }
        const existingMenu = await menuModel.findOne({
            name: new RegExp(`^${name}$`, "i")
        });
        if (existingMenu) {
            return res.status(409).json({
                success: false,
                message: 'Menu with this name already exists'
            });
        }
        const newMenu = await menuModel.create({
            name,
            description,
            price,
            category,
            isAvailable
        });
        return res.status(201).json({
            success: true,
            message: 'Item added successfully',
            data: newMenu
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

module.exports = { createMenu }