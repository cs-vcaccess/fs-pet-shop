const express = require('express')
const fs = require('fs')
const app = express()
app.use(express.json())
var output = "nothing"

async function read(index, next){
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
  console.log(output)
  return output

}
function create(age, kind, name){
  if (!(age && kind && name)) return false

  let obj = {
    age: age,
    kind: kind,
    name: name
  }

  fs.readFile('pets.json', 'utf-8', (err, data) => {
    if (err) throw err
    let parsed = JSON.parse(data)
    parsed.push(obj)
    let writer = fs.createWriteStream('pets.json')
    writer.write(JSON.stringify(parsed))
    writer.close()
  })
  return true
}
function update(index, age, kind, name){
  if (!(index && age && kind && name)) return false
  fs.readFile('pets.json', 'utf-8', (error, data) => {
    if (error) throw error
    obj = JSON.parse(data)
    obj[index].age = age
    obj[index].kind = kind
    obj[index].name = name
    let writer = fs.createWriteStream('pets.json')
    writer.write(JSON.stringify(obj))
    writer.close()
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

// READ and DESTROY
app.get('/:action/:index', async (request, response, next) => {
  response.statusCode = 200
  switch (true) {
    case request.params.action == 'read':
      let something = await read(request.params.index)
      response.send(something)
      break
    case request.params.action == 'destroy':
      if (destroy(request.params.index))
      response.send(read(undefined))
      break
    default:
      response.statusCode = 500
      response.send("Invalid command")
      break
   }
})

// CREATE
app.get('/:action/:a/:b/:c',  (request, response) => {
  response.statusCode = 200
  if (create(request.params.a, request.params.b, request.params.c))
  response.send(read(undefined))
  else {
    response.statusCode = 500
    response.send("Error, could not create item")
  }
})

// UPDATE
app.get('/:action/:index/:a/:b/:c',  (request, response) => {
  response.statusCode = 200
  if (update(request.params.index, request.params.a, request.params.b, request.params.c))
  response.send(read())
  else {
    response.statusCode = 500
    response.send("Error, cannot update item")
  }
})
app.listen(3000, () => console.log("I'm listening"))

// just a proof of concept
app.post('/something', (req, res) => {
  res.json(req.body)
})
