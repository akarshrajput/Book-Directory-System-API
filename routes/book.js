const app = require('../app');
const Book = require('../models/Books');
const cloudinary = require('../db/cloudinary');
const path = require('path');

app.get('/api/books', (req, res) => {
    // Check if page number is passed but page limit is not passed to the URI.
    if(req.query.page && !req.query.limit)
    {
        res.status(417).json({
            "message": `Page limit is required.`,
            "URI": "https://localhost:5000/api/books?page=1&limit=5"
        })
    }
    // Check if page number is not passed but page limit is passed to the URI.
    else if(!req.query.page && req.query.limit)
    {
        res.status(417).json({
            "message": `Starting page is required.`,
            "URI": "https://localhost:5000/api/books?page=1&limit=5"
        })
    }
    // Check if both page number and page limit were passed to the URI.
    // If both were not passed then it's considered that the user wants to all books as they were uploaded all at ones
    else if(!req.query.page && !req.query.limit)
    {
        Book.find()
        .then((books) => {
            res.status(200).json({
                books
            })
        })
        .catch((err) => {
            res.status(401).send(err)
        })
    }
    // Check if both page number and page limit were passed to the URI.
    // If they were passed then we look for the page's number also the limit
    else if(req.query.page && req.query.limit)
    {
        const limit = req.query.limit;
        const page = req.query.page >= 1 ? req.query.page : 1; // Check if the page number passed by the user greather than or equals 1 (If it equals or greather than 1 then i keep the number else i make the page number 1 since the number that has been passed is less than 1)

        // Check if user wants to sort these books (NB: user can only be able to sort by book's title and author's name)
        // Checks if sortBy is passed but sortMode (defines if results will be in ascending or descending order) not passed to the URI
        if(req.query.sortBy && !req.query.sortMode)
        {
            res.status(417).json({
                "message": `Sorting mode is required.`,
                "solution": "Chose one of the examples below, note sortMode could be either 'asc' or 'desc'.",
                "URI1": "https://localhost:5000/api/books?page=1&limit=5&sortBy=title&sortMode=asc",
                "URI2": "https://localhost:5000/api/books?page=1&limit=5&sortBy=title&sortMode=desc",
                "URI3": "https://localhost:5000/api/books?page=1&limit=5&sortBy=author&sortMode=asc",
                "URI4": "https://localhost:5000/api/books?page=1&limit=5&sortBy=author&sortMode=desc"
            })
        }
        // Checks if sortBy is not passed but sortMode is passed to the URI
        else if(!req.query.sortBy && req.query.sortMode)
        {
            res.status(417).json({
                "message": `SortBy is required.`,
                "solution": "Chose one of the examples below, note sortBy could be either 'title' or 'author'.",
                "URI1": "https://localhost:5000/api/books?page=1&limit=5&sortBy=title&sortMode=asc",
                "URI2": "https://localhost:5000/api/books?page=1&limit=5&sortBy=title&sortMode=desc",
                "URI3": "https://localhost:5000/api/books?page=1&limit=5&sortBy=author&sortMode=asc",
                "URI4": "https://localhost:5000/api/books?page=1&limit=5&sortBy=author&sortMode=desc"
            })
        }
        // Checks if both sortBy and sortMode were passed to the URI
        else if(req.query.sortBy && req.query.sortMode)
        {
            const sortByValue = req.query.sortBy; // Stores the value of sortBy
            const sortModeValue = req.query.sortMode; // Stores the value of sortMode

            // Checks if the sortBy's value that was passed to the URI is either author or title (This defines how the user wants to sort these books alongside the pagination)
            if( !(sortByValue == 'author' || sortByValue == 'title'))
            {
                res.status(417).json({
                    "message": `SortBy is incorrect.`,
                    "solution": "Chose one of the examples below, note sortBy's value could be either 'author' or 'title' and sortMode's value could be either 'asc' or 'desc'.",
                    "URI1": "https://localhost:5000/api/books?page=1&limit=5&sortBy=title&sortMode=asc",
                    "URI2": "https://localhost:5000/api/books?page=1&limit=5&sortBy=title&sortMode=desc",
                    "URI3": "https://localhost:5000/api/books?page=1&limit=5&sortBy=author&sortMode=asc",
                    "URI4": "https://localhost:5000/api/books?page=1&limit=5&sortBy=author&sortMode=desc"
                })
            }
            // Checks if the sortMode's value that was passed to the URI is needed either in ascending or descending order (with value 'asc' or 'desc')
            else if( !(sortModeValue == 'asc' || sortModeValue == 'desc'))
            {
                res.status(417).json({
                    "message": `SortMode is incorrect.`,
                    "solution": "Chose one of the examples below, note sortMode's value could be either 'asc' or 'desc'.",
                    "URI1": "https://localhost:5000/api/books?page=1&limit=5&sortBy=title&sortMode=asc",
                    "URL2": "https://localhost:5000/api/books?page=1&limit=5&sortBy=title&sortMode=desc",
                    "URI3": "https://localhost:5000/api/books?page=1&limit=5&sortBy=author&sortMode=asc",
                    "URI4": "https://localhost:5000/api/books?page=1&limit=5&sortBy=author&sortMode=desc"
                })
            }
            // Checks if both sortBy's value and sortMode's were passed to the URI correctly
            else
            {
                const sortMode = sortModeValue === 'desc' ? -1 : 1; // Checks if the sortMode's value passed in the URI is 'desc' (which means the user wants the books results in a descending order)
                // If the sortMode's value is 'desc' then we update sortMode's value to -1 else we update it to 1 (NB: 1 is recognized generally in mongoDB's mongoose as ascending order while -1 is recognized as a descending order)

                // Checks if sortBy's value equals 'title' (if so, then sort the book results according to its books title order)
                if(sortByValue === 'title')
                {
                    Book.find()
                    .limit(parseInt(limit))
                    .skip(parseInt((page - 1) * limit))
                    .sort({ title: sortMode }) // sortMode here could be -1 or 1 depending on the value the user has passed to sortMode in the URI
                    
                    .then((results) => {
                    res.status(200).send(results);
                    })
                    .catch((err) => {
                        res.status(500).send(err);
                    });
                }
                // Checks if sortBy's value equals 'author' (if so, then sort the book results according to its author's name order)
                else
                {
                    Book.find()
                    .limit(parseInt(limit))
                    .skip(parseInt((page - 1) * limit))
                    .sort({ author: sortMode })
                    
                    .then((results) => {
                    res.status(200).send(results);
                    })
                    .catch((err) => {
                        res.status(500).send(err);
                    });
                }
                
            }
        }
        // Checks if both sortBy and sortMode were never passed to the URI
        else
        {
            Book.find()
            .limit(parseInt(limit))
            .skip(parseInt((page - 1) * limit)) // Here .sort method is not included since the user isnt trying to sort the books
            
            .then((results) => {
               res.status(200).json({
                   "URI": `http://localhost:5000/api/books?page=${(page - 1) * limit === 0 ? 1 : (page - 1) * limit}&limit=${limit}`,
                   results});
            })
            .catch((err) => {
                res.status(500).send(err);
            });
        }   
    }
})


