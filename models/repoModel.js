import mongoose from "mongoose";
import User from "./userModel.js"; 
import Issue from "./issueModel.js"
import { Schema } from "mongoose";

let RepoSchema = new Schema({
    repoName: {
        type: String,
        require: true,
        unique: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User", //it should be given properly based on the model if this model not present it will not work
        require: true,
    },
    description: {
        type: String
    },
    visibility: {
        type: Boolean,
    },
    issues: [
        {
            type: Schema.Types.ObjectId,
            ref: "Issue"
        }
    ]
});

const Repository = mongoose.model("Repository", RepoSchema);
export default Repository;