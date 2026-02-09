import mongoose from "mongoose";
import Issue from "../models/issueModel.js"
import Repository from "../models/repoModel.js";
import User from "../models/userModel.js";
import bodyParser from "body-parser";
const { json } = bodyParser;


export const createIssue = async (req, res) => {
    const { title, description } = req.body;
    const repositoryId = req.params.id;
    try {
        const issue = new Issue({
            title,
            description,
            repository: repositoryId,
        });

        await issue.save();

        res.status(201).json(issue);
    } catch (error) {
        console.error("Error during creating issue", error.message);
        res
            .status(500)
            .send("Server error");
    }
}

export const updateIssueById = async (req, res) => {
    const issueId = req.params.id;
    const { title, description, status } = req.body;

    try {
        const issue = await Issue.findById(issueId);

        if (!issue) {
            return res.status(404).json({ error: "Not found issue with this ID" });
        }

        issue.title = title;
        issue.description = description;
        issue.status = status;

        let updateIssue = await issue.save();

        res.status(201).json({
            message: "Issue updated Successfully",
            issue: updateIssue
        });

    } catch (error) {
        console.error("Error in fecthing the issue", error.message);
        res
            .status(500)
            .send("Server error");
    }

}

export const  deleteIssueById = async (req, res)=> {
  const { id } = req.params;

  try {
    const issue = await Issue.findByIdAndDelete(id);

    if (!issue) {
      return res.status(404).json({ error: "Issue not found!" });
    }
    res.status(200).json({ message: "Issue deleted" ,deletedIssueId: id});
  } catch (err) {
    console.error("Error during issue deletion : ", err.message);
    res.status(500).send("Server error");
  }
}



export const getAllIssues = async (req, res) => {
    const repositoryId = req.params.id;

    try {
        const issues = await Issue.find({
            repository: new mongoose.Types.ObjectId(repositoryId),
        });
        if (!issues) {
            return res.status(404).json({ error: "Not found issue with this ID" })
        }
        res.status(200).json(issues);
    } catch (error) {
        console.error("Error in fecthing the issue", error.message);
        res
            .status(500)
            .send("Server error");
    }
}

export const getIssuesById = async (req, res) => {
    const issueId = req.params.id;
    try {
        const issue = await Issue.findById(issueId);

        if (!issue) {
            return res.status(404).json({ error: "Not found issue with this ID" })
        }

        res.status(200).json(issue);

    } catch (error) {
        console.error("Error in fecthing the issue", error.message);
        res
            .status(500)
            .send("Server error");
    }
}