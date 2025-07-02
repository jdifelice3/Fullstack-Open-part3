const mongoose = require('mongoose')
const Person = require('./models/Person')
require('dotenv').config()
const name = process.argv[3]
const number = process.argv[4]
console.log('encoded pwd', process.argv[2])

const url = process.env.MONGODB_URI
console.log('url',url)

mongoose.set('strictQuery',false)

mongoose.connect(url)

if(process.argv.length <= 3){
    //return the list of persons in the db
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person)
        })
        mongoose.connection.close()
    })
    return
}

const person = new Person({
    id: Person.generateId(30),
    name: name,
    number: number,
})

person.save().then(result => {
    console.log('person saved!')
    mongoose.connection.close()
})