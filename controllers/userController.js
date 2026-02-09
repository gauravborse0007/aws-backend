import jwt from "jsonwebtoken"; // It is a digital token that tells the server “this user is logged in” without asking for username and password again, only within time set like 7 days.  
import { MongoClient, ReturnDocument } from "mongodb";
import { ObjectId } from "mongodb";
import dotenv from "dotenv";
import bcrypt from "bcrypt"

// It lets your app read hidden data like passwords, API keys, or JWT secrets without writing them directly in the code.
// ------------EXAMPLE-------------

//------------- env file ------------
// PORT=3000
// JWT_SECRET=mysupersecret

// ------------ js file -------------
// import dotenv from "dotenv";
// dotenv.config();

// console.log(process.env.JWT_SECRET); // mysupersecret


dotenv.config();
const uri = process.env.MONGO_URI;

let client;

// MongoDB (npm package) →  The official MongoDB Node.js driver Talks directly to the MongoDB database Low-level control No schemas (fully flexible) You write more query logic yourself
// MongoClient → MongoClient is like a connector or bridge that allows your Node.js application to talk to MongoDB. MongoDB → Bank🏦    MongoClient → ATM card 💳
// Mongoose (npm package) →  Built on top of MongoDB driver. Uses validation Schemas & Models we had used it in creating models inside issueModel, repoModel & userModel also in index.jsfile

async function connectClient() {
    if (!client) {
        client = new MongoClient(uri, {
            useNewUrlParser: true,   //this is configuration for creating connection with client
            useUnifiedTopology: true,
        });
        await client.connect();
    }
}


export const signup = async (req, res) => {
    let { username, email, password } = req.body;
    try {
        await connectClient(); //try to connect to database
        const db = client.db("githubclone"); //this is our database, connect to this database
        const userCollection = db.collection("user"); //this is our collection - like table in sql It gets creates if not existed before.

        let user = await userCollection.findOne({ username });

        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10); //generating salt 
        const hashedPassword = await bcrypt.hash(password, salt); //hashing the password with salt  

        const newUser = {
            username,
            password: hashedPassword,
            email,
            repositories: [],
            followedUsers: [],
            startRepos: []
        };

        const result = await userCollection.insertOne(newUser);
        const userId = result.insertedId;
        const token = jwt.sign({ id: userId }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" })
        res.json({ token, userId });

    } catch (error) {
        console.log("Error in signup: ", error.message);
        res.status(500).send("server error");
    }

};

export const login = async (req, res) => {
    let { email, password } = req.body;
    try {
        await connectClient();
        const db = client.db("githubclone"); //this is our database
        const userCollection = db.collection("user"); //this is our collection
        let user = await userCollection.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid credential" });
        }

        let isMatch = await bcrypt.compare(password, user.password); //compares password given by user with password present inside database

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credential" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" })
        res.json({token, userId: user._id }); //If key name == variable name, you can write it once (token). But in userId it is not like that key name(userId) != variable name (user._id)

    } catch (error) {
        console.error("Error during login", error.message);
        res
            .status(500)
            .send("Server error");
    }
}


export const getAllUsers = async (req, res) => {
    try {
        await connectClient();
        const db = client.db("githubclone"); //this is our database
        const userCollection = db.collection("user"); //this is our collection

        let allUser = await userCollection.find({}).toArray();
        res.json(allUser);
    } catch (error) {
        console.error("Error during login", error.message);
        res
            .status(500)
            .send("Server error");
    }
};

export const getUserProfile = async (req, res) => {
    let currentId = req.params.id
    try {
        await connectClient();
        const db = client.db("githubclone"); //this is our database
        const userCollection = db.collection("user"); //this is our collection

        const user = await userCollection.findOne({
            _id: new ObjectId(currentId) //for fetching the user id from database as id is in string form in database
        });

        if (!user) {
            return res.status(404).json({ message: "No user Found!" });
        }
        res.send(user);

    } catch (error) {
        console.error("Error during login", error.message);
        res
            .status(500)
            .send("Server error");
    }
}

export const updateUserProfile = async (req, res) => {      //updating email and password of user using id  
    let currentId = req.params.id;
    let { email, password } = req.body;

    try {
        await connectClient();
        const db = client.db("githubclone"); //this is our database
        const userCollection = db.collection("user"); //this is our collection

        let updateFeild = {}

        if(email){
            updateFeild.email = email;
        }

        if (password) {
            let salt = await bcrypt.genSalt(10);
            let hashedPassword = await bcrypt.hash(password, salt);
            updateFeild.password = hashedPassword;
        }

        const result = await userCollection.findOneAndUpdate(
            { _id: new ObjectId(currentId) }, //find by this id
            { $set: updateFeild }, //and update this
            { returnDocument: "after" } //after completing the changes return the updates changes
        );

        if (!result.value) {
            return res.status(404).json({ message: "User not found" })
        }

    } catch (error) {
        console.error("Error during login", error.message);
        res.status(500).send("Server error");
    }
}

export const deleteUserProfile = async (req, res) => {
    let currentId = req.params.id;
    try {
        await connectClient();
        const db = client.db("githubclone"); //this is our database
        const userCollection = db.collection("user"); //this is our collection

        let result = userCollection.deleteOne(
            { _id: new ObjectId(currentId) }
        );

        if(result.deleteCount == 0){
            return res.status(404).json({message:"user not found"});
        }

        res.json({ message: "User deleted" });
        
    } catch (error) {
        console.error("Error during login", error.message);
        res.status(500).send("Server error");
    }
}
