const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/product")
.then(()=>{console.log("Mongodb Connected")})
.catch((err)=>console.log(err.msg));

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    instock:{
        type:Boolean,
        required:true
    }
})

const Product = mongoose.model("Product" , productSchema);

app.post("/products" , async(req,res)=>{
    try{
        const product = await Product.create(req.body);
        res.json(product);
    }
    catch(err){
        res.json({error:err.message});
    }
})

app.get("/products",async(req,res)=>{
    try{
        const products = await Product.find();
        res.json(products);
    }
    catch(err){
        res.json({error:err.message});
    }
});
app.get("/products/:id" , async(req,res)=>{
    try{
        const fetchone = await Product.findById(req.params.id);
        
        if(!fetchone){
            return res.json({message:"Product Not Found"});
        }
        res.json(fetchone);
    }
    catch(err){
        res.json({error:err.message});
    }
})


app.put("/products/:id" , async(req,res)=>{
    try{
        const productUpdate = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        );
        if(!productUpdate){
           return res.json({message:"Product Not Found"});
        }
        res.json(productUpdate);
    }
    catch(error){
        res.json({error:error.message});
    }
});

app.delete("/products/:id" , async(req,res)=>{
    try{
        const productdelete = await Product.findByIdAndDelete(req.params.id);
        if(!productdelete){
            res.json({mesage:"Product Not Found"});
        }
        res.json({message:"Product Deleted"});
    }
    catch(err){
        res.json({error:err.message});
    }
})

const port = 3000;

app.listen(port , ()=>{
    console.log(`Server is running on port${port}`);
})