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

app.listen(3000, () => console.log("I'm listening"))

// get all
app.get('/pets', async (request, response) => {
  try {
    let {rows} = await pool.query('SELECT * FROM pets')
    response.status(200).send(rows)
  } catch (err) {response.status(500).send(err)}
})
// get one
app.get('/pets/:id', async (request, response) => {
  try {
    let {rows} = await pool.query(`SELECT * FROM pets WHERE id = ${request.params.id}`)
    response.status(200).send(rows)
  } catch (err) {response.status(500).send(err)}
})
// create one
app.post('/pets', async (request, response) => {
  let {age, kind, name} = request.body
  try {
    await pool.query(`
      INSERT INTO pets (age, kind, name) VALUES (${age}, '${kind}', '${name}')
      `)
    response.status(200).send("Done")
  } catch (err) {response.status(500).send(err)}
})
// update one
app.patch('/pets/:id', async (request, response) => {
  let {age, kind, name} = request.body
  let bad = /[^a-zA-Z]+/g
  // this is ok, but crashes server
  if (bad.test(kind) || bad.test(name)) response.status(400).send("bad data")
  try {
    await pool.query(`
      UPDATE pets SET
      age = ${age},
      kind = '${kind}',
      name = '${name}'
      WHERE id = ${request.params.id}
      `)
    response.status(200).send("Done")
  } catch (err) {response.status(500).send(err)}
})
// delete one
app.delete('/pets/:id', async (request, response) => {
  try {
    await pool.query(`DELETE FROM pets WHERE id = ${request.params.id}`)
    response.status(200).send("Done")
  } catch (err) {response.status(500).send(err)}
})


// CRUD MAP
/*
CONCEPT | SQL    | HTTP

create  | insert | post
read    | select | get
update  | update | put
delete  | delete | delete
*/

// Desired functions are:
// get all
// get one
// create one
// update one
// delete one
