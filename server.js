const app = require('./app');
const mongoose = require('mongoose');

const bookRoute = require('./routes/book');

const db = "mongodb+srv://stanyke:CKj8n66FFnWsxWr9@cluster0.5seyi.mongodb.net/book-directory-system-api?retryWrites=true&w=majority";

mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => {
    console.log(`MongodDB's mongoose is connected`)
}).catch((err) => {
    console.log(`MongodDB's mongoose failed to connect`)
})

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})