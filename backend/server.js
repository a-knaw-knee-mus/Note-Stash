const mongoose = require("mongoose")
const express, {query} = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
const session = require("express-session")
const passport = require("passport")
const GoogleStrategy = require("passport-google-oauth20").Strategy

dotenv.config()

const app = express()

mongoose.connect(`${process.env.START_MONGODB}${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}${process.env.END_MONGODB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
    console.log("Connected to Mongoose")
})

const userSchema = new mongoose.Schema({
    googleId: String,
    username: String,
    profilePic: String,
    userNotes: [{
        title: String,
        content: String
    }]
})

const User = mongoose.model("User", userSchema);

//Middleware
const config = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
    }
}

app.use(express.json());
app.use(cors({origin: "https://note-stash.netlify.app", credentials: true}))
app.set("trust proxy", 1)
app.use(
    session({
        secret: "secretcode",
        resave: true,
        saveUninitialized: true,
        cookie: {
          sameSite: "none",
          secure: true,
          maxAge: 1000 * 60 * 60 * 24 * 7 // One Week
        }
    })
)
app.use(passport.initialize())
app.use(passport.session())
passport.serializeUser((user, done) => {
    return done(null, user._id);
})
passport.deserializeUser((id, done) => {
    User.findById(id, (err, doc) => {
        if (!err) {
            return done(null, doc);
        }
    })
})

passport.use(new GoogleStrategy({
    clientID: `${process.env.GOOGLE_CLIENT_ID}`,
    clientSecret: `${process.env.GOOGLE_CLIENT_PASSWORD}`,
    callbackURL: "/auth/google/callback"
},
    function(accessToken, refreshToken, profile, cb){
        console.log(profile.id)
        User.findOne({googleId: profile.id}, async (err, doc) => {
            if (err) {
                return cb(err, null);
            }

            if (!doc) {
                const newUser = new User({
                    googleId: profile.id,
                    username: profile.name.givenName,
                    profilePic: profile.photos[0].value,
                    userNote: [{title: "", content: ""}]
                })

                await newUser.save()
                cb(null, newUser)
            }
            cb(null, doc);
        })

        
    }    
))

app.get("/auth/google", 
    passport.authenticate("google", {scope: ['profile']})
)

app.get("/auth/google/callback",
    passport.authenticate("google", {failureRedirect: "https://note-stash.netlify.app", session: true}),
    (req, res) => {
        res.redirect('https://note-stash.netlify.app')
    })

app.get("/getUser", (req, res) => {
    res.send(req.user)
})

app.get("/addNote", (req, res) => {
    User.findOne({googleId: req.query.id}, (err, user) => {
        if (!err) {
            if(user) {
                user.userNotes.push({"title": req.query.title, "content": req.query.content})
                user.save()
            }          
        } else {
            console.log(err)
        }
    })
})

app.get("/retrieveNotes", (req, res) => {
    User.findOne({googleId: req.query.id}, (err, user) => {
        res.send(user.userNotes)
    })
})

app.get("/deleteNote", (req, res) => {
    const userId = req.query.userId
    const noteId = req.query.noteId
    User.updateOne({googleId: userId}, {$pull: {userNotes: {_id: noteId}}}, (err, note) => {
        return
    })
});
    
app.get("/auth/logout", (req, res) => {
    if (req.user) {
        req.logout()
        res.send("done")
    }
});

app.get("/", (req, res) => {
    res.send("RUNNING ON 4000")
})

app.listen(process.env.PORT || 4000, () => {
    console.log("server started")
})
