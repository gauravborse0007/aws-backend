import Repository from "../models/repoModel.js";
import Issue from "../models/issueModel.js"
import User from "../models/userModel.js";
import mongoose from "mongoose";


export const createRepository = async (req, res) => {
    const { repoName, owner, description, visibility, issues } = req.body;

    try {
        if (!repoName) {
            return res.status(400).json({ error: "Repo name required" });
        }

        if (!mongoose.Types.ObjectId.isValid(owner)) {
            return res.status(400).json({ error: "Not a valid user" });
        }

        let newRepo = new Repository({
            repoName,
            owner,
            description,
            visibility,
            issues
        });

        let result = await newRepo.save();  //in mongoose we use .save() & in mongoDb Client we use insertOne()

        res.status(201).json({
            message: "Repo created",
            repoID: result._id
        });
    }
    catch (error) {
        console.error("Error during login", error.message);
        res
            .status(500)
            .send("Server error");
    }
}


// gets all the repos with the owner's info 
export const getAllRepositories = async (req, res) => {
    try {
        let repositories = await Repository.find({ visibility: true })
            .populate("owner")
            .populate("issues");
        // populate is used to get full details of any object here "owner" and "issues"    
        // in mongoose we can directly do "crud" operations on models that we are importing
        res.json(repositories);
    } catch (error) {
        console.error("Error during fetching All repositories", error.message);
        res
            .status(500)
            .send("Server error");
    }
};



//fetching repo by repo's id
// export const fetchRepositoryById = async (req, res) => { 
//     const repoId = req.params.id;
//     try {
//         let repository = await Repository.find({ _id: repoId })
//             .populate("owner")
//             .populate("issues")

//         res.json(repository);

//     } catch (error) {
//         console.error("Error in fecthing the repository ", error.message);
//         res
//             .status(500)
//             .send("Server error");
//     }
// };



export const fetchRepositoryById = async (req, res) => {
    const repoId = req.params.id;

    try {
        const repository = await Repository
            .findById(repoId)
            .populate("owner")
            .populate("issues");

        if (!repository) {
            return res.status(404).json({ error: "Repository not found" });
        }

        res.status(200).json(repository);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }
};



//fetching repo by repo's name
export const fetchRepositoryByName = async (req, res) => {
    const name = req.params.name;

    try {
        let repository = await Repository.find({ repoName: name })
            .populate("owner")
            .populate("issues");
        res.json(repository);

    } catch (error) {
        console.error("Error in fecthing the repository ", error.message);
        res
            .status(500)
            .send("Server error");
    }
};


// This 4 functionality will be access by only the owner, if owner is login
export const fetchRepositoriesForCurrentUser = async (req, res) => {
    const userId = req.params.userID;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: "Invalid or missing userId" });
    }

    try {
        let repositories = await Repository.find({ owner: userId })
            .populate("owner")
            .populate("issues");

        if (!repositories || repositories.length == 0) {
            return res.status(404).json({ error: "User repository not found" })
        }

        res.json(repositories);

    } catch (error) {
        console.error("Error in fecthing the repositories for user ", error.message);
        res
            .status(500)
            .send("Server error");
    }
};


// in this we can only update description 
export const updateRepositoryById = async (req, res) => {
    const repoId = req.params.id;
    const { description } = req.body;

    try {
        let repository = await Repository.findById({ _id: repoId });
        if (!repository) {
            return res.status(404).json({ error: "Repository not found" });
        }
        repository.description = description;

        const updatedRepository = await repository.save();

        res.json({
            message: "Repository Updated Successfully",
            repository: updatedRepository
        });
    } catch (error) {
        console.error("Error in fecthing the repositories", error.message);
        res
            .status(500)
            .send("Server error");
    }
};

export const toggleVisibilityId = async (req, res) => {
    const repoId = req.params.id;

    try {
        let repository = await Repository.findById({ _id: repoId });
        if (!repository) {
            return res.status(404).json({ error: "Repository not found" });
        }
        repository.visibility = !repository.visibility;

        const updatedRepository = await repository.save();

        res.json({
            message: "Repository toggled Successfully",
            repository: updatedRepository
        });
    } catch (error) {
        console.error("Error in toggling the repositories", error.message);
        res
            .status(500)
            .send("Server error");
    }
};

export const deleteRepositoryById = async (req, res) => {
    const repoId = req.params.id;
    try {
        let repository = await Repository.findByIdAndDelete({ _id: repoId });
        if (!repository) {
            return res.status(404).json({ error: "Repository not found" });
        }

        res.json({
            message: "Repository deleted successfully"
        })
    } catch (error) {
        console.error("Error in toggling the repositories", error.message);
        res
            .status(500)
            .send("Server error");
    }
};
