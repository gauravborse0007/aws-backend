import fs from "fs/promises";   // file system for creating the folders and files inside
import path from "path";        //as we want to create a folder inside current directory we will use "path" method from Node.js

export async function initRepo (){
    const repoPath = path.resolve(process.cwd(),".apnaGit");    //".apnaGit" is going to be the name of hidden folder
    const commitsPath = path.join(repoPath,"commits");          //"commits" - this is the sub folder that will create inside "apnaGit"

    try {
        await fs.mkdir(repoPath, {recursive:true});     // {recursive:true} It means if wnt to create a nested folders and files we can create inside repoPath
        await fs.mkdir(commitsPath, {recursive:true});
        await fs.writeFile(
            path.join(repoPath, "config.json"),                 //"config.json" this is the file will be created  inside ".apnaGit" 
            JSON.stringify({bucket: process.env.S3_BUCKET})     //this is for pushing our folder to aws 
        );
        console.log("Repository initialise");
    } catch (error) {
        console.log("Error in initilising repository")
    }
}

