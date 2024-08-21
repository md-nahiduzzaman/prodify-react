const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const {
  MongoClient,
  ServerApiVersion,
  Timestamp,
  ObjectId,
} = require("mongodb");

// config
require("dotenv").config();
const app = express();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const port = process.env.PORT || 5000;

// middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://prodify-react.firebaseapp.com",
      "https://prodify-react.web.app",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// verify jwt token middleware
const verifyToken = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).send({ message: "Unauthorized Access" });
  if (token) {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        console.log(err);
        return res.status(401).send({ message: "Unauthorized Access" });
      }
      console.log(decoded);
      req.user = decoded;
      next();
    });
  }
};

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.w5tdn25.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // collections
    const usersCollection = client.db("prodify").collection("users");
    const productsCollection = client.db("prodify").collection("products");

    // jwt generator
    app.post("/jwt", async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "365d",
      });
      res
        .cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        })
        .send({ success: true });
    });

    // clear jwt token on logout
    app.get("/logout", async (req, res) => {
      res
        .clearCookie("token", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
          maxAge: 0,
        })
        .send({ success: true });
    });

    // save a user data in db
    app.put("/user", async (req, res) => {
      const user = req.body;
      const query = { email: user?.email };

      // if user already in db
      const isExist = await usersCollection.findOne(query);
      if (isExist) {
        return res.send(isExist);
      }

      //

      // save user for the first time
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          ...user,
        },
      };
      const result = await usersCollection.updateOne(query, updateDoc, options);
      res.send(result);
    });

    // save block user
    app.put("/block-user", async (req, res) => {
      const email = req.body;
      console.log(email);

      const result = await blocksCollection.insertOne(email);
      res.send(result);
    });

    // get block user
    app.get("/block-user/:email", async (req, res) => {
      const email = req.params.email;
      console.log(email);

      const result = await blocksCollection.findOne({ email });
      res.send(result);
    });

    // get single user details
    app.get("/users-details/:email", async (req, res) => {
      const email = req.params.email;
      // console.log(email);
      const result = await usersCollection.findOne({ email });
      res.send(result);
    });

    // get single user
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      // console.log(email);
      const result = await usersCollection.findOne({ email });
      res.send(result);
    });

    // update single user details
    app.put("/update-details/:id", async (req, res) => {
      const id = req.params.id;
      const user = req.body;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          ...user,
        },
      };
      const result = await usersCollection.updateOne(query, updateDoc, options);
      res.send(result);
    });

    // get all users data by email from db
    app.get("/users-details/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await usersCollection.findOne(query);
      res.send(result);
    });

    // GET route to fetch all products
    app.get("/products", async (req, res) => {
      const {
        page = 1,
        limit = 8,
        search = "",
        category = "",
        brand = "",
        minPrice = 0,
        maxPrice = Infinity,
        sort = "",
      } = req.query;
      const skip = (page - 1) * limit;
      const query = {};

      if (search) {
        query.name = { $regex: search, $options: "i" };
      }

      if (category) {
        query.category = { $in: category.split(",") };
      }

      if (brand) {
        query.brand = { $in: brand.split(",") };
      }

      if (minPrice || maxPrice) {
        query.price = {
          $gte: parseFloat(minPrice),
          $lte: parseFloat(maxPrice),
        };
      }

      const sortOption =
        {
          "price-ASC": { price: 1 },
          "price-DESC": { price: -1 },
          "dateAdded-ASC": { dateAdded: 1 },
          "dateAdded-DESC": { dateAdded: -1 },
        }[sort] || {};

      try {
        const products = await client
          .db("prodify")
          .collection("products")
          .find(query)
          .sort(sortOption)
          .skip(parseInt(skip))
          .limit(parseInt(limit))
          .toArray();

        const totalProducts = await client
          .db("prodify")
          .collection("products")
          .countDocuments(query);

        res.json({
          products,
          totalPages: Math.ceil(totalProducts / limit),
        });
      } catch (error) {
        res.status(500).json({ message: "Error fetching products" });
      }
    });

    // Pagination
    app.get("/products", async (req, res) => {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const skip = (page - 1) * limit;

      try {
        const productsCollection = client.db("prodify").collection("products");
        const totalProducts = await productsCollection.countDocuments();
        const products = await productsCollection
          .find({})
          .skip(skip)
          .limit(limit)
          .toArray();

        res.json({
          totalProducts,
          totalPages: Math.ceil(totalProducts / limit),
          currentPage: page,
          products,
        });
      } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// test
app.get("/", (req, res) => {
  res.send("Prodify server is Running");
});

app.listen(port, () => {
  console.log(`server is running on port: ${port}`);
});
