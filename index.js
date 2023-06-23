


require('./MovieImg');
require('./User-Registr');
const express = require('express');
const cors = require('cors');
const app = express();
require('./Database/config');
const User = require('./Database/RegistrationSchema');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
app.use(express.static('public'));
app.use(express.json());
//app.use(cors()); // Invoke cors() as a function
const Movie = require('./Movie');
const PORT=process.env.PORT||5000;


app.use(cors()); // Invoke cors() as a function
const storage = multer.diskStorage({
  destination: 'public/uploads/',
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const filename = uniqueSuffix + extension;
    cb(null, filename);
  }
});

const upload = multer({ storage });
app.post('/movies', upload.single('moviePoster'), async (req, res) => {
  const { movieName } = req.body;
  const moviePoster = req.file.filename;

  try {
    const newMovie = new Movie({ movieName, moviePoster });
    const savedMovie = await newMovie.save();
    res.status(201).json(savedMovie);
  } catch (error) {
    console.error('Error saving movie:', error);
    res.status(500).json({ error: 'Failed to save movie' });
  }
});


//for User-Registration 
app.post('/register', async (req, res) => {
  try {
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const newUser = new User(req.body);
    const result = await newUser.save();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});




//for User Login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, 'secretKey', { expiresIn: '7d' });
    user.token = token;
    const result=await user.save();

    console.log("user is ",user);
    console.log("Result  is ",result);
    res.json({ user, token });
    // res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

//Update User Profile
app.put('/profile/:userId', async (req, res) => {

  try {
    const { userId } = req.params;
    const updatedData = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      updatedData,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json(updatedUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
});

app.get('/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});
app.get('/movies', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (error) {
    console.error('Error retrieving movies:', error);
    res.status(500).json({ error: 'Failed to retrieve movies' });
  }
});

app.post('/user-movie-booking/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    // console.log(userId);
    // console.log(req.body);
    const bookingData = {
     
      name: req.body.name,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      movieName: req.body.movieName, 
      BookingDate:req.body.BookingDate,
      seatRow: req.body.seatRow,
      seatCol: req.body.seatCol,
      showTime: req.body.showTime, // Update the field name to 'showTime'
    };
    // console.log(userId);
    // console.log(bookingData);
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $push: { bookings: bookingData } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json(updatedUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
});


app.get('/', (req, res) => {
  res.send('Hello Welcome');
});




app.listen(PORT, () => {
  console.log('Server is listening on port',PORT);
});

