const tableModel = require('../models/table.model');

async function createTable(req, res) {
    const { tableNumber, capacity } = req.body;
    try {
        const existingTable = await tableModel.findOne({ tableNumber });
        if (existingTable) {
            return res.status(409).json({
                success: false,
                message: "Table already exists!"
            })
        }
        const tableCreation = await tableModel.create({
            tableNumber,
            capacity
        })
        return res.status(201).json({
            success: true,
            message: "Table created successfully",
            data: tableCreation
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

async function getAllTables(req, res) {
    try {
        const tables = await tableModel.find().lean();
        return res.status(200).json({
            success: true,
            message: "Tables retrieved successfully",
            data: tables,
            count: tables.length
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

async function getTableById(req, res) {
    const { id } = req.params;
    try {
        const table = await tableModel.findById(id);
        if (!table) {
            return res.status(404).json({
                success: false,
                message: "Table not found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Table retrieved successfully",
            data: table
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

async function updateTable(req, res) {
    const { id } = req.params;
    const { tableNumber, capacity, status } = req.body;
    try {
        const table = await tableModel.findById(id);
        if (!table) {
            return res.status(404).json({
                success: false,
                message: "Table not found"
            });
        }
        if (tableNumber !== undefined) {
            const existingTable = await tableModel.findOne({
                tableNumber,
                _id: { $ne: id }
            });
            if (existingTable) {
                return res.status(409).json({
                    success: false,
                    message: "Table already exists!"
                });
            }
            table.tableNumber = tableNumber;
        }
        if (capacity !== undefined) {
            table.capacity = capacity;
        }
        if (status !== undefined) {
            table.status = status;
        }
        const updatedTable = await table.save();
        return res.status(200).json({
            success: true,
            message: "Table updated successfully",
            data: updatedTable
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

async function deleteTable(req, res) {
    const { id } = req.params;
    try {
        const deletedTable = await tableModel.findByIdAndDelete(id);
        if (!deletedTable) {
            return res.status(404).json({
                success: false,
                message: "Failed to delete table. Table not found."
            });
        }
        return res.status(200).json({
            success: true,
            message: "Table deleted successfully"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

module.exports = { createTable, getAllTables, getTableById, updateTable, deleteTable }