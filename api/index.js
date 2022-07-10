require('express-async-errors')
const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const cors = require("cors");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const songRoutes = require("./routes/songs");
const playListRoutes = require("./routes/playLists");
const searchRoutes = require("./routes/search");


const app = express()

dotenv.config()
app.use(express.json()) // this is also a middleware this is for accepting json format data
app.use(cors())


const PORT = process.env.PORT

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB) // connect with data base
    console.log('Connected to DB : MongoDB')
  } catch (error) {
    throw error
  }
}

mongoose.connection.on('disconnected', () =>
  console.log('MongoDB disconnected'),
) //in some case when mongodb disconnect this will run
mongoose.connection.on('connected', () => console.log('MongoDB connected'))


//middlewares : this helps in handling the errors

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500
  const errorMessage = err.message || 'Something went wrong!'
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  })
})

app.use("/api/users/", userRoutes);
app.use("/api/login/", authRoutes);
app.use("/api/songs/", songRoutes);
app.use("/api/playlists/", playListRoutes);
app.use("/api/", searchRoutes);

app.listen(PORT, () => {
  connectDB()
  console.log('backend running on :' + PORT)
})
