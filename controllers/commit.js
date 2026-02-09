import fs from "fs/promises";
import path from "path";
import{ v4 as uuidv4} from "uuid";

export async function commitRepo(message){
    const repoPath = path.resolve(process.cwd(),".apnaGit");
    const stagedPath = path.join(repoPath,"staging");
    const commitPath = path.join(repoPath,"commits");

    try {
        const commitID = uuidv4();//creates the unique id
        const commitDir = path.join(commitPath, commitID); //commitPath cha location ver "commitID" i.e "id" cha folder banan
        await fs.mkdir(commitDir, {recursive:true});

        //reading all the files
        const files = await fs.readdir(stagedPath);

        //coping all files from stagedPath to commitDir
        for(const file of files){
            await fs.copyFile(
                path.join(stagedPath,file), //initial path
                path.join(commitDir, file)// final path
            );
        };

        //for tracking the latest commit
        await fs.writeFile(
            path.join(commitDir, "commit.json"),
            JSON.stringify({message, date:new Date().toISOString()})
        );
        console.log(`Commit ${commitID} created with messgage: ${message}`);
    } catch (error) {
        console.log("Error in commiting the files", error);
    }
}