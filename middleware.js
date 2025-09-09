const Listing = require("./models/listing"); 
const Review = require("./models/reviews.js"); 
const session = require("express-session");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");
const {reviewSchema} = require("./schema.js");
// const Review = require("");


module.exports.isLoggedin = (req,res,next)=>{
    req.session.redirectUrl = req.originalUrl;
     if(!req.isAuthenticated()){
        req.flash("error","Login Required ");
        return res.redirect("/login");
    }
    next();
    
};

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req,res,next) =>{
    const {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currentUser._id)){
        req.flash("error","You are not allowed to make any changes in this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    // const newlistings = new Listing(req.body.listing);
    if(error){
        let errMsg = error.details.map((el) => 
            el.message).join(",");
        throw new ExpressError(404,errMsg);
    }else{
        next();
    }
};

module.exports.validateReview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    // const newReview = new Listing(req.body.listing);
    if(error){
        let errMsg = error.details.map((el) => 
            el.message).join(",");
        throw new ExpressError(404,errMsg);
    }else{
        next();
    }
}; 

module.exports.isReviewAuthor = async (req,res,next) =>{
    const {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currentUser._id)){
        req.flash("error","You did not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};