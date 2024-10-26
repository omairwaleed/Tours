process.on('uncaughtException', (err) => {
  console.error(err.name, err.message);
  console.error('uncaughtException shuting down');
  process.exit(1);
});
const app = require('../app');
//database
const mongoose = require('mongoose');
const DB = process.env.MONGODB_URI.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log('success coonect to database');
  });

///
const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`app running on port ${process.env.port}`);
});
process.on('unhandledRejection', (err) => {
  console.error(err.name, err.message);
  console.error('unhandled rejection shuting down');
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('SIGTERM Received ,shutting down');
  server.close(() => {
    console.log('Process terminateds');
  });
});
