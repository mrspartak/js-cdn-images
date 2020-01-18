# Simple nodejs CDN server 

This app supports uploading, delivering and manipulating images (resizing on fly with cache)
For better deployment use this repo https://github.com/mrspartak/js-cdn-images-dc

## API
Under construction

## Environment variables
```
#port app will be launched at
const APP_PORT = process.env.APP_PORT || 3000
#scheme and domain for delivery of full image url
const HOST_SCHEME = process.env.HOST_SCHEME || 'http'
const HOST_DOMAIN = process.env.HOST_DOMAIN || '127.0.0.1:'+ APP_PORT
#start logging
const DEBUG = process.env.DEBUG || false
#you can set KEY for requests
const API_KEY = process.env.API_KEY || false
```