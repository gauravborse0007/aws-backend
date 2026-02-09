import express from "express"
const issueRouter = express.Router();

import * as issueController from "../controllers/issueController.js"

issueRouter.post("/issue/create/:id",  issueController.createIssue); // done in issue>>CreateIssue
issueRouter.put("/updateIssue/:id",  issueController.updateIssueById); 
issueRouter.delete("/deleteIssue/:id",  issueController.deleteIssueById)
issueRouter.get("/issues/all/:id", issueController.getAllIssues); //done in RepoDetails.jsx
issueRouter.get("/issues/:id", issueController.getIssuesById);

export default issueRouter;