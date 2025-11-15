const express = require('express')
const cors = require('cors')
const app = express()
require('dotenv').config()
const PORT = process.env.PORT || 3000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')

console.log(process.env.DB_USER)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ni4acz4.mongodb.net/?appName=Cluster0`
// const uri = "mongodb+srv://<db_username>:<db_password>@cluster0.ni4acz4.mongodb.net/?appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect()
    const coffeesCollection = client.db('CoffeeDB').collection('coffees')
    const burgerCollection = client.db('CoffeeDB').collection('burger')

    app.get('/coffees', async (req, res) => {
      const result = await coffeesCollection.find().toArray()
      res.send(result)
    })
    app.get('/burger', async (req, res) => {
      const result = await burgerCollection.find().toArray()
      res.send(result)
    })
    app.post('/coffees', async (req, res) => {
      const newcoffee = req.body
      const result = await coffeesCollection.insertOne(newcoffee)
      res.send(result)
      console.log(newcoffee)
    })
    app.get('/coffees/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await coffeesCollection.findOne(query)
      res.send(result)
    })
    app.put('/coffees/:id', async (req, res) => {
      const id = req.params.id
      const updatedCoffee = req.body
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true }

      const updatedDoc = {
        $set: {
          name: updatedCoffee.name,
          quantity: updatedCoffee.quantity,
          taste: updatedCoffee.taste,
          Prise: updatedCoffee.Prise,
          details: updatedCoffee.details,
          supplier: updatedCoffee.supplier,
          photo: updatedCoffee.photo,
        },
      }

      const result = await coffeesCollection.updateOne(
        filter,
        updatedDoc,
        options
      )
      res.send(result)
    })
    app.delete('/coffees/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await coffeesCollection.deleteOne(query)

      res.status(200).send({ message: 'Coffee deleted successfully', result })
    })
    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 })
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    )
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close()
  }
}
run().catch(console.dir)

// Middleware
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Coffee Store Server is running')
})

app.listen(PORT, () => {
  console.log(`Coffee Server is running ${PORT}`)
})
