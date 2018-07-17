const express = require('express')
const index = express.Router()
const User = require('../models/user')
const { currentUser } = require('./main')

index.get('/', (request, response) => {
    const user = currentUser(request)
    const args = {
        user:user,
    }
    response.render('index.html', args)
})
index.get('/music', (request, response) => {
    response.render('music.html')
})
index.get('/zy', (request, response) => {
    response.render('zy.html')
})
index.get('/resume', (request, response) => {
    response.render('resume.html')
})
module.exports = {
    index: index,
}
