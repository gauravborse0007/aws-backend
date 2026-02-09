import mongoose, { SchemaType } from "mongoose";
import { Schema } from "mongoose";

let IssueSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["open", "close"],
        default: "open"
    },
    repository: {
        type: Schema.Types.ObjectId,
        ref: "Repository",
        required: true
    }
});

const Issue = mongoose.model("Issue", IssueSchema);
export default Issue;