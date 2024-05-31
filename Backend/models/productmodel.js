const mongoose = require('mongoose')

const productSchema= new mongoose.Schema({
    name:{
        type:String,
        required:[true, "Please Enter Product Name"]
    },
    description: {
        type: String,
        required: [true, "Please Enter product description"],
    },
    price: {
        type: Number,
        required: [true, "Please Enter product  price"],
        manLength: [8, "price cannot exceed a 8 characters"]
    },
    rating: {
        type: Number,
        defult: 0,
    },
    images: [
        {
            public_id: {
                type: String,
                required: true,
            },
            url: {
                type: String,
                required: true,
            }
        }
    ],
    category: {
        type: String,
        required: [true, "Please enter  category"]
    },
    stock: {
        type: Number,
         required: [true, "Please enter product Stock"],
        maxLength: [4, "stock cannot exceed 4 charater"],
        default: 1,
    },
    numOfReviews: {
        type: String,
        default: 0
    },
    reviews: [
        {
            name: {
                type: String,
                required: true,
            },
            comment: {
                type: String,
                required: true,
            },
            rating: {
                type: Number,
                required: true,
            },
}
    ],
     user:{
         type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
     },
    createdAt: {
        type: Date,
        default: Date.now,
    }
}) 

module.exports = mongoose.model('Product', productSchema)