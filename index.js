if(process.env.NODE_ENV !="production"){
  require('dotenv').config()
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const esjMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require('express-session')
const MongoStore = require('connect-mongo');
const flash=require("connect-flash")
const passport=require("passport")
const LocalStrategy=require("passport-local")
const User=require("./models/user.js");
const listingRouter=require("./routes/listing.js")
const reviewsRouter=require("./routes/review.js")
const userRouter=require("./routes/user.js")


app.listen(8080, () => {
  console.log("server is listening to port 8080");
});


const dbUrl=process.env.ATLASDB_URL
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(dbUrl);
}



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use("/static", express.static(path.join(__dirname, "public")));
app.engine("ejs", esjMate);



const store=MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24*3600,
})

store.on("error",(err)=>{
  console.log("Error in MONGO SESSION STORE",err);
})

const sessionOption={
  store:store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires:Date.now() + 7*24*60*60*1000,
    maxAge: 7*24*60*60*1000,
    httpOnly:true
  }
}


app.use(session(sessionOption))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Middle ware for Flash Message
app.use((req,res,next)=>{
  res.locals.success=req.flash("success")
  res.locals.error=req.flash("error")
  // console.log(req.user)
  res.locals.currUser= req.user || null;
  next();
})


//Routing
app.use("/listings",listingRouter)
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter)


app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"Page Not Found"))
})


//Custom Error Handler
app.use((err, req, res, next) => {
  let {statusCode=500,message="Something Went Wrong!"}=err;
  res.status(statusCode).render("error.ejs",{message});
});
