const express = require('express');
const bodyParser = require("body-parser")
const app = express()
const fs = require("fs/promises");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
    try {
        const data = await fs.readFile('cars.json')
        const myObject = JSON.parse(data.toString())
        res.json(myObject)
    } catch (err) {
        console.log(err);
    }
})

app.post('/', async (req, res) => {
    try {
        const brand = req.body.brand
        const model = req.body.model
        const year = req.body.year
        const id = Math.floor(Math.random() * 10000)
        const json_car = { id, brand, model, year }
        const data = await fs.readFile('cars.json')
        const myObject = JSON.parse(data.toString())
        myObject[id] = json_car;
        console.log(id)
        const specificId = myObject[id]
        if (id != specificId) {
            await fs.writeFile('cars.json', JSON.stringify(myObject), null)
        }
    } catch (error) {
        console.log(error);
    }
})

app.get('/:carID', async (req, res) => {
    try {
        const car_id = req.params.carID
        const data = await fs.readFile('cars.json')
        const myObject = JSON.parse(data.toString())
        const parsed_id = myObject[car_id]
        if (!parsed_id) {
            console.log('invalid id')
            return
        }
        res.json(myObject[car_id])
    } catch (err) {
        console.log(err)
    }
})


app.delete('/:carID', async (req, res) => {
    const car_id = req.params.carID
    const data = await fs.readFile('cars.json')
    const myObject = JSON.parse(data.toString())
    const parsed_id = myObject[car_id]
    if (!parsed_id) {
        console.log('invalid id')
        return
    }
    delete myObject[car_id]
    await fs.writeFile('cars.json', JSON.stringify(myObject, null, 2))
    res.status(200).send('Car deleted')
})




app.listen(3000);