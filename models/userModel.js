import mongoose from "mongoose";
import { Schema } from "mongoose";

let UserSchema = new Schema({
    username: {
        type: String,
        require: true,
        unique: true
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    password: {
        type: String,
        require: true
    },
    repositories: [
        {
            default: [],
            type: Schema.Types.ObjectId,
            ref: "Repository" //it should be given properly based on the model if this model not present it will not work
        },
    ],
    followedUsers: [
        {
            default: [],
            type: Schema.Types.ObjectId,
            ref: "User"
        },
    ],
    startRepos: [
        {
            default: [],
            type: Schema.Types.ObjectId,
            ref: "Repository"
        },
    ],
});

const User = mongoose.model("User", UserSchema);
export default User;

