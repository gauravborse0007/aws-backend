import express from "express";
import * as UserController  from "../controllers/userController.js" ;
const userRouter = express.Router();

userRouter.get("/allUsers", UserController.getAllUsers);
userRouter.post("/signup", UserController.signup);
userRouter.post("/login", UserController.login);
userRouter.get("/userProfile/:id", UserController.getUserProfile);  
userRouter.put("/updateProfile/:id", UserController.updateUserProfile);
userRouter.delete("/deleteProfile/:id", UserController.deleteUserProfile);

export default userRouter;