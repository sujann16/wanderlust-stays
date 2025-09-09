const express = require('express');
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview,isLoggedin,isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/review.js")



//new review route
router.post("/",isLoggedin,validateReview ,wrapAsync(reviewController.createReview));

//delete review route
router.delete("/:reviewId",isLoggedin,isReviewAuthor,wrapAsync(reviewController.deleteReview));

module.exports = router;