import { PrismaClient, User, UserRole, Gender } from '@prisma/client';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendOtpEmail } from '../utils/emailUtil';
import { ApiResponse } from '../utils/ApiResponse';

const prisma = new PrismaClient();

interface UserData {
    email: string;
    password: string;
    username: string;
    contactNumber: string;
    role: UserRole;
    avatar?: string;
    age?: number | null;
    gender?: Gender | null;  // Changed from string | null to Gender | null
    address?: string;
    insuranceCard?: string;
    rationCard?: string;
    permanentIllness?: string | null;
    disabilityStatus?: string | null;
}

interface TokenPayload {
    userId: number;
    email?: string;
    username?: string;
    role?: string;
}

export class UserService {
    public readonly defaultAvatar = "https://www.shutterstock.com/shutterstock/photos/1760295569/display_1500/stock-vector-profile-picture-avatar-icon-vector-1760295569.jpg";

    public async register(userData: UserData): Promise<ApiResponse> {
        const existingUser = await this.getUserByEmail(userData.email);
        if (existingUser) {
            return new ApiResponse(400, {}, "User already exists");
        }

        const hashedPassword = await bcryptjs.hash(userData.password, 10);
        const newUser = await prisma.user.create({
            data: {
                ...userData,
                password: hashedPassword,
                permanentIllness: userData.permanentIllness || null,
                disabilityStatus: userData.disabilityStatus || null
            }
        });

        const { password, ...userWithoutPassword } = newUser;
        return new ApiResponse(201, { user: userWithoutPassword }, "User registered successfully");
    }

    public async login(credentials: { email: string; password: string }): Promise<ApiResponse> {
        const user = await this.getUserByEmail(credentials.email);
        if (!user) {
            return new ApiResponse(404, {}, "User not found");
        }

        const isValidPassword = await bcryptjs.compare(credentials.password, user.password);
        if (!isValidPassword) {
            return new ApiResponse(401, {}, "Invalid credentials");
        }

        try {
            const accessToken = await this.generateAccessToken(user);
            const refreshToken = await this.generateRefreshToken(user);

            const { password, ...userWithoutPassword } = user;
            return new ApiResponse(200, 
                { user: userWithoutPassword, accessToken, refreshToken },
                "Login successful"
            );
        } catch (error) {
            return new ApiResponse(500, {}, "Failed to generate tokens");
        }
    }

    public async refreshToken(incomingRefreshToken: string): Promise<ApiResponse> {
        const secret = process.env.JWT_REFRESH_SECRET_KEY;
        if (!secret) {
            return new ApiResponse(500, {}, "Internal server error");
        }

        try {
            const decodedToken = jwt.verify(incomingRefreshToken, secret) as TokenPayload;
            const user = await prisma.user.findUnique({
                where: { id: decodedToken.userId }
            });

            if (!user) {
                return new ApiResponse(401, {}, "Invalid refresh token");
            }

            const accessToken = await this.generateAccessToken(user);
            const refreshToken = await this.generateRefreshToken(user);

            return new ApiResponse(200, 
                { accessToken, refreshToken },
                "Tokens refreshed successfully"
            );
        } catch (error) {
            return new ApiResponse(401, {}, "Invalid refresh token");
        }
    }

    public async logout(userId: number): Promise<ApiResponse> {
        try {
            await this.deleteRefreshToken(userId);
            return new ApiResponse(200, {}, "Logged out successfully");
        } catch (error) {
            return new ApiResponse(500, {}, "Failed to logout");
        }
    }

    public async handleForgetPassword(email: string): Promise<ApiResponse> {
        const user = await this.getUserByEmail(email);
        if (!user) {
            return new ApiResponse(404, {}, "User not found");
        }

        try {
            const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
            const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

            await prisma.user.update({
                where: { id: user.id },
                data: { otp: generatedOtp, otpExpires }
            });

            await sendOtpEmail(email, generatedOtp);
            return new ApiResponse(200, {}, "OTP sent to your email");
        } catch (error) {
            return new ApiResponse(500, {}, "Failed to send OTP");
        }
    }

