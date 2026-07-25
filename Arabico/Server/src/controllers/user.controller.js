const userModel = require('../models/user.model')

async function updateUserRole(req, res) {
    const { userId } = req.params;
    const { role } = req.body;
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "User not found"
            });
        }
        const currentRole = user.role;
        if (currentRole === role) {
            return res.status(400).json({
                status: "error",
                message: `User already has the role ${role}`
            });
        }
        if (currentRole === "admin" && role !== "admin") {
            return res.status(403).json({
                status: "error",
                message: "Cannot change role of an admin user"
            });
        }
        if(role==='admin'){
            return res.status(403).json({
                status: "error",
                message: "Cannot assign admin role"
            });
        }
        user.role = role;
        await user.save();
        res.status(200).json({
            status: "success",
            message: `User role updated to ${role}`
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            status: "error",
            message: "Error updating user role",
            user: {
                Id: userId,
                username: user.username,
                role: role
            }
        });
    }
}

module.exports = {
    updateUserRole
};