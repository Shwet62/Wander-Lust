const mongoose=require("mongoose")
let sampleListings=require("./data.js");
const Listing=require("../models/listing.js")


const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
mongoose.connect(MONGO_URL)
.then((res)=>{
    console.log("Connected to Db")
})
.catch((err)=>{
    console.log(err);
})

const initDB=async ()=>{
    await Listing.deleteMany({});
    // await Listing.insertMany(sampleListings);

    sampleListings=sampleListings.map((obj)=>{
        return {...obj,owner:"676862e9309443bf5ef8d169"}
    })
    await Listing.insertMany(sampleListings);
    console.log("data was initialized");
}

initDB();