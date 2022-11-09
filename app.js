//jshint esversion:6
//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
// const _ = require("lodash");
const mongoose = require('mongoose');
var encrypt = require('mongoose-encryption');
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));


const userSchma = new mongoose.Schema({
  email: String,
  password: String
});

const secret = process.env.SECRET

userSchma.plugin(encrypt, {secret: secret, encryptedFeilds: ['password']});

const User = mongoose.model("User", userSchma);

mongoose.connect('mongodb://localhost:27017/User', {useNewUrlParser: true});

app.get("/", function(req, res){
  res.render("home")
});

app.get("/login", function(req, res){
  res.render("login")
});

app.get("/register", function(req, res){
  res.render("register")

});

app.post("/register", function(req, res){
  const newUser = new User({
    email:req.body.username,
    password:req.body.password
  });
  newUser.save(function(err){
    if(!err){
      User.find(function(err, foundUser){
        if(err){
          console.log(err);
        }else{
          console.log(foundUser);
          res.render("secrets")
        }
      })
      // res.render("secrets")
    }else{
      console.log(err);
    }
  })
});

app.post("/login", function(req, res){
  const userName = req.body.username
  const password = req.body.password
  User.findOne({username: userName}, function(err, foundUser){
    console.log("Found");
    // const joe = foundUser.decrypt
    if(err){
      console.log(err);
    }else{
      if(foundUser){
        if(foundUser.password === password){
          res.render("secrets")
        };
      };
    };
  });
});
// const articalSchma = {
//   title: String,
//   content: String
// };
//
// const Artical = mongoose.model("Article", articalSchma);
//
//
// app.route("/articals").get(function(req, res){
//   Artical.find(function(err, articalFound){
//     if(!err){
//       res.send(articalFound)
//     }else{
//       res.send(err)
//     }
//   })
// })
//
//
// .post(function(req, res){
//   const newArtical = new Artical({
//     title:req.body.title,
//     content:req.body.content
//   });
//   newArtical.save(function(err){
//     if(!err){
//       res.send("Success")
//     }else{
//       res.send(err)
//     };
//   });
// })
//
// .delete(function(req, res){
//   Artical.deleteMany(function(err){
//     if(!err){
//       res.send("Deleted Succesfully")
//     }else{
//       res.send(err)
//     }
//   })
// })
//
//
//
// app.route("/articals/:articalTitle").get(function(req, res){
//   Artical.findOne({title: req.params.articalTitle}, function(err, foundArtical){
//     if(foundArtical){
//       res.send(foundArtical)
//     }else{
//       res.send("No such Artical")
//     }
//   })
// })
//
// .put(function(req, res){
//   Artical.findOneAndUpdate(
//     {title: req.params.articalTitle},
//     {title: req.body.title, content: req.body.content},
//     {overwrite:true},
//     function(err){
//       if(!err){
//         res.send("Artical updated succesfully")
//       }else{
//         res.send(err)
//       }
//     }
//   )
// })
//
// .patch(function(req, res){
//   Artical.findOneAndUpdate(
//     {title: req.params.articalTitle},
//     {$set: req.body},
//     function(err){
//       if(!err){
//         res.send("Patched succesfully")
//       }else{
//         res.send(err)
//       }
//     }
//   )
// })
//
// .delete(function(req, res){
//   Artical.deleteOne(
//     {title: req.params.articalTitle},
//     function(err){
//       if(!err){
//         res.send("Deleted this one artical succesfully")
//       }else{
//         res.send(err)
//       }
//     }
//   )
// })
// app.get("/articals", function(req, res){
//   Artical.find(function(err, articalFound){
//     if(!err){
//       res.send(articalFound)
//     }else{
//       res.send(err)
//     }
//   })
// })
//
// app.post("/articals",function(req, res){
//   const newArtical = new Artical({
//     title:req.body.title,
//     content:req.body.content
//   });
//   newArtical.save(function(err){
//     if(!err){
//       res.send("Success")
//     }else{
//       res.send(err)
//     };
//   });
// });
//
//
// app.delete("/articals", function(req, res){
//   Artical.deleteMany(function(err){
//     if(!err){
//       res.send("Deleted Succesfully")
//     }else{
//       res.send(err)
//     }
//   })
// })




app.listen(3000, function() {
  console.log("Server started on port 3000");
});
