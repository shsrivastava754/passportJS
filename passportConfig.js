const LocalStrategy = require('passport-local').Strategy;
const User = require('./users');

const initializingPassport = (passport)=>{
    passport.use(new LocalStrategy(async (username,password,done)=>{
        try {
            const user = await User.findOne({username});

            if(!user){
                return done(null,false);
            }

            if(user.password!==password){
                return done(null,false);
            }

            return done(null,user);
        } catch (error) {
            return done(error,false);
        }
    }));

    passport.serializeUser((user,done)=>{
        done(null,user.id);
    });

    passport.deserializeUser(async (id,done)=>{
        try {
            const user = await User.findById(id);
            done(null,user);
        } catch (error) {
            done(error,false);
        }
    });
};

const isAuthenticated = (req,res,next)=>{
    // req.user is a variable which is created only when logged in otherwise null
    if(req.user){
        return next();
    }
    
    // if user is not logged in 
    res.redirect("/loginUser");
};

module.exports.initializingPassport = initializingPassport;
module.exports.isAuthenticated = isAuthenticated;