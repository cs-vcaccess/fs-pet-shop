const express = require('express')
const fs = require('fs')
const app = express()
const {Pool} = require('pg')
app.use(express.json())
const pool = new Pool({
  user: 'ratpuppymagic',
  host: 'localhost',
  database: 'petshop'
})
var output = "nothing"

async function read(index){
  await new Promise((res, rej) => {
    return fs.readFile('pets.json', 'utf-8', (err, data) => {
      if (err) rej(err)
      let pets = JSON.parse(data)
      if (index > pets.length)
      output = 'Usage: node pets.js read INDEX'
      else if (index === undefined) output = pets
      else output = pets[index]
      return res(output)
    })

  })
  return output

}
async function create(obj){
  if (!obj.age && obj.kind && obj.name) return false
  if (typeof obj.age != 'number' ||
      typeof obj.kind != 'string' ||
      typeof obj.name != 'string') return false

  await new Promise((res, rej) => {
    return fs.readFile('pets.json', 'utf-8', (err, data) => {
      if (err) throw err
      let parsed = JSON.parse(data)
      parsed.push(obj)
      let writer = fs.createWriteStream('pets.json')
      writer.write(JSON.stringify(parsed))
      writer.close()
      return res(true) // still don't quite understand
    })
  })
  return true // still don't quite understand
}
async function update(input, index){
  if (!input.age && input.kind && input.name) return false
  if (typeof input.age != 'number' ||
      typeof input.kind != 'string' ||
      typeof input.name != 'string') return false

  await new Promise((res, rej) => {
    return fs.readFile('pets.json', 'utf-8', (error, data) => {
      if (error) throw error
      obj = JSON.parse(data)
      obj[index].age = input.age
      obj[index].kind = input.kind
      obj[index].name = input.name
      let writer = fs.createWriteStream('pets.json')
      writer.write(JSON.stringify(obj))
      writer.close()
      return res(true)
    })
  })
  return true
}

function destroy(index){
  // not done with this
  fs.readFile('pets.json', 'utf-8', (error, data) => {
    if (error) throw error
    let pets = JSON.parse(data)
    pets.splice(index, 1)
    let writer = fs.createWriteStream('pets.json')
    writer.write(JSON.stringify(pets))
    writer.close()
  })
}
function inputGood(additional) {
  if (process.argv.length < 3 + additional) return false
  else return true
}

// READ ALL
app.get('/pets', async (request, response) => {
  response.statusCode = 200
  let data = await read()
  response.send(data)
})
// READ ONE
app.get('/pets/:index', async (request, response) => {
  response.statusCode = 200
  let data = await read(request.params.index)
  response.send(data)
})

// CREATE
app.post('/pets',  async (request, response) => {
  response.statusCode = 200
  if (await create(request.body)) {
    let data = await read()
    response.send(data)
  }
  else {
    response.statusCode = 400
    response.send("Bad Request")
  }
})

// UPDATE
app.patch('/pets/:index', async (request, response) => {
  response.statusCode = 200
  if (await update(request.body, request.params.index)) {
    let data = await read()
    response.send(data)
  }
  else {
    response.statusCode = 400
    response.send("Bad Request")
  }
})

// DELETE
app.delete('/pets/:index', async (request, response) => {

})

// CRUD MAP
/*
CONCEPT | SQL    | HTTP

create  | insert | post
read    | select | get
update  | update | put
delete  | delete | delete
*/
app.listen(3000, () => console.log("I'm listening"))

// lets see if pg works
app.get('/pg', (request, response) => {
  pool.query('SELECT * FROM pets', (err, data) => {
    if (err) throw err
    response.json(data.rows)
  })
})
