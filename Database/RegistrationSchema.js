const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
 
  name: String,
  email: String,
  phoneNumber: Number,
  movieName: String,
  BookingDate:String,
  seatRow: String,
  seatCol: String,
  showTime: String
});

const UserRegSchema = new mongoose.Schema({
  name: String,
  profileImg: String,
  email: String,
  phoneNumber: Number,
  password: String,
  address: String,
  state: String,
  district: String,
  pinCode: String,
  token: String,
  bookings: [BookingSchema]
});

module.exports = mongoose.model('User-Registration', UserRegSchema);
