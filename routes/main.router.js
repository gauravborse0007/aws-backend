import express from "express";
const mainRouter = express.Router();
import userRouter from "./user.router.js"
import repoRouter from "./repo.router.js";
import issueRouter from "./issue.router.js";

mainRouter.use(userRouter);
mainRouter.use(repoRouter);
mainRouter.use(issueRouter);

mainRouter.get("/", (req, res) => {
    res.send("server is woking")
});
 

export default mainRouter;