import { ApiResponse } from '../utils/ApiResponse';
import { UserService } from "../services/user.service";
import cloudinaryService from "../utils/cloudinaryService";
import { Request, Response } from "express";

const userService = new UserService();

export class UserController {
    public async checkHealth(req: any, res: any) {
        try {
            return res.status(200).json(
                new ApiResponse(200, {}, "Server is up and running")
            );
        } catch (error) {
            console.error("Error in checkHealth Controller : ", error);
            return res.status(500).json(
                new ApiResponse(500, { error }, "Error while checking health")
            );
        }
    }

    public async registerUser(req: any, res: any) {
        try {
            const { username, email, password, contactNumber, avatar, age, gender, address, insuranceCard, rationCard, permanentIllness, disabilityStatus, role } = req.body;

            if (!username || !email || !password || !contactNumber || !role) {
                return res.status(400).json(
                    new ApiResponse(400, {}, "Please provide all required details")
                );
            }

            let avatarUrl = avatar || userService.defaultAvatar;

            if (req.files && Array.isArray(req.files) && req.files.length) {
                const file = req.files[req.files.length - 1] as any;
                const uploadResult = await cloudinaryService.uploadImage(file.buffer, `${username}-${Date.now()}`);
                avatarUrl = (uploadResult as { secure_url: string }).secure_url;
            }

            const response = await userService.register({
                username, 
                email, 
                password, 
                contactNumber, 
                role,
                avatar: avatarUrl,
                age: age ? parseInt(age) : null,
                gender, 
                address, 
                insuranceCard, 
                rationCard,
                permanentIllness: permanentIllness ? permanentIllness.toString() : null,
                disabilityStatus: disabilityStatus ? disabilityStatus.toString() : null
            });

            return res.status(response.statusCode).json(response);
        } catch (error: any) {
            console.error("Error in registerUser Controller : ", error);
            return res.status(500).json(
                new ApiResponse(500, {}, error.message || "Failed to register user")
            );
        }
    }

