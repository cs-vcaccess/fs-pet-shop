const express = require('express')
const fs = require('fs')
const {Pool} = require('pg')
const server = express()
const db = new Pool({
  host: 'localhost',
  user: 'ratpuppymagic',
  database: 'petshop'
})

server.use(express.json())
server.listen(3000)

const respond = (data, reply) => reply.status(200).send(data)
const say = (data, reply) => reply.status(500).send(data)
const valid = (things) => things.every(thing => !/[^a-zA-Z]+/g.test(thing))
// server.response.respond = (data) => server.response.status(200).send(data) 😢 Doesn't work

server.get('/', async (question, reply) => {
  try {
    let {rows} = await db.query('SELECT * FROM pets')
    respond(rows, reply)
  } catch (prob) { say(prob, reply) }
})
server.get('/:id', async (question, reply) => {
  const desired = question.params.id
  try {
    let {rows} = await db.query(`
      SELECT * FROM pets
      WHERE id = ${desired}
      `)
    respond(rows, reply)
  } catch (prob) { say(prob, reply) }
})
server.post('/', async (question, reply) => {
  let {age, kind, name} = question.body
  if (valid([kind, name]))
  try {
    await db.query(`
      INSERT INTO pets (age, kind, name)
      VALUES (${age}, '${kind}', '${name}')
      `)
    respond("This test worked.", reply)
  } catch (prob) { say(prob, reply) }
  else respond("Bad data", reply)
})
server.patch('/:id', async (question, reply) => {
  const desired = question.params.id
  const {age, kind, name} = question.body
  if (valid([kind, name]))
  try {
    await db.query(`
      UPDATE pets SET
      age = ${age},
      kind = '${kind}',
      name = '${name}'
      WHERE id = ${desired}
      `)
    respond("This test worked.", reply)
  } catch (prob) { say(prob, reply) }
  else respond("Bad data", reply)
})
server.delete('/:id', async (question, reply) => {
  const desired = question.params.id
  try {
    await db.query(`
      DELETE FROM pets
      WHERE id = ${desired}
      `)
    respond("This test worked.", reply)
  } catch (prob) { say(prob, reply) }
})
