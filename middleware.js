const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const {listingSchema,reviewSchema}=require("./schema.js")
const ExpressError = require("./utils/ExpressError.js");
const wrapAsync = require("./utils/wrapAsync");



//Middle Ware for validation of listing schema in express file
module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
      let errMsg=error.details.map((el)=>{
        return el.message;
      }).join(",");
      throw new ExpressError(400,errMsg)
    }
    else{
      next();
    }
  }

  //Middle Ware for validation of review schema in express file
  module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
      let errMsg=error.details.map((el)=>{
        return el.message;
      }).join(",");
      throw new ExpressError(400,errMsg)
    }
    else{
      next();
    }
  }



module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be logged in to create listings!")
        res.redirect("/login")
    }
    next(); 
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl
    }
    next();
}

module.exports.isOwner=wrapAsync(async (req,res,next)=>{
    let { id } = req.params;
    let listing=await Listing.findById(id);
    if(!res.locals.currUser._id.equals(listing.owner._id)){
      req.flash("error","You are not the owner of this listings")
      return res.redirect(`/listings/${id}`)
    }
    next();
})
module.exports.isReviewAuthor=wrapAsync(async (req,res,next)=>{
    let { id,reviewId } = req.params;
    let review=await Review.findById(reviewId);
    if(!res.locals.currUser._id.equals(review.author._id)){
      req.flash("error","You are not the author of this review")
      return res.redirect(`/listings/${id}`)
    }
    next();
})