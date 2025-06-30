const mongoose = require('mongoose')
const name = process.argv[3];
const number = process.argv[4];


console.log("encoded pwd", encodeURIComponent(process.argv[2]))

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://johndifelice:${password}@cluster0.2lujjkr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const phoneBookSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Phone', phoneBookSchema);

console.log('process.argv.length',process.argv.length);
console.log(process.argv.length <=3);
if(process.argv.length <= 3){
    //return the list of persons in the db
    Person.find({}).then(result => {
        result.forEach(person => {
        console.log(person)
        })
        mongoose.connection.close();
    })
    return;
}

const person = new Person({
  name: name,
  number: number,
})

person.save().then(result => {
  console.log('person saved!')
  mongoose.connection.close()
})