import express from 'express';
import axios from 'axios';
import mongoose from 'mongoose';
import {Coins} from './models/CoinModel.js';
import cors from "cors";
const app = express();
const port = 3000;



mongoose.connect("mongodb+srv://bhargavhulk:<password>@cluster0.vzqjstr.mongodb.net/",{
    dbName:"crypto-quadB"
}).then((s)=>console.log("Database connected"))
  .catch((e)=>console.log(e))


//middleware
app.use(cors());

//for database purpose
app.get('/setData', async (req, res) => {
  try {
    await Coins.deleteMany({});
    const response = await axios.get('https://api.wazirx.com/api/v2/tickers');
    const data = Object.values(response.data);
    const result =await Coins.create(data.slice(0, 10));
    console.log(result);
    res.json({success:true,message:'Data fetched and added to DB successfully'});
  } catch (error) {
    console.error(error);
    res.status(500).json({success:false,message:error.message});
  }
});

//for frontend purpose
app.get('/getData', async (req, res) => {
    try {
        const coins = await Coins.find({});
      res.json({success: true, data: coins});
    } catch (error) {
      console.error(error);
      res.status(500).json({success: false, message: 'Error occurred while fetching data from DB'});
    }
  });

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
