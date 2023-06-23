const mongoose=require('mongoose');
const url='mongodb+srv://satyamkrsatyam1:Satyam123@cluster0.47l6uhd.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(url).then(
    ()=>{console.log("Database Connected")}
).catch((error)=>{
    console.log("Error in Database Connection",error);
});




