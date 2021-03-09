const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let items = ["Buy food", "Cook food", "Eat food"];
let workItems = [];

app.get("/", (req, res) => {

    //let day = date.getDate();

    res.render("list", {
        listTitle: "Today",
        newItems: items
    });

});

app.get("/work", (req, res) => {
    res.render("list", {
        listTitle: "Work List", 
        newItems: workItems
    });
});

app.post("/", (req, res) => {

    let item = req.body.newItem;

    if (req.body.list === "Work") {
        workItems.push(item);
        res.redirect("/work");
    } else {
        items.push(item);
        res.redirect("/");
    }
});

app.get("/about", (req, res) => {
    res.render("about");
})

app.listen(3000, () => {
    console.log("Running on port 3000")
});