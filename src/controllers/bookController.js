//============================================================================================================

// POST /books
// Create a book document from request body. Get userId in request body only.
// Make sure the userId is a valid userId by checking the user exist in the users collection.
// Return HTTP status 201 on a succesful book creation. Also return the book document. The response should be a JSON object like this
// Create atleast 10 books for each user
// Return HTTP status 400 for an invalid request with a response body like this

// title,excerpt,userID,ISBN,category,subcategory,releasedAt

const valid = require('../validation/validation')
const moment = require('moment')
const mongoose = require('mongoose');
const bookModel = require('../models/bookModel');
const userModel = require('../models/userModel');

const createBook = async function (req, res) {

    try {
        const bookData = req.body
        let { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = bookData

        userId = userId.trim();

        if (Object.keys(bookData).length = 0) {
            return res.status(400).send({ status: false, message: "Please provide some data to create book" })
        }

        if (!title)
            return res.status(400).send({ status: false, message: "Please provide title" })

        if (typeof (title) != "string")
            return res.status(400).send({ status: false, message: "Please provide valid title" })

        const findBook = await bookModel.findOne({ title: title })
        if (findBook)
            return res.status(400).send({ status: false, message: "This book already exists" })

        if (!excerpt)
            return res.status(400).send({ status: false, message: "Please provide the excerpt" })

        if (typeof (excerpt) != "string")
            return res.status(400).send({ status: false, message: "Please provide valid excerpt" })

        if (!userId)
            return res.status(400).send({ status: false, message: "Please provide the userID" })


        if (!mongoose.isValidObjectId(userId))
            return res.status(400).send({ status: false, message: "Please provide the valid userID" })

        const findUser = await userModel.findById(userId)
        if (!findUser)
            return res.status(404).send({ status: false, message: "user not found" })

        if (!ISBN)
            return res.status(400).send({ status: false, message: "Please provide the ISBN" })

        if (!valid.isbnValid(ISBN))
            return res.status(400).send({ status: false, message: "Please provide valid ISBN" })

        const findISBN = await bookModel.findOne({ ISBN: ISBN })
        if (findISBN)
            return res.status(400).send({ status: false, message: "This ISBN number already exists" })

        if (!category)
            return res.status(400).send({ status: false, message: "Please provide the category" })

        if (typeof (category) != 'string')
            return res.status(400).send({ status: false, message: "Please provide valid category" })

        if (!subcategory)
            return res.status(400).send({ status: false, message: "Please provide the subcategory" })

        if (typeof (subcategory) != 'string')
            return res.status(400).send({ status: false, message: "Please provide valid subcategory category" })

        if (!releasedAt)
            return res.status(400).send({ status: false, message: "Please provide the releasedAt" })

        // if (!(moment(releasedAt).format("MM/DD/YYYY")))
        //     return res.status(400).send({ status: false, message: "Please provide valid date" })


        const createdBook = await bookModel.create(bookData)
        return res.status(201).send({ status: true, data: createdBook })

    }
    catch (err) {
        return res.status(400).send({ status: false, message: err.message })
    }

}


const getBook = async function (req, res) {
    try {
        const data = req.query
        const { userId, category, subcategory } = data
        if (Object.keys(data).length == 0) {
            const fetchData = await bookModel.find({ isDeleted: false }).sort({ title: 1 })
            return res.status(200).send({ status: true, data: fetchData })
        }

        if (userId || subcategory || category) {

            const filterData = await bookModel.find({ ...data, isDeleted: false }).sort({ title: 1 })

            if (filterData.length == 0) { return res.status(404).send({ status: false, message: "book not found" }) }

            return res.status(200).send({ status: true, data: filterData })
        }
          else  return res.status(400).send({ status: false, message: "invalid key" })
        

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}


module.exports = { createBook, getBook }