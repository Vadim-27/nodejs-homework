// const mongoose = require('mongoose');
// require("dotenv").config();
// const app = require('./app')


// const { DB_HOST, PORT=3000 } = process.env;
 
//   // wWMuzgOHxUeeoUIh

 
//   mongoose.connect(DB_HOST)
//     .then(() => app.listen(PORT))
//     .catch((error) => console.log(error.message));


    const mongoose = require("mongoose");
    require("dotenv").config();
    require("colors");
    const app = require("./app");

    const { DB_HOST, PORT = 3000 } = process.env;
// console.log(process.env)
    // wWMuzgOHxUeeoUIh


    mongoose
      .connect(DB_HOST)
      .then(() =>
        app.listen(PORT, () => {
          console.log(
            `Server is running on PORT: ${PORT}. DB_HOST: ${DB_HOST} `.green
              .italic.bold
          );
          
        })
      )
      .catch((error) => console.log(error.message.red.italic.bold));
