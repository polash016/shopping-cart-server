const express = require('express');
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Shopping Cart Server Running');
})


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bioniru.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const productCollection = client.db("todoDB").collection("shopping-cart");
    const cartCollection = client.db("todoDB").collection("cart");
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    app.get('/products', async(req, res) => {
        const result = await productCollection.find().toArray();
        res.send(result);
    })
    app.get('/cart/:email', async(req, res) => {
      const email = req.params.email;
        const result = await cartCollection.find({ email: email }).toArray();
        res.send(result);
    })
    app.post('/cart', async(req, res) => {
      const product = req.body;
      const result = await cartCollection.insertOne(product);
      res.send(result);
    })
    app.delete('/cart/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    })

  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, (req, res) => {
    console.log(`Server Running on Port: ${port}`)
})