    public async loginUser(req: any, res: any) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json(
                    new ApiResponse(400, {}, "Email and password are required")
                );
            }

            const response = await userService.login({ email, password });
            if (!response.success) {
                return res.status(response.statusCode).json(response);
            }

            const { user, accessToken, refreshToken } = response.data;
            const options = {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production'
            };

            return res
                .status(200)
                .cookie("accessToken", accessToken, options)
                .cookie("refreshToken", refreshToken, { 
                    ...options, 
                    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) 
                })
                .json(
                    new ApiResponse(200, { user, accessToken, refreshToken }, "User logged in successfully")
                );
        } catch (error: any) {
            console.error("Error in loginUser Controller : ", error);
            return res.status(500).json(
                new ApiResponse(500, {}, error.message || "Failed to login")
            );
        }
    }

    public async logoutUser(req: any & { user?: any }, res: any) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json(
                    new ApiResponse(401, {}, "Unauthorized request")
                );
            }

            const response = await userService.logout(userId);

            const options = {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production'
            };

            return res
                .status(response.statusCode)
                .clearCookie("accessToken", options)
                .clearCookie("refreshToken", options)
                .json(response);
        } catch (error: any) {
            console.error("Error in logoutUser Controller : ", error);
            return res.status(500).json(
                new ApiResponse(500, {}, error.message || "Failed to logout")
            );
        }
    }

    public async refreshAccessToken(req: any, res: any) {
        try {
            const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
            if (!incomingRefreshToken) {
                return res.status(401).json(
                    new ApiResponse(401, {}, "Refresh token is required")
                );
            }

            const response = await userService.refreshToken(incomingRefreshToken);
            if (!response.success) {
                return res.status(response.statusCode).json(response);
            }

            const { accessToken, refreshToken } = response.data;
            const options = {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production'
            };

            return res
                .status(200)
                .cookie("accessToken", accessToken, options)
                .cookie("refreshToken", refreshToken, options)
                .json(
                    new ApiResponse(200, { accessToken, refreshToken }, "Access token refreshed")
                );
        } catch (error: any) {
            console.error("Error in refreshAccessToken Controller : ", error);
            return res.status(500).json(
                new ApiResponse(500, {}, error.message || "Failed to refresh token")
            );
        }
    }

    public async changeCurrentPassword(req: any & { user?: any }, res: any) {
        try {
            const { oldPassword, newPassword } = req.body;
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json(
                    new ApiResponse(401, {}, "Unauthorized request")
                );
            }

            if (!oldPassword || !newPassword) {
                return res.status(400).json(
                    new ApiResponse(400, {}, "Old password and new password are required")
                );
            }

            const response = await userService.changeCurrentPassword(userId, oldPassword, newPassword);
            return res.status(response.statusCode).json(response);
        } catch (error: any) {
            console.error("Error in changeCurrentPassword Controller : ", error);
            return res.status(500).json(
                new ApiResponse(500, {}, error.message || "Failed to change password")
            );
        }
    }

    public async forgetPassword(req: any, res: any) {
        try {
            const { email } = req.body;
            if (!email) {
                return res.status(400).json(
                    new ApiResponse(400, {}, "Email is required")
                );
            }

            const response = await userService.handleForgetPassword(email);
            return res.status(response.statusCode).json(response);
        } catch (error: any) {
            console.error("Error in forgetPassword controller : ", error);
            return res.status(500).json(
                new ApiResponse(500, {}, error.message || "Failed to send OTP")
            );
        }
    }

    public async resetPassword(req: any, res: any) {
        try {
            const { email, otp, newPassword } = req.body;
            if (!email || !otp || !newPassword) {
                return res.status(400).json(
                    new ApiResponse(400, {}, "Email, OTP, and new password are required")
                );
            }

            const response = await userService.updatePassword(email, otp, newPassword);
            return res.status(response.statusCode).json(response);
        } catch (error: any) {
            console.error("Error in resetPassword controller : ", error);
            return res.status(500).json(
                new ApiResponse(500, {}, error.message || "Failed to reset password")
            );
        }
    }

    public async getMe(req: any & { user?: any }, res: any) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json(
                    new ApiResponse(401, {}, "Unauthorized request")
                );
            }

            const user = await userService.getUserById(parseInt(userId));
            if (!user) {
                return res.status(404).json(
                    new ApiResponse(404, {}, "User not found")
                );
            }

            const { password, ...userWithoutPassword } = user;
            return res.status(200).json(
                new ApiResponse(200, { user: userWithoutPassword }, "User fetched successfully")
            );
        } catch (error: any) {
            console.error("Error in getMe controller : ", error);
            return res.status(500).json(
                new ApiResponse(500, {}, error.message || "Failed to get user details")
            );
        }
    }

    public async updateProfile(req: any & { user?: any, files?: any }, res: any) {
        try {
            const { username, email, contactNumber, age, gender, address, insuranceCard, rationCard, permanentIllness, disabilityStatus } = req.body;
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json(
                    new ApiResponse(401, {}, "Unauthorized request")
                );
            }

            const user = await userService.getUserById(parseInt(userId));
            if (!user) {
                return res.status(404).json(
                    new ApiResponse(404, {}, "User not found")
                );
            }

            let avatarUrl = user.avatar || userService.defaultAvatar;

            if (req.files && Array.isArray(req.files) && req.files.length > 0) {
                const file = req.files[req.files.length - 1];
                try {
                    const uploadResult = await cloudinaryService.uploadImage(file.buffer, `${username || user.username}-${Date.now()}`);
                    const result = uploadResult as { secure_url: string };
                    avatarUrl = result.secure_url;
                } catch (uploadError) {
                    return res.status(500).json(
                        new ApiResponse(500, { error: uploadError }, "Error while uploading avatar image")
                    );
                }
            }

            const updateData = {
                ...(username && { username }),
                ...(email && { email }),
                ...(contactNumber && { contactNumber }),
                avatar: avatarUrl,
                ...(age && { age: parseInt(age) }),
                ...(gender && { gender }),
                ...(address && { address }),
                ...(insuranceCard && { insuranceCard }),
                ...(rationCard && { rationCard }),
                ...(permanentIllness !== undefined && { 
                    permanentIllness: permanentIllness.toString() 
                }),
                ...(disabilityStatus !== undefined && { 
                    disabilityStatus: disabilityStatus.toString() 
                })
            };

            const response = await userService.updateProfile(parseInt(userId), updateData);
            return res.status(response.statusCode).json(response);
        } catch (error: any) {
            console.error("Error in updateProfile controller : ", error);
            return res.status(500).json(
                new ApiResponse(500, {}, error.message || "Failed to update profile")
            );
        }
    }

    public async getAllUsers(req: any & { user?: any }, res: any) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json(
                    new ApiResponse(401, {}, "Unauthorized request")
                );
            }

            const response = await userService.getAllUsers();
            return res.status(response.statusCode).json(response);
        } catch (error: any) {
            console.error("Error in getAllUsers controller : ", error);
            return res.status(500).json(
                new ApiResponse(500, {}, error.message || "Failed to fetch users")
            );
        }
    }
}