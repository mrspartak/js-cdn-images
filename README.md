# Simple nodejs CDN server 

This app supports uploading, delivering and manipulating images (resizing on fly with cache)
For better deployment use this repo https://github.com/mrspartak/js-cdn-images-dc

[![Docker Cloud Automated build](https://img.shields.io/docker/cloud/automated/assorium/js-cdn-images?style=for-the-badge "Docker Cloud Automated build")](https://hub.docker.com/r/assorium/js-cdn-images "Docker Cloud Automated build")
[![Docker Cloud Build Status](https://img.shields.io/docker/cloud/build/assorium/js-cdn-images?style=for-the-badge "Docker Cloud Build Status")](https://hub.docker.com/r/assorium/js-cdn-images "Docker Cloud Build Status")
[![Docker Pulls](https://img.shields.io/docker/pulls/assorium/js-cdn-images?style=for-the-badge "Docker Pulls")](https://hub.docker.com/r/assorium/js-cdn-images "Docker Pulls")  <br/>

[![Latest Github tag](https://img.shields.io/github/v/tag/mrspartak/js-cdn-images?sort=date&style=for-the-badge "Latest Github tag")](https://github.com/mrspartak/js-cdn-images/releases "Latest Github tag")

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
