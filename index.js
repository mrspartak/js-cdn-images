const express = require('express')
const app = express()
const fs = require('fs')
const __ = require('./utils/utils')

const config = require(__.path('config/config')) 

const port = process.env.PORT || 3000
app.listen(port, () => {
	console.log('App listening on port '+ port)
})

/* Middleware */
const bodyParser = require('body-parser')
const cors = require('cors')
const helmet = require('helmet')
    
app.use(bodyParser.json())
    .use(bodyParser.urlencoded({extended: true, limit: '10mb'}))
    .use(cors({
        origin: '*'
    }))
    .use(helmet())

app.get('/:bucket/:w(\\d+)?:d(\\x)?:h(\\d+)?:c(/)?:image', (req, res) => {
	res.json(req.params)
})

app.post('/upload', (req, res) => {

})


app.get('/ping', (req, res) => {
	res.send('pong')
})

app.get('/storage', (req, res) => {
	let files = fs.readdirSync('./upload/')
	let bool = fs.writeFileSync('./upload/test.jpg', '123')

	res.json({
		files,
		bool,
		version
	})
})