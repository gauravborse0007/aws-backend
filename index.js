import express from "express";
import dotenv from "dotenv";
import cors from "cors"; //overrides the security concerns 
// Frontend and backend are on different origins 
// This server allows requests from any origins. So your frontend can talk to your backend without errors.
import mongoose from "mongoose";
import bodyParser from "body-parser"; // for converting json to javascript and vice versa
import http from "http";
import {Server} from "socket.io"; //for keeping the person continuosly updated

import mainRouter from "./routes/main.router.js";

dotenv.config();

import yargs from "yargs"; //this is use for reading the lines from terminal 
import { hideBin } from "yargs/helpers"; //Ignore Node’s startup info, give yargs only what the user typed.


import { initRepo } from "./controllers/init.js";
import { addRepo } from "./controllers/add.js";
import { commitRepo } from "./controllers/commit.js";
import { pushRepo } from "./controllers/push.js";
import { pullRepo } from "./controllers/pull.js";
import { revertRepo } from "./controllers/revert.js";



yargs(hideBin(process.argv))
    .command 
        (
        "start" ,               //this is command we will give inside terminal 
        "start new server",     //description of the command.
        {},                     //if parameters then what to do with that parameters
        startServer             //to which function you have to pass the controll
        )  
    .command("init", "Initialising a repo", {}, initRepo)

    .command("add <file>", "adding file to repo",
        (yargs) => {
            yargs.positional("file", {  //This defines the positional argument named as file. It matches <file> in:"add <file>"
                describe: "Files add to staging area",
                type: "string"
            });
        },
        (argv) => {  // it reads the argument that comes with add command
            addRepo(argv.file);
        }
    )

    .command(
        "commit <message>", "commit the staged file",
        (yargs) => {
            yargs.positional("message", {
                describe: "commit message",
                type: "string"
            });
        },
        (argv) => {  // it reads the arguement that comes with add command
            commitRepo(argv.message);
        })

    .command("push", "pushing code to a repo", {}, pushRepo)

    .command("pull", "pulling repo", {}, pullRepo)
    
    .command(
        "revert <commitID>", "restoring the files",
        (yargs) => {
            yargs.positional("commitID", {
                describe: "commit ID to revert to",
                type: "string"
            });
        },
        (argv) => {  // it reads the arguement that comes with add command
            revertRepo(argv.commitID);
        })

    .demandCommand(1, "You need atleast one command")
    .help()
    .argv;

    function startServer(){
        const app = express();
        const port = process.env.PORT;

        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(express.json());

        const mongoURI = process.env.MONGO_URI;
    
        mongoose
            .connect(mongoURI)
            .then(()=>{console.log("you are connected to mongoDB")})
            .catch((err)=>{console.log(err)});
        
        app.use(cors({origin:"*"}));  // all the requests will be allowed from anywhere and security concerns will be override
        app.use("/",mainRouter);
        

        let user = "test";

        const httpServer = http.createServer(app);  // created http server based for app
        const io = new Server(httpServer,{
            cors:{
                origin:"*",
                methods:["POST","GET"],
            }
        });

        io.on("connection",(socket)=>{
            socket.on("joinRoom",(userID)=>{
                user=userID,
                console.log("=====");
                console.log(user);
                console.log("=====");
                console.log(userID);
            });
        });

        const db = mongoose.connection;
        db.once("open",async()=>{
            console.log("CRUD operation called");
        })

        httpServer.listen(port,()=>{
            console.log(`Server is running on ${port}`);
        })

    }