app.post('/api/books', (req, res) => {

    // Checks if the book title, description, cover_image and author were not passed to the body
    if(!req.body.title || !req.body.description || !req.body.cover_image || !req.body.author)
    {
        res.status(417).json({
            "message": 'Request failed due to all required inputs were not included',
            "required inputs": "title, description, cover_image, author"
        });
    }

    const filePathChecker = path.extname(req.body.cover_image); // Collect the file extension of the file passed to the body
    if (filePathChecker === '.jpg') // If file extension gotten equals .jpg (NB: Only .jpg files are allowed to be uploaded)
    {
        // upload image file my cloudinary server
        cloudinary.uploader.upload(req.body.cover_image, { tags: 'Book Dirctory System API' }, (cloudErr, Cloudimage) =>
        {
            if (cloudErr)
            {
                res.status(500).json({
                    "message": `We encountered an issue proccessing this upload, incase you're uploading through an API, please make sure you select the correect path where the image (jpg) is located at, e.g C:/Users/Username/Desktop/image.jpg.`
                });
            }
            if (Cloudimage)
            {
                generatedCloudinaryImageId = Cloudimage.public_id; // Get the public_id/unique Id generated for the image uploaded (NB: This is seriously needed when deleting a book)
                generatedCloudinaryImageUrl = Cloudimage.url; // Get the url generated for the image uploaded (NB: User can see the picture attached to a particular book with the url here)

                let newBook = new Book({
                    title: req.body.title, description: req.body.description, cover_image: generatedCloudinaryImageId, cover_image_url: generatedCloudinaryImageUrl, author: req.body.author
                })

                newBook.save()
                .then((book) => {
                    res.status(201).json({
                        "message": "Book has been successfully uploaded",
                        book
                    });
                })
                .catch((err) => {
                    res.status(500).send(`We encountered an issue uploading book, try again.`)
                })
            }
        });
    }
    else
    {
        res.status(400).send('File selected is not a jpg file');
    }
})


app.get('/api/books/:id', (req, res) => {
    bookId = req.params.id; // Get the id of the book that has been passed to the URI

    Book.findById(bookId, (getErr, getBookData) => {
        if(getErr)
        {
            res.status(500).send('Book with such ID does not exists.');
        }
        else
        {
            getBookData === null ? res.status(200).json({
                "message": `Book has been deleted.`
            })
            :
            res.status(200).json({
                "message": getBookData
            });
        }
    })
});


app.delete('/api/books/:id', (req, res) => {
    bookId = req.params.id;

    Book.findByIdAndDelete(bookId, (delErr, delRes) => {
        if(delErr) res.status(500).send('Book with such ID does not exists.')
        
        // When a delete result returns null, it means that the file having the Id passed here has been removed from the database
        if(delRes === null)
        {
            res.status(200).json({
                "message": `Book has previously been deleted.`
            })
        }
        else
        {
            cloudinaryImageId = delRes.cover_image; // Here we are using the public_id that was generated by cloudinary while uploading the image, to also delete the image from cloudinary as we delete its book from the database

            cloudinary.uploader.destroy(cloudinaryImageId, (CloudDelErr, CloudDelRes) =>
            {
                if(CloudDelErr)
                {
                    res.status(500).send('There was an issue while deleting image.');
                }

                if(CloudDelRes)
                {
                    res.status(200).json({
                        "message": `Book with title: '${delRes.title}' by ${delRes.author}, has been deleted.`,
                    });
                }
            });
        }
    })
})


const bookRoute = app;
module.exports = bookRoute;