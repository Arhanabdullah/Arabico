const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const config = require("../config/config");
const { connectDB, disconnectDB } = require("../config/db");