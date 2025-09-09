const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");

module.exports.createReview = async(req,res)=>{
   let listings = await Listing.findById(req.params.id);
   let newReview = new Review(req.body.review);
   newReview.author = req.user._id;

   listings.reviews.push(newReview);
console.log(newReview);
   await newReview.save();
   await listings.save();

   console.log("new review saved");
    req.flash("success","New review added!")
   res.redirect(`/listings/${listings._id}`);
}

module.exports.deleteReview = async(req,res)=> {
    let {id,reviewId} = req.params;

    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Listing.findByIdAndDelete(reviewId);
     req.flash("success"," reveiew deleted!")

    res.redirect(`/listings/${id}`);
}