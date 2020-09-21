const mongoose = require('mongoose');
const ConnectDB = async () => {
  let DBURI;
  if (process.env === 'production') {
    DBURI = process.env.MONGO_URI_PROD;
  } else {
    DBURI = process.env.MONGO_URI_DEV;
  }
  try {
    const conn = await mongoose.connect(DBURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
module.exports = ConnectDB;
