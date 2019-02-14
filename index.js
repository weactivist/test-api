const express = require('express')
const bodyParser = require('body-parser')
const sleep = require('sleep-promise')
const crypto = require('crypto')
const app = express()
const port = 1338

// TODO: Change this to your sign key
const sign_key = 'fake_sign_key'

app.use(bodyParser.raw())

app.get('/', async (req, res) => res.send('Hello World!'))

app.post('/ping', async (req, res) => {
    let body = ''

    req.on('data', chunk => {
        body += chunk.toString()
    })

    req.on('end', () => {
        timestamp = req.headers['x-billogram-request-timestamp']
        signature = req.headers['x-billogram-signature']

        console.log('Timestamp: ', timestamp)
        console.log('Signature: ', signature)

        base_string = timestamp + ':' + body

        const hash = crypto.createHmac('sha256', sign_key).update(base_string).digest('hex')

        console.log('Calculated hash: ', hash)
        console.log('Validate signature: ', signature == hash ? 'Calculated signature is valid!' : 'Calculated signature does NOT match :(')

        if(signature == hash) {
            res.status(200)
            return res.json({'status': '200 OK'})
        }
        else {
            res.status(400)
            return res.json({'status': '400 Bad Request'})
        }
    })
})

app.post('/redirector', async (req, res) => {
    return res.redirect('http://localhost:1338/redirector');
})

app.post('/slowpoke', async (req, res) => {
    const wait = 15000
    await sleep(wait)
    return res.json({'status': `sorry i was slow, waited ${wait} ms`})
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
