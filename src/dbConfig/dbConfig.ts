import mongoose from "mongoose";

export async function connect() {
    try {
        mongoose.connect(process.env.MONGO_URI!);
        const connection = mongoose.connection;
        connection.on('connected', () => {
            console.log('mongoDB connected successfully');
        })
        connection.on('error', (err) => {
            console.log('mongoDB connection error' + err);
        })
        process.exit();
    } catch (error) {
        console.log(error)
    }

}
