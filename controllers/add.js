import fs from "fs/promises";
import path from "path";

//here we are adding the folder name "staging"  inside  ".apnaGit" 

export async function addRepo(filePath) {  
    
    // here "filePath" is comming as a parameter from index.js
    
    
    const repoPath = path.resolve(process.cwd(), ".apnaGit");
    const stagingPath = path.join(repoPath, "staging");

    try {
        await fs.mkdir(stagingPath, { recursive: true });

        const fileName = path.basename(filePath);                           
        //jo "filePath" user ne send ki hai, usi path ke info se hum file find karenge aur use "fileName" ke variable me store karenge


        await fs.copyFile(filePath, path.join(stagingPath, fileName));      
        //user ne hame jo file provide ki "filePath" hai uska path and kaha par uski copy create karni ha uska path i.e "path.join(stagingPath, fileName)"


        console.log(`File ${fileName} is added to staging`);
        
    } catch (error) {
        console.log("Error in adding file", error);
    }
}