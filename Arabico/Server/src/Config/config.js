require('dotenv').config()

if(!process.env.MONGO_URI){
    throw new Error("MONGO_URI is not defined in environment variables")

}
if(!process.env.JWT_SECRET_KEY){
    throw new Error("JWT_SECRET_KEY is not defined in environment variables")
}
if(!process.env.PORT){
    throw new Error("PORT is not defined in environment variables, using default port 3000")
}


const config = {
    mongoURI: process.env.MONGO_URI,
    port: process.env.PORT || 3000,
    jwtSecretKey: process.env.JWT_SECRET_KEY
}


module.exports = config