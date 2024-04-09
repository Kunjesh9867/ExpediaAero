var express = require("express");
var router = express.Router();

const Cart = require("../models/cart");

const Oneway = require("../models/oneway");

var mongoose = require("mongoose");

function IsLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        req.userId = req.user._id;
        console.log(req.userId);
        return next();
    }
    res.redirect("/login");
}

router.get("/", IsLoggedIn, (req, res, next) => {
    Cart.find()
        .then((data) => {
            res.render("cartflight/index", {
                title: "Express",
                dataset: data,
                user: req.user,
            });
            console.log("No ERROR");
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Cart Find Error");
        });
});

router.get("/add/:_id", (req, res, next) => {
    const { _id } = req.params; // Assuming _id is a string

    console.log(_id);
    // Assuming the _id is a MongoDB ObjectId (common in MongoDB)
    const objectId = new mongoose.Types.ObjectId(_id); // Make sure to require mongoose at the top

    // Fetch the document from the database using the ObjectId
    Oneway.findById(objectId)
        .then((cart) => {
            if (!cart) {
                // Handle if the document with the given _id is not found
                return res.status(404).send("Cart not found");
            }

            // Accessing properties and storing them in variables
            const time = cart.time;
            const nonstop = cart.nonstop;
            const price = cart.price;
            const city = cart.city;
            const date = cart.date;
            const flight = cart.flight;

            // Now, you can use these variables as needed
            console.log("time:", time);
            console.log("nonstop:", nonstop);
            console.log("price:", price);
            console.log("city:", city);
            console.log("date:", date);
            console.log("flight:", flight);

            // Use these variables to create a new Cart instance or perform any other actions
            Cart.create({
                time: time,
                nonstop: nonstop,
                price: price,
                city: city,
                date: date,
                flight: flight,
            })
                .then((newCart) => {
                    console.log("done");
                    res.redirect("/Cart");
                })
                .catch((err) => {
                    console.log(err);
                    res.status(500).send("Internal Server Error");
                });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Internal Server Error");
        });
});

//? DELETE
router.get("/delete/:_id", (req, res, next) => {
    const itemId = req.params._id;
    console.log("Deleting item with ID:", itemId);

    Cart.deleteOne({ _id: itemId })
        .exec()
        .then(() => {
            console.log("Item deleted successfully");
            res.redirect("/");
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Internal Server Error");
        });
});

router.get("/edit/:_id", IsLoggedIn, (req, res, next) => {
    // Find the Project by ID
    // Find available courses
    // Pass them to the view
    Cart.findById(req.params._id, (err, project) => {
        if (err) {
            console.log(err);
        } else {
            Course.find((err, courses) => {
                if (err) {
                    console.log(err);
                } else {
                    res.render("projects/edit", {
                        title: "Edit a Project",
                        project: project,
                        courses: courses,
                        user: req.user,
                    });
                }
            }).sort({ name: 1 });
        }
    });
});

router.post("/edit/:_id", IsLoggedIn, (req, res, next) => {
    // find project based on ID
    // try updating with form values
    // redirect to /Projects
    Project.findOneAndUpdate(
        { _id: req.params._id },
        {
            name: req.body.name,
            dueDate: req.body.dueDate,
            course: req.body.course,
            status: req.body.status,
        },
        (err, updatedProject) => {
            if (err) {
                console.log(err);
            } else {
                res.redirect("/projects");
            }
        }
    );
});
module.exports = router;
