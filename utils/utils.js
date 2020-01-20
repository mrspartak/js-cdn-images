const path = require('path')
const fs = require('fs')
const { assign } = require('lodash')

/* path */
exports.ROOT_DIR = path.resolve(process.cwd(), './');
exports.path = function(userPath, settings = {}) {
	let defaultSettings = {
		__dirname: false
	}
	settings = assign(defaultSettings, settings)

	return path.resolve(settings.__dirname ? settings.__dirname : process.cwd(), './', userPath);
}
exports.pathExists = function(userPath, extensions = ['']) {
	let filePath = exports.path(userPath)
	return extensions.some((extension) => {
		let tmpPath = extension == '' ? filePath : filePath +'.'+ extension
		return fs.existsSync(tmpPath)
	})
}


/* promise */
exports.to = function(promise) {
	return promise.then(data => {
		return [null, data]
	})
	.catch(err => [err])
}

exports.sleep = function(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

exports.asyncForEach = async function(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

/* randoms */
exports.checkConstant = function(constant, value) {
	return Object.values(constant).indexOf(value) == -1 ? false : true
}
//length - 9 maximum
exports.uniqueID = function(length) {
	return Math.random().toString(36).substr(2, length);
}