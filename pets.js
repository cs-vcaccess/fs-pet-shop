
const command = {
  read(){
    let index = process.argv[3]
    fs.readFile('pets.json', 'utf-8', (err, data) =>{
      if(err) throw err
      let pets = JSON.parse(data)
      if (index > data.length || index > 0)
      console.log('Usage: node pets.js read INDEX')
      if (index === undefined){
        console.log(pets)
      }else {
        console.log(pets[index])
      }
    })
  },
  create(){
    let args = process.argv.slice(3, Infinity)
    let obj = {
      age: +args[0],
      kind: args[1],
      name: args[2]
    }

    fs.readFile('pets.json', 'utf-8', (err, data) => {
      if (err) throw err
      let parsed = JSON.parse(data)
      parsed.push(obj)
      let writer = fs.createWriteStream('pets.json')
      writer.write(JSON.stringify(parsed))
      writer.close()
    })
    // how to add this to the json file?
    // fs.write(fd, string, position, encoding, callback)
  },
  update(){
    let args = process.argv.slice(3, Infinity)
    fs.readFile('pets.json', 'utf-8', (error, data) => {
      if (error) throw error
      obj = JSON.parse(data)
      obj[+args[0]].age = +args[1]
      obj[+args[0]].kind = args[2]
      obj[+args[0]].name = args[3]
      let writer = fs.createWriteStream('pets.json')
      writer.write(JSON.stringify(obj))
      writer.close()
    })
    // args[0] is index
    // args[1] is age
    // args[2] is kind
    // args[3] is name
    //Access the array at index
    //reassign the obj props
  },

  destroy(){
    let index = +process.argv[3]
    fs.readFile('pets.json', 'utf-8', (error, data) => {
      if (error) throw error
      let pets = JSON.parse(data)
      pets.splice(index, 1)
      let writer = fs.createWriteStream('pets.json')
      writer.write(JSON.stringify(pets))
      writer.close()
    })
  },
  inputGood(additional) {
    if (process.argv.length < 3 + additional) return false
    else return true
  }
}
const fs = require('fs')
const getCommand = process.argv[2];

//if command is undefined
switch (true) {
  case getCommand === 'read':
    command.read();
    break;
  case getCommand === 'create':
    if (command.inputGood(3)) command.create()
    else console.log("Usage: node pets.js create AGE KIND NAME")
    break;
  case getCommand === 'update':
    if (command.inputGood(4)) command.update()
    else console.log("Usage: node pets.js update INDEX AGE KIND NAME")
    break;
  case getCommand === 'destroy':
    if (command.inputGood(1)) command.destroy()
    else console.log("Usage: node pets.js destroy INDEX")
    break;
  default:
    console.log("Usage: node pets.js [read | create | update | destroy]")
    break;
}

iterable.forEach((item) => {
  console.log
)
