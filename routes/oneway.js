var express = require("express");
var router = express.Router();

const Oneway = require("../models/oneway");

function IsLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

//? DEFAULT
router.get("/", (req, res, next) => {
    Oneway.find()
        .then((data) => {
            if (req.user == undefined) {
                const dashboard = async (req, res) => {
                    try {
                        var searchOptions = "";

                        if (req.query.search) {
                            searchOptions = req.query.search;
                        }
                        console.log(searchOptions);

                        const userData = await Oneway.find({
                            city: {
                                $regex: ".*" + searchOptions + ".*",
                                $options: "i",
                            },
                        });

                        console.log(userData);

                        res.render("oneway/index", {
                            title: "Oneway List",
                            dataset: userData, // Use userData instead of data
                            user: req.user,
                        });
                    } catch (err) {
                        console.log(err);
                        res.status(500).send("Internal Server Error");
                    }
                };
                dashboard(req, res);
            } else if (
                req.user.username == "kunjeshramani@gmail.com" &&
                req.user._id.toString() == "6572846195da9f9a1cf7aa5d"
            ){
                const dashboard = async (req, res) => {
                    try {
                        var searchOptions = "";

                        if (req.query.search) {
                            searchOptions = req.query.search;
                        }
                        console.log(searchOptions);

                        const userData = await Oneway.find({
                            city: {
                                $regex: ".*" + searchOptions + ".*",
                                $options: "i",
                            },
                        });

                        console.log(userData);

                        res.render("oneway/indexadmin", {
                            title: "Oneway List",
                            dataset: userData, // Use userData instead of data
                            user: req.user,
                        });
                    } catch (err) {
                        console.log(err);
                        res.status(500).send("Internal Server Error");
                    }
                };
                dashboard(req, res);
            } 
            else {
                const dashboard = async (req, res) => {
                    try {
                        var searchOptions = "";

                        if (req.query.search) {
                            searchOptions = req.query.search;
                        }
                        console.log(searchOptions);

                        const userData = await Oneway.find({
                            city: {
                                $regex: ".*" + searchOptions + ".*",
                                $options: "i",
                            },
                        });

                        console.log(userData);

                        res.render("oneway/indexuser", {
                            title: "Oneway List",
                            dataset: userData, // Use userData instead of data
                            user: req.user,
                        });
                    } catch (err) {
                        console.log(err);
                        res.status(500).send("Internal Server Error");
                    }
                };
                dashboard(req, res);
            }
        }).catch((err) => {
            console.log(err);
            res.status(500).send("Internal Server Error");
        });
});

//? ADD
router.get("/add", (req, res, next) => {
    res.render("oneway/add", { title: "Add a new Course", user: req.user });
});

router.post("/add", (req, res, next) => {
    Oneway.create({
        time: req.body.time,
        nonstop: req.body.nonstop,
        price: req.body.price,
        city: req.body.city,
        date: req.body.date,
        flight: req.body.flight,
    })
        .then((newOneway) => {
            res.redirect("/oneway");
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Internal Server Error");
        });
});

//? EDIT
router.get("/edit/:_id", async (req, res, next) => {
    try {
        // Find the Oneway document by ID
        const onewayDocument = await Oneway.findById(req.params._id).lean();

        if (!onewayDocument) {
            return res.status(404).send("Oneway document not found");
        }

        // Find available courses or any other necessary data
        // ...

        console.log("ssssssssssssssssss");
        // Pass the data to the view
        res.render("oneway/edit", {
            title: "Edit a Oneway Document",
            onewayDocument: onewayDocument,
            user: req.user,
            // ... (other variables you want to pass)
        });
    } catch (error) {
        console.error(error);
        next(error); // Pass the error to the next middleware
    }
});

// POST handler for Edit operations
router.post("/edit/:_id", async (req, res, next) => {
    try {
        // Find oneway document based on ID and update with form values
        const updatedOneway = await Oneway.findOneAndUpdate(
            { _id: req.params._id },
            {
                time: req.body.time,
                nonstop: req.body.nonstop,
                price: req.body.price,
                city: req.body.city,
                date: req.body.date,
                flight: req.body.flight,
            },
            { new: true } // Ensure you get the updated document in the callback
        ).lean();

        if (!updatedOneway) {
            return res.status(404).send("Oneway document not found");
        }

        // Redirect to /oneway
        res.redirect("/oneway");
    } catch (error) {
        console.error(error);
        next(error); // Pass the error to the next middleware
    }
});

//? DELETE
//? DELETE
router.get("/delete/:_id", async (req, res, next) => {
    try {
        // Use deleteOne method to delete the document
        const result = await Oneway.deleteOne({ _id: req.params._id });

        if (result.deletedCount === 0) {
            return res.status(404).send("Oneway document not found");
        }

        // Redirect to /oneway
        res.redirect("/oneway");
    } catch (error) {
        console.error(error);
        next(error); // Pass the error to the next middleware
    }
});

module.exports = router;
