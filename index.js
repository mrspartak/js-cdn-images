const app = require('./src/server.js')

const APP_PORT = app.APP_PORT

app.listen(APP_PORT, () => {
	console.log('App listening on port')
})