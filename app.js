require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
//connectDB
const connectDB = require('./db/connect');
//routes
const authRouter = require('./routes/auth');
const jobsRouter = require('./routes/jobs');
const auth = require('./middleware/auth')
// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');


// extra packages
app.use(express.json());

// routes
app.use('/api/v1/jobs', auth, jobsRouter)
app.use('/api/v1/auth', authRouter)
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
