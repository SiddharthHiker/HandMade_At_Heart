import mongoose from 'mongoose';
import colors from 'colors';

const connectDB = async() => {
    try { 
       await mongoose.connect(process.env.MONGO_URL);
       console.log(`Mongodb Connected ${mongoose.connection.host}`.bgMagenta.white); 
    } catch (error){
        console.log(`MongoDb Error ${error}`.bgRed);
    }
};
export default connectDB;