const express = require('express');
const config = require('config');
const mongoose = require('mongoose');

const app = express();

app.use(express.json());
app.use('/api/auth', require('./routes/auth.routes'));

(async () => {
  try {
    await mongoose.connect(config.get('mongoUri'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    app.listen(config.get('port'), () => console.log('listening'));
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
