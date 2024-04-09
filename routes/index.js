var express = require("express");
var router = express.Router();
const passport = require("passport");

/* GET home page. */
router.get("/", function (req, res, next) {
    console.log(req.user);
    res.render("index", { title: "Express", user: req.user });
});
router.get("/features", function (req, res, next) {
    res.render("features", { title: "Express", user: req.user });
});
router.get("/about", function (req, res, next) {
    res.render("about", { title: "Express", user: req.user });
});
router.get("/payment", function (req, res, next) {
    res.render("payment", { title: "Express", user: req.user });
});

router.post("/payment", (req, res, next) => {
    if (true) {
        console.log("inn");
        res.redirect("/thank");
    } else {
        passport.authenticate("local", {
            failureRedirect: "/admin",
            failureMessage: "Invalid credentials",
        })(req, res, next);
    }
});
router.get("/thank", function (req, res, next) {
    res.render("thank", { title: "Express", user: req.user });
});

router.get("/signup", function (req, res, next) {
    res.render("signup", { title: "Sign Up Page" });
});

router.get("/signup", function (req, res, next) {
    res.render("signup", { title: "Sign Up Page" });
});

// router.get("/cart/add/:_id", (req, res, next) => {
//     Cart.create({
//         time: req.time,
//         nonstop: req.body.nonstop,
//         price: req.body.price,
//         city: req.body.city,
//         flight: req.body.flight,
//     })
//         .then((newCart) => {
//           console.log("done");
//             res.redirect("/Cart");
//         })
//         .catch((err) => {
//             console.log(err);
//             res.status(500).send("Internal Server Error");
//         });
// });

//! ---------------------------------------------------------------------------------------------
//? ADMIN
const Admin = require("../models/admin");
//? Login
// GET handler for /login
router.get("/admin", (req, res, next) => {
    // res.render('login', { title: 'Login' });
    // Obtain messages if any
    let messages = req.session.messages || [];
    // Clear messages
    req.session.messages = [];
    // Pass messages to view
    res.render("admin", {
        title: "Login",
        messages: messages,
        user: req.user,
    });
});

router.post("/admin", (req, res, next) => {
    // passport.authenticate("local", {
    //     successRedirect: "/oneway",
    //     failureRedirect: "/admin",
    //     failureMessage: "Invalid credentials",
    // })
    let email = req.body.email;
    let password = req.body.password;

    if (email === "kunjeshramani@gmail.com" && password === "Tesla_123") {
        res.redirect("/oneway/indexadmin");
    } else {
        passport.authenticate("local", {
            failureRedirect: "/admin",
            failureMessage: "Invalid credentials",
        })(req, res, next);
    }
});

router.get("/adminregister", (req, res, next) => {
    res.render("adminregister", {
        title: "Create a new account",
        user: req.user,
    });
});

router.post("/adminregister", (req, res, next) => {
    Admin.register(
        new Admin({
            username: req.body.username,
            email: req.body.email,
        }),
        req.body.password,
        (err, newAdmin) => {
            if (err) {
                console.log(err);
                // take user back and reload register page
                return res.redirect("/adminregister");
            } else {
                // log user in
                req.login(newAdmin, (err) => {
                    console.log(req.body.email);
                    console.log(req.body.password);
                    res.redirect("/");
                });
            }
        }
    );
});

//! ---------------------------------------------------------------------------------------------

const User = require("../models/user");
//? Login
// GET handler for /login
router.get("/login", (req, res, next) => {
    // res.render('login', { title: 'Login' });
    // Obtain messages if any
    let messages = req.session.messages || [];
    // Clear messages
    req.session.messages = [];
    // Pass messages to view
    res.render("login", { title: "Login", messages: messages, user: req.user });
});

router.post(
    "/login",
    passport.authenticate("local", {
        successRedirect: "/oneway",
        failureRedirect: "/login",
        failureMessage: "Invalid credentials",
    })
);

//? Register
router.get("/register", (req, res, next) => {
    res.render("register", {
        title: "Create a new account",
        errorMessage: "",
        user: req.user,
    });
});

router.post("/register", (req, res, next) => {
    User.register(
        new User({
            username: req.body.username,
        }),
        req.body.password,
        (err, newUser) => {
            if (err) {
                console.log(err);

                // take user back and reload register page
                return res.render("register", {
                    title: "Create a new account",
                    errorMessage: "Username already exists", // Custom error message
                    user: req.user,
                });
            } else {
                // log user in
                req.login(newUser, (err) => {
                    console.log(req.body.username);
                    console.log(req.body.password);
                    res.redirect("/");
                });
            }
        }
    );
});

const Cart = require("../models/cart");
//? Logout
router.get("/logout", (req, res, next) => {
    // Delete all items from the cart
    Cart.deleteMany({})
        .exec()
        .then(() => {
            // Logout the user
            req.logout(function (err) {
                if (err) {
                    console.log(err);
                    res.status(500).send("Internal Server Error");
                } else {
                    // Redirect to the login page
                    res.redirect("/login");
                }
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Internal Server Error");
        });
});

// GET handler for /github
// call passport authenticate and pass the name of the stragety
// and the information we require from github
router.get(
    "/github",
    passport.authenticate("github", { scope: ["user.email"] })
);

// GET handler for /github/callback
// this is the url they come back to after entering their credentials
router.get(
    "/github/callback",
    // callback to send user back to login if unsuccessful
    passport.authenticate("github", { failureRedirect: "/login" }),
    // callback when login is successful
    (req, res, next) => {
        res.redirect("/");
    }
);

//! Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res, next) => {
    res.redirect('/');
  });
module.exports = router;
