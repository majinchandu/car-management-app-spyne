const express = require('express')
var mongoose = require('mongoose');
const app = express()
const port = process.env.PORT || 5000
app.use(express.json())
const cors = require("cors")//npm package to remove cors error
app.use(cors())//middleware to resolve cors issue
const Jwt = require('jsonwebtoken');
const { useParams } = require('react-router-dom');

// const params = useParams();

//Set up default mongoose connection
var mongoDB = 'mongodb+srv://GOFOOD:chauhan20@cluster0.vyzojrl.mongodb.net/Spyne';
mongoose.set('strictQuery', false);
mongoose.connect(mongoDB, { useNewUrlParser: true });
//Get the default connection
var db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
const jwtKey = 'Spyne'

const dotenv = require("dotenv")
const jwt = require("jsonwebtoken")
// const { useParams } = require('react-router-dom')
app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

dotenv.config();
app.use(express.urlencoded({ extended: "true" }))
const User = require('./UserScehma');
const Car = require('./CarSchema');
const { log } = require('console');

app.post('/user/generateToken', function (req, res) {
    try {
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        let data = { // data is the payload 
            time: Date(),
            userId: 123
        }
        console.log(data)
        const token = jwt.sign(data, jwtSecretKey);
        // This function creates a JWT using the data object as the payload and jwtSecretKey as the secret key. The resulting token contains the encoded data object and can be used for authentication or authorization purposes in subsequent requests.
        res.send(token + ",," + data);
    } catch (error) {
        res.send("error occured", error)
    }
});

app.post('/registerUser', async function (req, res) {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
        return res.send({ message: "Invalid input. Please provide a valid name, email, and password." });
    }

    try {
        const check = await User.findOne({ email });
        const jwtSecretKey = process.env.JWT_SECRET_KEY;

        if (!check) {
            let user = new User(req.body);
            let result = await user.save();

            // Sign JWT with essential details
            const token = jwt.sign({ email: result.email }, jwtSecretKey);

            return res.status(201).send({ result, auth: token });
        } else {
            return res.send({ message: "User already exists with this email." });
        }
    } catch (error) {
        return res.status(500).send({ message: "Internal server error", error: error.message });
    }
});

app.post('/loginUser', async function (req, res) {
    console.log(req.body);// jo input aaya hai usko dikhao
    if (req.body.password && req.body.email) { // agar input me email aur password aayi hai tabhi hi chale warna na chale 
        let result = await User.findOne(req.body)
        console.log(result);
        const jwtSecretKey = process.env.JWT_SECRET_KEY;
        const tokenheaderkey = process.env.TOKEN_HEADER_KEY;
        if (result) {
            try {
                let token = jwt.sign({ result }, jwtSecretKey,);
                res.send({ result, auth: token })
            } catch (error) {
                res.send("internal server error ", error.message);
            }
        } else {
            res.send({ result: "No User found" })
        }

    } else {// email ya password me se koi ek cheez ya dono nhi daale
        res.send("Result not found")
    }
})

app.get('/cars/:userId', async (req, res) => {
    try {
        const userId = req.params.userId; // Get user ID from query parameters

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Find all books borrowed by the user
        const cars = await Car.find({ userId });

        if (cars.length === 0) {
            return res.status(404).json({ message: "No cars found for this user" });
        }

        res.status(200).json(cars); // Return the list of borrowed books
    } catch (error) {
        console.error("Error fetching cars:", error.message);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

app.delete('/deleteCar/:carId', async (req, res) => {
    const { carId } = req.params;

    try {
        // Check if the book exists
        const car = await Car.findById(carId);
        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }

        // Remove the book from the books collection
        await Car.findByIdAndDelete(carId);

        // Remove all corresponding entries in the bookBorrowed collection
        // await BorrowedBooks.deleteMany({ carId: carId });

        return res.status(200).json({ message: 'Car and corresponding records deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to delete book' });
    }
});

app.post('/addCar', async (req, res) => {
    const { userId, title, description, photos, price, tags , detailDescription} = req.body;
    // log(req.body)
    try {
        const newCar = new Car({
            userId,
            title,
            description,
            photos,
            price,
            tags,
            detailDescription
        });

        await newCar.save();
        res.status(201).json(newCar);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.put('/updateCar/:id', async (req, res) => {
    try {
        const updatedCar = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedCar);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/carDetail/:id", async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);

        if (!car) {
            return res.status(404).json({ message: "Car not found" });
        }

        res.status(200).json(car);
    } catch (error) {
        console.error("Error fetching car details:", error);
        res.status(500).json({ message: "Server error" });
    }
});


