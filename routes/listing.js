const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {validateListing} = require("../middleware.js")
const Listing = require("../models/listing.js");
const {isLoggedin} = require("../middleware.js");
const {isOwner} = require("../middleware.js");
const listingController = require("../controllers/listing.js")
const multer = require("multer");
const {storage} = require("../cloudConfig.js")
const upload = multer({storage});

router.route("/")
//index route
.get(wrapAsync(listingController.index))
//creaye route
.post(isLoggedin,validateListing,upload.single('listing[image][url]'),wrapAsync(listingController.createListing));


router.get("/new", isLoggedin,listingController.renderNewForm);


router.route("/:id")

//show route
.get(wrapAsync(listingController.showListing))
//updatnew Route
.put(isLoggedin,isOwner,upload.single('listing[image][url]'),validateListing,wrapAsync(listingController.updateListing))
//delete route
.delete(isLoggedin,isOwner,wrapAsync(listingController.deleteListing));    


//edit route
router.get("/:id/edit",isLoggedin,isOwner,wrapAsync(listingController.editListing));





  
module.exports = router;