const express = require('express')
const app = express()
const fs = require('fs')
const __ = require('./utils/utils')
const sharp = require('sharp')
const md5 = require('nano-md5')

const APP_PORT = process.env.APP_PORT || 3000
const HOST_SCHEME = process.env.HOST_SCHEME || 'http'
const HOST_DOMAIN = process.env.HOST_DOMAIN || '127.0.0.1:'+ APP_PORT
const API_KEY = process.env.API_KEY || false
const DEBUG = process.env.DEBUG || false

app.listen(APP_PORT, () => {
	console.log('App listening on port '+ APP_PORT)
})

/* Middleware */
const bodyParser = require('body-parser')
const cors = require('cors')
const helmet = require('helmet')
const fileUpload = require('express-fileupload')

app.use(bodyParser.json())
    .use(bodyParser.urlencoded({extended: true, limit: '10mb'}))
    .use(cors({
        origin: '*'
    }))
    .use(fileUpload())
    .use(helmet())


const SUPPORTED_FORMATS = ['jpeg', 'png', 'gif']
/*
	bucket
	name
	overwrite

	file.image
*/
app.post('/upload', ensureAuth, async (req, res) => {
	if(!req.files) {
		if(DEBUG) console.log('/upload', 'No file')
		return res.json({success: false, error: 'File must be uploaded'})
	}
	if(!req.files.image) {
		if(DEBUG) console.log('/upload', 'File obj name', Object.keys(req.files))
		return res.json({success: false, error: 'File must be named image'})
	}

	let file = req.files.image
	let body = req.body

	let bucket = 'default'
	let name = file.name || 'default'
	if(body.bucket) {
		body.bucket = body.bucket.replace(/[^a-z0-9_-]/ig, '')
		if(body.bucket.length > 32) {
			if(DEBUG) console.log('/upload', 'bucket name length', body.bucket)
			return res.json({success: false, error: 'Bucket name must be less than 32 character'})
		}
		bucket = body.bucket
	}
	if(body.name) name = body.name
	let nameMD5 = md5(name)
	let nameMD5_splited = nameMD5.match(/.{1,4}/g)

	let width, height
	try {
		let image = sharp(file.data, {
			failOnError: true
		})

		let metadata = await image.metadata()
		if(SUPPORTED_FORMATS.indexOf(metadata.format) == -1) {
			if(DEBUG) console.log('/upload', 'Unsupported format', metadata.format)
			return res.json({success: false, error: 'Unsupported format. App supports only '+ SUPPORTED_FORMATS.join(', ')})
		}

		width = metadata.width
		height = metadata.height

		let relativeFolderPath = ['upload', bucket, ...nameMD5_splited].join('/')
		let absoluteFolderPath = __.path(relativeFolderPath)

		var [pathNotExists] = await __.to(fs.promises.access(absoluteFolderPath))
		if(!pathNotExists && !body.overwrite) {
			if(DEBUG) console.log('/upload', 'already exists', bucket, nameMD5)
			return res.json({success: false, error: 'Image already uploaded'})
		}

		var [error] = await __.to(fs.promises.mkdir(absoluteFolderPath, {recursive: true}))
		if(error) {
			if(DEBUG) console.log('/upload', 'create folder error', error)
			return res.json({success: false, error: 'Error uploading image'})
		}

		let fileName = `${width}x${height}_original.${metadata.format}`
		let relativeFilePath = relativeFolderPath +'/'+ fileName
		let absoluteFilePath = absoluteFolderPath +'/'+ fileName

		await image.toFile(absoluteFilePath)
		let imagePath = `/i/${bucket}/${nameMD5}`
		let imageUrl = `${HOST_SCHEME}://${HOST_DOMAIN}${imagePath}`

		return res.json({
			success: 1,
			imageUrl,
			imagePath
		})

	} catch(error) {
		console.log('/upload', 'try/catch error', error)
		return res.json({success: false, error: 'Can\'t compute file'})
	}
})

app.get('/i/:path([a-zA-Z0-9_\\-/]+)', async (req, res) => {
	if(!req.params || !req.params.path) return res.json({success: false, error: 'no file'})
	
	let [bucket, image, dimensions] = req.params.path.split('/')
	if(!bucket || !image) return res.json({success: false, error: 'no file'})

	let width, height
	if(dimensions) {
		[width, height] = dimensions.split('x')
		width = parseInt(width)
		height = parseInt(height)

		if(!width || !height) return res.json({success: false, error: 'dimensions error'})
	}

	let nameMD5_splited = image.match(/.{1,4}/g)
	
	let relativeFolderPath = ['upload', bucket, ...nameMD5_splited].join('/')
	let absoluteFolderPath = __.path(relativeFolderPath)

	var [pathNotExists] = await __.to(fs.promises.access(absoluteFolderPath))
	if(pathNotExists) return res.json({success: false, error: 'no file'})

	let matchName = dimensions || '_original'
	
	var [error, files] = await __.to(fs.promises.readdir(absoluteFolderPath))
	if(error) {
		console.log('/i', 'readdir', error)
		return res.json({success: false, error: 'no file'})
	}

	let foundImage = files.find(path => path.indexOf(matchName) != -1)
	//if image not exists and no dimensions were passed
	if(!dimensions && !foundImage) return res.json({success: false, error: 'no file'})

	//if image was found
	if(foundImage) return sendImage(absoluteFolderPath +'/'+ foundImage, res)

	let originalImage = files.find(path => path.indexOf('_original') != -1)
	if(!originalImage) return res.json({success: false, error: 'no file'})

	//resize image and send it
	try {
		let image = sharp(absoluteFolderPath +'/'+ originalImage, {
			failOnError: true
		})

		let metadata = await image.metadata()
		await image.resize({width, height})

		let fileName = `${width}x${height}.${metadata.format}`
		let fullPath = absoluteFolderPath +'/'+ fileName

		await image.toFile(fullPath)
		return sendImage(fullPath, res)

	} catch (error) {
		return res.json({success: false, error: 'Can\'t resize file'})
	}
})

function sendImage(path, res) {
	res.sendFile(path)
}

function ensureAuth(req, res, next) {
	if(!API_KEY) return next()

	let key = ''
	if(req.method == 'POST') key = req.body.key 
	if(req.method == 'GET') key = req.query.key

	if(key == API_KEY) return next()

	return res.json({success: false, error: 'Auth error'})
}