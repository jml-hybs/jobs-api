require('dotenv').config();
require('express-async-errors');

// exra security packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

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
app.set('trust proxy', 1)
app.use(rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
}))
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss())
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
