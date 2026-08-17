const express = require('express');
require('dotenv').config();
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
/**
 * Importing routes
 */
const authRoutes = require('./routes/auth.route');
const userRoute = require('./routes/user.route');
const categoryRoutes = require('./routes/category.route');
const menuRoutes = require('./routes/menu.route');
const tableRoutes = require('./routes/table.route');


const app = express();
app.use(helmet());
app.use(morgan('dev'));
app.use(cookieParser());

app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
}));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoute)
app.use('/api/menus', menuRoutes);
app.use('/api/tables', tableRoutes);
module.exports = app;