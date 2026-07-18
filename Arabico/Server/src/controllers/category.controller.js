const categoryModel = require('../models/category.model');
/**
 * Create a new category
 * POST method: /api/categories/
 * Request body: { name, description, isActive }
 */
async function create(req, res) {
    const { name, description, isActive } = req.body;

    const existingCategory = await categoryModel.findOne({ name });
    if (existingCategory) {
        return res.status(400).json({ message: 'Category name already exists' });
    }
    const newCategory = await categoryModel.create({
        name,
        description,
        isActive
    });
    return res.status(201).json({
        message: 'Category created successfully',
        category: newCategory.name,
        description: newCategory.description,
        isActive: newCategory.isActive
    });
}
/**
 * Get all categories
 * GET method: /api/categories/
 */
async function getAll(req, res) {
    const categories = await categoryModel.find();
    return res.status(200).json({
        message: 'Categories retrieved successfully',
        categories
    });

}

async function getById(req, res) {
    const { id } = req.params;
    const category = await categoryModel.findById(id);
    if (!category) {
        return res.status(404).json({
            message: 'Category not found'
        });
    }
    return res.status(200).json({
        message: 'Category retrieved successfully',
        category: category.name,
        description: category.description,
        isActive: category.isActive
    });
}

async function update(req, res) {
    const { id } = req.params;
    const { name, description, isActive } = req.body;
    if (name) {
        const existingCategory = await categoryModel.findOne({ name });
        if (existingCategory && existingCategory._id.toString() !== id) {
            return res.status(400).json({ message: 'Category name already exists' });
        }
    }
    const updatedCategory = await categoryModel.findByIdAndUpdate(id, { name, description, isActive }, { new: true });
    if (!updatedCategory) {
        return res.status(404).json({
            message: 'Category not found'
        });
    }
    return res.status(200).json({
        message: 'Category updated successfully',
        category: updatedCategory.name,
        description: updatedCategory.description,
        isActive: updatedCategory.isActive
    });
}


async function deleteCategory(req, res) {
    const { id } = req.params;
    const deletedCategory = await categoryModel.findByIdAndDelete(id);
    if (!deletedCategory) {
        return res.status(404).json({
            message: 'Category not found'
        });
    }   
    return res.status(200).json({  message: 'Category deleted successfully' });

}

module.exports = { create, getAll, getById, update, deleteCategory }