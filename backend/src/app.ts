import express, { Express, Request, Response } from "express";
import http from "http";
import cors from "cors";
import * as dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import cookieParser from 'cookie-parser';
import { initializeRedis,disconnectRedis } from "./config/redis";
import { userRouter } from "./routes/user.routes";
import { doctorRouter } from "./routes/doctor.routes";
import { hospitalRouter } from "./routes/hospital.routes";
dotenv.config();

const app: Express = express();
const server = http.createServer(app);
const prisma = new PrismaClient();


async function initializeApp() {
    app.use(cookieParser());
    app.use(express.json());
    // app.use(cors());
    app.use(cors({
        origin: ['http://localhost:5173','http://localhost:5174'], // Frontend URL
        credentials: true, // Allows cookies or HTTP auth
        exposedHeaders: ['Authorization'], // Allows the frontend to access the Authorization header
    }));
    app.set('PORT', process.env.PORT || 5000);
    app.set("BASE_URL", process.env.BASE_URL || "localhost");

    // app.use('/api', AdminModule);
    app.use('/api/user', userRouter);
    app.use('/api/doctor', doctorRouter);
    app.use('/api/hospital',hospitalRouter);



    app.get('/health', async (req: Request, res: Response) => {
        try {
            await prisma.$queryRaw`SELECT 1;`;
            res.status(200).send("Hello");
        } catch (err: any) {
            console.log(err);
            res.status(500).send("Internal Server Error");
        }
    });
}

async function initializeDatabase() {
    try {
        await prisma.$queryRaw`SELECT 1;`;
        console.log("Database connection successful");
    } catch (error) {
        console.error("Error connecting to the database:", error);
        throw error;
    }
}

    async function RedisInit(){
        try {
            await initializeRedis();
        } catch (error) {
            console.log('Error connecting Redis : ',error);
        }
    }


async function startServer() {
    try {
        await initializeDatabase();
        // await initializeRedis();
        await initializeApp();
        await RedisInit();
        // await clearUserDatabase();

        const port = app.get('PORT');
        server.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
}

async function clearUserDatabase() {
    try {
        // await prisma.user.deleteMany({});
        await prisma.oPDRegistration.deleteMany({});
        console.log("All entries deleted from User model");
    } catch (error) {
        console.error("Error clearing User database:", error);
    }
}


startServer();

process.on('SIGINT', async () => {
    console.log('Shutting down gracefully...');
    await prisma.$disconnect();
    await disconnectRedis();
    // await redisClient.quit();
    process.exit(0);
});

export default server;