    var createError = require("http-errors");
    var express = require("express");
    var path = require("path");
    var cookieParser = require("cookie-parser");
    var logger = require("morgan");
    const mongoose = require("mongoose");
    const passport = require("passport");
    // const flash = require('express-flash');
    const GoogleStrategy = require("passport-google-oauth20").Strategy;
    const githubStrategy = require("passport-github2").Strategy;
    const config = require("./config/global");

    const session = require("express-session");

    var indexRouter = require("./routes/index");
    var onewayRouter = require("./routes/oneway");
    var cartRouter = require("./routes/cart");

    var app = express();

    // view engine setup
    app.set("views", path.join(__dirname, "views"));
    app.set("view engine", "hbs");

    app.use(logger("dev"));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, "public")));
    app.use(
        session({
            secret: "s2021pr0j3ctTracker",
            resave: false,
            saveUninitialized: false,
        })
    );
    // app.use(flash());
    passport.use(
        new githubStrategy(
            {
                clientID: config.github.clientId,
                clientSecret: config.github.clientSecret,
                callbackURL: config.github.callbackUrl,
            },
            // create async callback function
            // profile is github profile
            async (accessToken, refreshToken, profile, done) => {
                // search user by ID
                const user = await User.findOne({ oauthId: profile.id });
                // user exists (returning user)
                if (user) {
                    // no need to do anything else
                    return done(null, user);
                } else {
                    // new user so register them in the db
                    const newUser = new User({
                        username: profile.username,
                        oauthId: profile.id,
                        oauthProvider: "Github",
                        created: Date.now(),
                    });
                    // add to DB
                    const savedUser = await newUser.save();
                    // return
                    return done(null, savedUser);
                }
            }
        )
    );

    passport.use(
        new GoogleStrategy(
            {
                clientID: config.google.clientId,
                clientSecret: config.google.clientSecret,
                callbackURL: config.google.callbackUrl,
            },
            async (accessToken, refreshToken, profile, done) => {
                // search user by ID
                const user = await User.findOne({ oauthId: profile.id });
                // user exists (returning user)
                if (user) {
                    // no need to do anything else
                    return done(null, user);
                } else {
                    // new user so register them in the db
                    const newUser = new User({
                        username: profile.username,
                        oauthId: profile.id,
                        oauthProvider: "Google",
                        created: Date.now(),
                    });
                    // add to DB
                    const savedUser = await newUser.save();
                    // return
                    return done(null, savedUser);
                }
            }
        )
    );

    // Initialize passport
    app.use(passport.initialize());
    app.use(passport.session());

    // Link passport to the user model
    const User = require("./models/user");
    passport.use(User.createStrategy());

    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

    app.use("/", indexRouter);
    app.use("/oneway", onewayRouter);
    app.use("/cart", cartRouter);

    // Use the connect method, and the two handlers to try to connect to the DB
    mongoose
        .connect(
            "mongodb+srv://projectTrackerWebApp:Tesla_123@cluster1.dfp2cp6.mongodb.net/",
            { useNewUrlParser: true, useUnifiedTopology: true }
        )
        .then((message) => {
            console.log("Connected successfully!");
        })
        .catch((error) => {
            console.log(`Error while connecting! ${error}`);
        });

    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
        next(createError(404));
    });

    // error handler
    app.use(function (err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get("env") === "development" ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.render("error");
    });

    passport.use(
        new GoogleStrategy(
            {
                clientID: config.google.clientId,
                clientSecret: config.google.clientSecret,
                callbackURL: config.google.callbackUrl,
                scope: ["profile", "email"]
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    const user = await User.findOne({ oauthId: profile.id });

                    if (user) {
                        return done(null, user);
                    } else {
                        const newUser = new User({
                            oauthId: profile.id,
                            oauthProvider: "Google",
                            username: profile.displayName, // Use the first email as the username
                            created: Date.now(),
                        });

                        const savedUser = await newUser.save();
                        return done(null, savedUser);
                    }
                } catch (err) {
                    return done(err, null);
                }
            }
        )
    );

    module.exports = app;
