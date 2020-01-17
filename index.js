/*
	
*/
require('dotenv').config()

const express = require('express')
const app = express()
const fs = require('fs')

const cluster = require('cluster')
let cluster_id = null
if (cluster.isWorker) {
	cluster_id = cluster.worker.id
	console.log('cluster_id', cluster_id)
} else console.log('Master process')
console.log('Process pid:', process.pid)


app.listen(3000, () => {
	console.log('App listening on port '+ 3000)
})

app.use((req, res, next) => {
	console.log('#'+ cluster_id, req.method +'|'+ req.path)
	next()
})

app.get('/ping', (req, res) => {
	res.send('pong')
})

app.get('/storage', (req, res) => {
	let files = fs.readdirSync('./upload/')
	let bool = fs.writeFileSync('./upload/test.jpg', '123')

	res.json({
		files,
		bool
	})
})