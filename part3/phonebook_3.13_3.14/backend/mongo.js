require('dns').setServers(['1.1.1.1', '8.8.8.8']) //When using mobile hotspot
const { log } = require('console')
const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://fullstack:${password}@cluster0.vct9rrr.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`
mongoose.set('strictQuery',false)
mongoose.connect(url, { family: 4 })

const personSchema = new mongoose.Schema({ name: String, number: String })
const PersonModel = mongoose.model('Person', personSchema)
const person = new PersonModel({name: `${name}`, number: `${number}` })

if(!name && !number){
    PersonModel
    .find({})
    .then(result => {
      console.log('phonebook: ')
      result.forEach(person => {
        console.log(person.name, person.number)
      })
      mongoose.connection.close()
    })
}else{
    person
    .save()
    .then(result => {
      console.log(`added ${name} ${number} to phonebook`)
      mongoose.connection.close()
  })
}



