const categoryModel = require('../models/category.model');
const menuModel = require('../models/menu.model');


/**
 * Creates a new menu item in the database
 * POST method
 * POST /api/menus
 * Protected route, requires authentication and admin role
 */
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
/**
 * Retrieves all menus from the database
 * GET method
 * GET /api/menus
 * Protected route, requires authentication
 */
async function getAllMenus(req, res) {
    try {
        const menus = await menuModel.find().populate('category', 'name');
        return res.status(200).json({
            success: true,
            data: menus
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            count: menus.length,
            data: menus,
            message: 'Internal server error'
        });
    }
}

/**
 * Retrieves a menu by its ID from the database
 * GET method
 * GET /api/menus/:id
 * not a protected route  
 */

async function getMenuById(req, res) {
    const { id } = req.params;
    try {
        const menu = await menuModel.findById(id).populate('category', 'name');
        if (!menu) {
            return res.status(404).json({
                success: false,
                message: 'Menu not found'
            });
        }
        return res.status(200).json({
            success: true,
            data: menu
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

module.exports = { createMenu, getAllMenus, getMenuById }