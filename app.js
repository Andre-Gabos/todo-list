const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");

const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://angDB:79C6CtHKwtjs%3A56@cluster0.ppgqt.mongodb.net/todolistDB?retryWrites=true&w=majority");


const itemSchema = new mongoose.Schema({
    name: String
});

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
    name: "Welcome to our ToDo List!"
});

const item2 = new Item({
    name: "Hit the + button to add a new item"
});

const item3 = new Item({
    name: "<- Hit this to delete an item"
});

const defaultItems = [item1, item2, item3];

const listSchema = new mongoose.Schema({
    name: String,
    items: [itemSchema]
});

const List = mongoose.model("List", listSchema)

app.get("/", (req, res) => {

    //let day = getDate();

    Item.find({}, function(err, foundItems) {

        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, function(err) {
                if (err) {
                    console.log(err)
                } else {
                    console.log("Item added succesfully")
                }
            res.redirect("/");
            });
        } else {
            res.render("list", {
                listTitle: "Today",
                newItems: foundItems
            });
        };
    });
});

app.get("/:urlListName", (req, res) => {
    const userListName = req.params.urlListName;

    List.findOne({name: userListName}, (err, foundList) => {
        if (!err) {
            if (!foundList) {
                const list = new List({
                    name: userListName,
                    items: defaultItems
                });
                list.save();
                res.redirect("/" + userListName);
            } else {
                res.render("list", {
                    listTitle: foundList.name, 
                    newItems: foundList.items
                });
            }
        }
    });
});

app.post("/", (req, res) => {
    
    let itemName = req.body.newItem;
    let listName = req.body.list.replace(" ", "");

    const item = new Item ({
        name: itemName
    });

    if (listName === "Today") {
        item.save();
        res.redirect("/");
    } else {
        List.findOne({ name: listName }, (err, foundList) => {
            
            foundList.items.push(item);
            foundList.save(() => {
                res.redirect("/" + listName);
            });
        });
    }  
});

app.post("/delete", (req, res) => {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === "Today") {
        Item.findByIdAndRemove(checkedItemId, function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log("Item " + checkedItemId + " removed from the list");
                res.redirect("/");
            }
        });
    } else {
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, (err, foundList) => {
            if (!err) {
                res.redirect("/" + listName);
            }
        });
    }  
});

app.get("/about", (req, res) => {
    res.render("about");
})

app.listen(3000, () => {
    console.log("Running on port 3000")
});