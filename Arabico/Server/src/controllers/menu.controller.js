const categoryModel = require('../models/category.model');
const menuModel = require('../models/menu.model');
const { uploadOnCloudinary } = require('../utils/cloudinary');

/**
 * Creates a new menu item in the database
 * POST method
 * POST /api/menus
 * Protected route, requires authentication and admin role
 */
async function createMenu(req, res) {

    const { name, description, price, category, isAvailable } = req.body;
    const file = req.file;
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Image is required"
            });
        }
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
        const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
        if (!cloudinaryResponse) {
            return res.status(500).json({
                success: false,
                message: "Image upload failed"
            });
        }
        const newMenu = await menuModel.create({
            name,
            description,
            price,
            category,
            isAvailable,
            image: {
                url: cloudinaryResponse.secure_url,
                publicId: cloudinaryResponse.public_id
            }
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
 * Public route, does not require authentication
 */
async function getAllMenus(req, res) {
    try {
        const menus = await menuModel
            .find()
            .populate("category", "name")
            .select("name description price image category isAvailable")
            .lean();

        return res.status(200).json({
            success: true,
            count: menus.length,
            data: menus
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
 * Retrieves a menu by its ID from the database
 * GET method
 * GET /api/menus/:id
 * Public route, does not require authentication  
 */

async function getMenuById(req, res) {
    const { id } = req.params;
    try {
        const menu = await menuModel
            .findById(id)
            .populate("category", "name")
            .select("name description price image category isAvailable")
            .lean();
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

/**
 * Updates a menu item in the database
 * PATCH method
 * PATCH /api/menus/:id
 * Protected route, requires authentication and admin role
 */
async function updateMenu(req, res) {
    const { id } = req.params;
    const { name, description, price, category, isAvailable } = req.body;
    const file = req.file;
    try {
        const menu = await menuModel.findById(id);
        if (!menu) {
            return res.status(404).json({
                success: false,
                message: "Cannot find the item"
            })
        }
        if (category !== undefined) {
            const categoryExists = await categoryModel.findById(category);
            if (!categoryExists) {
                return res.status(404).json({
                    success: false,
                    message: 'Category not found'
                });
            }
        }
        if (name !== undefined) {
            const existingMenu = await menuModel.findOne({
                name: new RegExp(`^${name}$`, "i"),
                _id: { $ne: id }
            });
            if (existingMenu) {
                return res.status(409).json({
                    success: false,
                    message: 'Menu with this name already exists'
                });
            }
        }
        if (req.file !== undefined) {
            const updateImageOnCloudinary = await uploadOnCloudinary(req.file.path);
            if (!updateImageOnCloudinary) {
                return res.status(500).json({
                    success: false,
                    message: "Image upload failed"
                });
            }
        }

        const updatedMenu = await menuModel.findByIdAndUpdate(
            id,
            {
                name,
                description,
                price,
                category,
                image: {
                    url: updateImageOnCloudinary.secure_url,
                    publicId: updateImageOnCloudinary.public_id
                },
                isAvailable
            },
            {
                new: true,
                runValidators: true
            }
        ).populate("category", "name");

        await deleteFromCloudinary(menu.image.publicId); // Delete the old image from Cloudinary after successful update
        if (!updatedMenu) {
            return res.status(404).json({
                success: false,
                message: 'Menu not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Item updated successfully',
            data: updatedMenu
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
 * Deletes a menu item from the database
 * DELETE method
 * DELETE /api/menus/:id
 * Protected route, requires authentication and admin role
 */

async function deleteMenu(req, res) {
    const { id } = req.params;
    try {
        const deletedMenu = await menuModel.findByIdAndDelete(id);
        if (!deletedMenu) {
            return res.status(404).json({
                success: false,
                message: 'Menu not found'
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Item deleted successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

module.exports = { createMenu, getAllMenus, getMenuById, updateMenu, deleteMenu }