const User = require("../models/user.js");
const session = require("express-session");
module.exports.getSignUp = (req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.postSignup = async(req,res,next)=>{
    try{
    let {username,email,password} = req.body;
    const newUser = new User({email, username});
    console.log(newUser);
    const registerdUser = await User.register(newUser,password);
    console.log(registerdUser);
    req.login(registerdUser,(err)=>{
        if(err){
            return next(err);
        }
    const redirectUrl = res.locals.redirectUrl || "/listings";
     req.flash("success","welcome to wonderLust");
    res.redirect(redirectUrl);

    })
   
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}

module.exports.getLogin = (req,res)=>{
    res.render("users/login.ejs");
}

module.exports.postLogin = async(req,res)=>{
    req.flash("success","welcome back to wonderlust");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings");
    })
}