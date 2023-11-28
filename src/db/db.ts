import mongoose from 'mongoose';
require("dotenv").config();


export async function connect() {
    try {
        await mongoose.connect(process.env.MONGO_URI!);
        const connection = mongoose.connection;

        connection.on('connected', () => {
            console.log('MongoDB успешно подключена');
        });

        connection.on('error', (err) => {
            console.log('Ошибка подключения к MongoDB. Убедитесь, что MongoDB запущена. ' + err);
            process.exit();
        });

    } catch (error) {
        console.log('Что-то пошло не так!');
        console.log(error);
    }
}
