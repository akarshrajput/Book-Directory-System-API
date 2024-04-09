const app = require("./app");
const mongoose = require("mongoose");

const bookRoute = require("./routes/book");

const db =
  "mongodb+srv://shashank:6X!r!Z5b-3SikA@@book-api-cluster-1.kkuebtk.mongodb.net/book-api?retryWrites=true&w=majority&appName=book-api-cluster-1";

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log(`MongodDB's mongoose is connected`);
  })
  .catch((err) => {
    console.log(`MongodDB's mongoose failed to connect`);
  });

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
