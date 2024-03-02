const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const { error } = require("console");

const app = express();
dotenv.config();
const port=3000;

const username=process.env.MONGODB_USERNAME;
const password=process.env.MONGODB_PASSWORD;

mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.nx55ezx.mongodb.net/newsignDB`, {
    useNewUrlParser:true,
    useUnifiedTopology:true,
});

// schema
const signupSchema = new mongoose.Schema({
    name: "string",
    age: "number",
    email: "string",
    qualification: "string",
    number: "number"
});

//model for schema

const signup = mongoose.model("signup",signupSchema)

app.use(bodyParser.urlencoded({ extended:true }));
app.use(bodyParser.json());



app.get("/",(req,res) => {
    res.sendFile(__dirname+"/pages/index.html")
})

app.post("/submit", async (req,res) => {
    try{
        const {name,age,email,qualification,number} = req.body

        // checking if user already exits
        const existinguser = await signup.findOne({email : email});
        if(!existinguser)
        {
            const signupData = new signup({
                name,
                age,
                email,
                qualification,
                number
            })
            await signupData.save();
            res.redirect("/success");
        }
        else
        {
            console.log("user already exists!");
            res.redirect("/error")
        }
    }
    catch
    {
        console.log(error);
        res.redirect("/error");
    }
})

app.get("/success",(req,res)=>{
    res.sendFile(__dirname+"/pages/success.html");
});

app.get("/error",(req,res)=>{
    res.sendFile(__dirname+"/pages/error.html");
});

app.listen(port,()=>{
    console.log(`listening on port ${port}`);
})
  