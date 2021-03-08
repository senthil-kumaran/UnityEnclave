const mongoose = require('mongoose')

const homeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'users',
    },
    block: {
        type: String,
        required: [true, 'Please provide block name']
    },
    flatNumber: {
        type: String,
        required: [true, 'Please provide flat number'],
    },
    floor: {
        type: Number,
        required: [true, 'Please provide floor number'],
        min: [1, 'A floor must be above 0'],
        max: [15, 'A floor must be below 16']
    },
    bedRoom: {
        type: Number,
        required: [true, 'Please provide number of bedrooms'],
        min: [1, 'Minimum 1 bedroom'],
        max: [3, 'Maximum 3 bedrooms']
    },
    bathRoom: {
        type: Number,
        required: [true, 'Please provide number of bathrooms'],
        min: [1, 'Minimum 1 bathroom'],
        max: [3, 'Maximum 3 bathrooms']
    },
    rent: {
        type: Number,
        required: [true, 'Please provide rent expected']
    },
    advance: {
        type: Number,
        required: [true, 'Please provide advance expected']
    },
    food: Boolean,
    negotiable: Boolean,
    furnished: {
        type: String,
        enum: ['NA', 'semi-furnished', 'furnished'],
        default: 'NA'
    },
    family: Boolean,
    images: [String],
    doorNumber: String,
    rentInINRFormat: String,
    advanceInINRFormat: String,
    active: {
        type: Boolean,
        default: true,
        select: false
    }
})

homeSchema.pre(/^find/, function(next) {  
    this.populate('userId')
    next()
})

homeSchema.pre('save', async function(next) {
    this.doorNumber = this.block + this.flatNumber
    this.rentInINRFormat = this.rent.toLocaleString('en-IN')
    this.advanceInINRFormat = this.advance.toLocaleString('en-IN')
})

homeSchema.post('findOneAndUpdate', async function() {
    const home = await this.model.findOne(this.getFilter())

    if(home) {
        home.rentInINRFormat = home.rent.toLocaleString('en-IN')
        home.advanceInINRFormat = home.advance.toLocaleString('en-IN')
        await home.save()
    }
})

const homeModel = mongoose.model('homes', homeSchema)

module.exports = homeModel