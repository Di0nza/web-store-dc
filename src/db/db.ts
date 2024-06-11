import mongoose from 'mongoose';

export async function connect() {
    // Проверяем, есть ли уже активное подключение
    if (mongoose.connection.readyState === 1) {
        console.log('Уже подключено к MongoDB.');
        return;
    }

    try {
        await mongoose.connect(process.env.MONGO_URI!, {
            connectTimeoutMS: 30000,
        });

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
