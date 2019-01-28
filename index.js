const express = require('express')
const bodyParser = require('body-parser')
const sleep = require('sleep-promise')
const app = express()
const port = 1338

app.use(bodyParser.json())

app.get('/', async (req, res) => res.send('Hello World!'))

app.post('/ping', async (req, res) => {
    console.log('Got message with body: ', req.body)
    return res.json({'status': 'ok'})
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
