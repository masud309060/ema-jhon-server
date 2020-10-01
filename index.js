const express = require('express')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
const bodyParser = require('body-parser')
const cors = require('cors')

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rrq7z.mongodb.net/ema-jhon-collection?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express()
app.use(bodyParser.json())
app.use(cors())


client.connect(err => {
  const productsCollection = client.db("ema-jhon-collection").collection("products");
  const ordersCollection = client.db("ema-jhon-collection").collection("orders");

  app.post('/addProducts',(req, res) => {
      const product = req.body
      productsCollection.insertMany(product)
      .then(result => {
          res.send(result.insertedCount)
      })
  })

  
  app.get('/products', (req, res) => {
      productsCollection.find({})
      .toArray( (err, documents) => {
          res.send(documents)
      })
  })

  app.get('/product/:key', (req, res) => {
      productsCollection.find({key: req.params.key})
      .toArray( (err, documents) => {
          res.send(documents[0])
      })
  })

  app.post('/productsByKeys', (req, res) => {
      const productKeys = req.body
      productsCollection.find({key: {
          $in : productKeys
      }})
      .toArray((err, documents) => {
          res.send(documents)
      })
  })

  app.post('/addOrder',(req, res) => {
    const order = req.body
    ordersCollection.insertOne(order)
    .then(result => {
        res.send(result.insertedCount > 0)
    })
})
  
});



app.listen(5000)