import fs from "fs/promises";
import path from "path";
import { s3, S3_BUCKET } from "../config/aws-config.js";

export async function pullRepo() {
    try {
        const repoPath = path.resolve(process.cwd(), ".apnaGit");
        const commitsPath = path.join(repoPath, "commits");

        const data = await s3.listObjectsV2({
            Bucket: S3_BUCKET,
            Prefix: "commits/",
        }).promise();

        const objects = data.Contents || [];

        for (const object of objects) {
            const key = object.Key; // commits/<commitId>/file.txt

            const commitId = key.split("/")[1];
            const commitDir = path.join(commitsPath, commitId);

            await fs.mkdir(commitDir, { recursive: true });

            const file = await s3.getObject({
                Bucket: S3_BUCKET,
                Key: key,
            }).promise();

            const fileName = path.basename(key);
            await fs.writeFile(
                path.join(commitDir, fileName),
                file.Body
            );
        }

        console.log("All commits pulled from S3.");
    } catch (err) {
        console.error("Unable to pull:", err);
    }
}
