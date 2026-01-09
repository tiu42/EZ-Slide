// Middleware to check if user has admin role
export const adminOnly = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Not authorized, please login first"
            });
        }

        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin privileges required."
            });
        }

        next();
    } catch (err) {
        console.error("Admin authorization error:", err.message);
        res.status(500).json({
            success: false,
            message: "Server error during authorization"
        });
    }
};
