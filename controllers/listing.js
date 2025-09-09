const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken});

module.exports.index = async (req,res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });

};

module.exports.renderNewForm  = (req,res) => {
    res.render("listings/new.ejs");
    
}

module.exports.showListing = async (req,res)=> {
    // if(!req.body.listing){
    //     throw new ExpressError(400,"send valid data for listing");
    // }
    const { id } = req.params;
    const listings =  await Listing.findById(id).populate({path:"reviews",populate:{ path: "author" }}).populate("owner");
    if (!listings) {
         req.flash("error","Listing does not exist!");
         return res.redirect("/listings");
    }
    console.log(listings);
    res.render("./listings/show.ejs", {listings}); 
}

module.exports.createListing = async (req,res,next)=> {
   let response = await geocodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 1
})
  .send()


    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url,filename);
    const newListing = new Listing(req.body.listing);
    // console.log(newListing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    newListing.geometry = response.body.features[0].geometry;
    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success","New Listing created!");
    res.redirect("/listings");
}

module.exports.editListing = async (req,res) => {
    // if(!req.body.listing){
    //     throw new ExpressError(400,"send valid data for listing");
    // }
    const { id } = req.params;
    const listings = await Listing.findById(id);
    if (!listings) {
         req.flash("error","Listing does not exist!");
         return res.redirect("/listings");
    }
    let originalUrl = listings.image.url;
    originalUrl = originalUrl.replace("/upload","/upload/w_200,e_blur:100");
    res.render("listings/edit.ejs", { listings,originalUrl });

}

module.exports.updateListing = async (req,res) => {
    // if(!req.body.listing){
    //     throw new ExpressError(400,"send valid data for listing");
    // }
    const {id} = req.params;
    console.log(req.body)
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing},{new: true});
    if(req.file)
        {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
        }
    
     req.flash("success","Listing updated!")
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async (req,res) => {
    
    
    let {id}  = req.params;
    await Listing.findByIdAndDelete(id);
     req.flash("success"," Listing deleted!")
    res.redirect("/listings");

}