    public async updatePassword(email: string, otp: string, newPassword: string): Promise<ApiResponse> {
        const user = await this.getUserByEmail(email);
        if (!user) {
            return new ApiResponse(404, {}, "User not found");
        }

        if (!user.otp || user.otp !== otp || !user.otpExpires || user.otpExpires < new Date()) {
            return new ApiResponse(400, {}, "Invalid or expired OTP");
        }

        try {
            const hashedPassword = await bcryptjs.hash(newPassword, 10);
            await prisma.user.update({
                where: { email },
                data: { 
                    password: hashedPassword,
                    otp: null,
                    otpExpires: null
                }
            });

            return new ApiResponse(200, {}, "Password updated successfully");
        } catch (error) {
            return new ApiResponse(500, {}, "Failed to update password");
        }
    }

    public async changeCurrentPassword(userId: number, oldPassword: string, newPassword: string): Promise<ApiResponse> {
        const user = await this.getUserById(userId);
        if (!user) {
            return new ApiResponse(404, {}, "User not found");
        }

        const isPasswordCorrect = await bcryptjs.compare(oldPassword, user.password);
        if (!isPasswordCorrect) {
            return new ApiResponse(400, {}, "Invalid old password");
        }

        try {
            const hashedPassword = await bcryptjs.hash(newPassword, 10);
            await prisma.user.update({
                where: { id: userId },
                data: { password: hashedPassword }
            });
            return new ApiResponse(200, {}, "Password changed successfully");
        } catch (error) {
            return new ApiResponse(500, {}, "Failed to change password");
        }
    }

    public async updateProfile(userId: number, data: any): Promise<ApiResponse> {
        try {
            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data
            });

            const { password, ...userWithoutPassword } = updatedUser;
            return new ApiResponse(200, { user: userWithoutPassword }, "Profile updated successfully");
        } catch (error) {
            return new ApiResponse(500, {}, "Failed to update profile");
        }
    }

    public async getAllUsers(): Promise<ApiResponse> {
        try {
            const users = await prisma.user.findMany({
                select: {
                    id: true,
                    username: true,
                    email: true,
                    role: true,
                    avatar: true,
                    contactNumber: true,
                    createdAt: true,
                    updatedAt: true
                }
            });
            return new ApiResponse(200, { users }, "Users fetched successfully");
        } catch (error) {
            return new ApiResponse(500, {}, "Failed to fetch users");
        }
    }

    public async getUserById(userId: number): Promise<User | null> {
        return prisma.user.findUnique({
            where: { id: userId }
        });
    }

    private async getUserByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { email }
        });
    }

    private async generateAccessToken(user: User): Promise<string> {
        const secret = process.env.JWT_ACCESS_SECRET_KEY;
        if (!secret) {
            throw new Error("JWT_ACCESS_SECRET_KEY not found");
        }

        return jwt.sign(
            {
                userId: user.id,
                email: user.email,
                username: user.username,
                role: user.role,
            },
            secret,
            { expiresIn: '1h' }
        );
    }

    private async generateRefreshToken(user: User): Promise<string> {
        const secret = process.env.JWT_REFRESH_SECRET_KEY;
        if (!secret) {
            throw new Error("JWT_REFRESH_SECRET_KEY Not Found");
        }

        const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '7d' });
        await this.saveRefreshToken(user.id, token);
        return token;
    }

    private async saveRefreshToken(userId: number, token: string): Promise<void> {
        const existingToken = await prisma.refreshToken.findUnique({
            where: { userId }
        });

        if (existingToken) {
            await prisma.refreshToken.update({
                where: { userId },
                data: { token }
            });
        } else {
            await prisma.refreshToken.create({
                data: { userId, token }
            });
        }
    }

    private async deleteRefreshToken(userId: number): Promise<void> {
        await prisma.refreshToken.deleteMany({
            where: { userId }
        }).catch(() => {});
    }
}