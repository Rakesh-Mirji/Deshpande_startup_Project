//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

const petSchema = new mongoose.Schema({
  name:String,
  species:String,
  breed:String,
  dob:String,
  address:String
})
const Pet = mongoose.model("Pet",petSchema);


const ownerSchema = new mongoose.Schema({
  name:String,
  password:String,
  email:String,
  phone:Number,
  mypet:petSchema
})

const Owner=mongoose.model("Owner",ownerSchema);

const pet1 = new Pet({
  name: "petName",
  species:"petSpecies",
  breed:"petBreed",
  dob: 11/11/2022,
  address:"petAddress"
});

const owner=new Owner({
  name:"sample1",
  password:"qwertyuiop",
  email:"abc@gmail.com",
  phone:1234567890,
  mypet:{
    name: "petName",
    species:"petSpecies",
    breed:"petBreed",
    dob: 11/11/2022,
    address:"petAddress"
  }
});


app.get("/",function(req,res){
  Owner.find({}, function(err, foundItems){
      res.render("users", { newListItems: foundItems, ownerList: foundItems.name});
  });
});



app.post("/",function(req,res){
  const petId = req.body.newId;
  const petName = req.body.newName;
  const petSpecies = req.body.newSpecies;
  const petBreed = req.body.newBreed;
  const petDob = req.body.newDob;
  const petAddress = req.body.newAddress;



  const owner = new Owner({
    name:"John",
    email:"abcd@gmail.com",
    mypet:{
    name: petName,
    species:petSpecies,
    breed:petBreed,
    dob:petDob,
    address:petAddress
  }
  });
  owner.save()
  res.redirect("/");
});

app.post("/delete",function(req,res){
  const checkedItemId = req.body.checkbox;

  Owner.findByIdAndRemove(checkedItemId, function(err){
    if(!err){
      console.log("Successfully deleted checked item");
      res.redirect("/");
    }
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
