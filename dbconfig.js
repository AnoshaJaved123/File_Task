// import mongoose from 'mongoose'
const mongoose = require('mongoose')

const DBURL = 'mongodb+srv://vercel-admin-user:1H1Di7ZJrWFgCMOi@cluster0.2pxbf5w.mongodb.net/fileupload';

const connectTomongo = () => {
    mongoose.connect(DBURL, () => {
        console.log("connected to DB")
    })
}

module.exports = connectTomongo;