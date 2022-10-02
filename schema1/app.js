//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/petDB", {useNewUrlParser: true});

const petSchema = {
    name:String,
    species:String,
    breed:String,
    dob:Date,
    address:String
}
const Pet = mongoose.model("Pet",petSchema);




const ownerSchema = {
  name:String,
  password:String,
  email:String,
  phone:Number,
  mypet:petSchema
}
const Owner=mongoose.model("Owner",ownerSchema);


const owner=new Owner({
  name:"sample1",
  password:"qwertyuiop",
  email:"abc@gmail.com",
  phone:1234567890
});



const pet1 = new Pet({
    name:"Tommy",
    species:"dog",
    breed:"poodle",
    dob:20/02/2022,
    address:"Unkal,Hubli-31"
});
const pet2 = new Pet({
    name:"Tommvfy",
    species:"dog",
    breed:"povfvodle",
    dob:20/02/2022,
    address:"Unkal,Hubli-31"
});
const pet3 = new Pet({
    name:"decd",
    species:"cat",
    breed:"rff",
    dob:20/02/2022,
    address:"Unkal,Hubli-31"
});


const defaultPets = [pet1, pet2, pet3];



app.get("/", function(req, res) {

  Pet.find({}, function(err, foundItems){
    if(foundItems.length === 0){

      Pet.insertMany(defaultPets, function(err){
          if(err){
              console.log(err);
            }
            else{
                console.log("Successfully saved default items to database");
              }
      });
      res.redirect("/");
    }
    else{
      res.render("profile", { newListItems: foundItems});
    }

  });

});


app.post("/", function(req, res){

  const petId = req.body.newId;
  const petName = req.body.newName;
  const petSpecies = req.body.newSpecies;
  const petBreed = req.body.newBreed;
  const petDob = req.body.newDob;
  const petAddress = req.body.newAddress;

  const pet = new Pet({
    name: petName,
    species:petSpecies,
    breed:petBreed,
    dob:petDob,
    address:petAddress
  });
  pet.save();
  res.redirect("/");
});

app.post("/delete",function(req,res){
  const checkedItemId = req.body.checkbox;

  Pet.findByIdAndRemove(checkedItemId, function(err){
    if(!err){
      console.log("Successfully deleted checked item");
      res.redirect("/");
    }
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
