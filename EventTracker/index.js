const express = require ("express");
const mongoose = require("mongoose");
const Router = require("./routes/Routes");
const path = require("path");


const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.json());

app.use(express.static(path.resolve(__dirname, '../clien/build')));


mongoose.connect(`mongodb+srv://admin:password12345@cpq.tywils3.mongodb.net/?retryWrites=true&w=majority&appName=CPQ`,
{
    useNewUrlParser: true,
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error :"));

db.once("open", () => {
    console.log("connected succesfully");
});

app.use(Router);

app.get("/api", (req,res) => {
    res.json({ message : "Hello from event tracker"});
})

app.get("*", (req,res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
})

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
})