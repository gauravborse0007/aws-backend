// aws connection
import AWS from "aws-sdk";
import dotenv from "dotenv";
dotenv.config();

AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

export const s3 = new AWS.S3();
export const S3_BUCKET = "gauravsamplebucket";








// {
//     "Version":"2012-10-17",
//     "Statement":[
//         {
//             "Effect":"Allow",
//             "Principal":{
//                 "AWS":"arn:aws:iam::631124976692:user/Gaurav"
//             },
//             "Action":"s3:*",
//             "Resource":[
//                 "arn:aws:s3:::gauravsamplebucket",
//                 "arn:aws:s3:::gauravsamplebucket/*"
//             ]
//         }
//     ]
// }