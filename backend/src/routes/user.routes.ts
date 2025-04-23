import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { isAuthenticated } from "../middlewares/auth.middleware";
import multer from "multer";

const userRouter = Router();
const userController = new UserController();
const upload = multer();

userRouter.get("/ping", userController.checkHealth.bind(userController));
userRouter.post("/register",upload.array("avatar"),userController.registerUser.bind(userController));
userRouter.post("/login", userController.loginUser.bind(userController));
userRouter.post("/logout", isAuthenticated, userController.logoutUser.bind(userController));
userRouter.post("/refresh-token", userController.refreshAccessToken.bind(userController));
userRouter.post("/update-password", isAuthenticated, userController.changeCurrentPassword.bind(userController));
userRouter.post("/forgot-password", userController.forgetPassword.bind(userController));
userRouter.post("/reset-password", userController.resetPassword.bind(userController));
userRouter.get("/me", isAuthenticated, userController.getMe.bind(userController));
userRouter.put("/update-profile", isAuthenticated, upload.array("avatar"), userController.updateProfile.bind(userController));
//get all users
userRouter.get("/getAllUsers", isAuthenticated, userController.getAllUsers.bind(userController));

export { userRouter };
 