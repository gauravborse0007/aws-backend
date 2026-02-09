// for reverting the file back from commits folder to our backend folder 

import fs from "fs";
import path from "path";
import { promisify } from "util";

const readdir = promisify(fs.readdir);
const copyFile = promisify(fs.copyFile);

export async function revertRepo(commitID){
    const repoPath = path.resolve(process.cwd(), ".apnaGit");
    const commitPath = path.join(repoPath, "commits");

    try {
        const commitDir = path.join(commitPath, commitID);
        const files = await readdir(commitDir);
        const parentDir = path.resolve(repoPath, "..");

        for (const file of files){
            await copyFile(path.join(commitDir, file), path.join(parentDir,file));
        }
        console.log(`commit ${commitID} reverted successfully`);
    } catch (error) {
        console.log("error in reverting the file", error);
    }
}