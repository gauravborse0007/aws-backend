import express from "express";
const repoRouter = express.Router();

import * as repoController from "../controllers/repoController.js";

repoRouter.post("/repo/create", repoController.createRepository);//done in repo >> create.jsx
repoRouter.get("/repo/all", repoController.getAllRepositories); //done in Dashboard.jsx
repoRouter.get("/repo/:id", repoController.fetchRepositoryById);//done in RepoDetail.jsx
repoRouter.get("/repo/name/:name", repoController.fetchRepositoryByName);
repoRouter.get("/repo/user/:userID", repoController.fetchRepositoriesForCurrentUser);//done in both Dashboard.jsx & Profile.jsx
repoRouter.put("/repo/update/:id", repoController.updateRepositoryById);
repoRouter.patch("/repo/toggle/:id", repoController.toggleVisibilityId);
repoRouter.delete("/repo/delete/:id", repoController.deleteRepositoryById); //done in Profile.jsx

export default repoRouter;