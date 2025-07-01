const express = require('express')
const morgan = require("morgan")
require('dotenv').config();
const Person = require('./models/Person'); 
const connectDb = require('./db');
const app = express(); 
app.use(express.json());
app.use(express.static('dist'));


connectDb(); 

morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : '';
});

// Use morgan with custom format including the body
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body', {
  
}));

app.get("/api/persons", async(req, res) => {
    try {
        console.log('in api/persons');
        console.log(typeof Person.getPersons); 
        const persons = await Person.getPersons(); 
        console.log('getPersons', persons);
        res.send(persons);
    } catch (error) {
        console.error('Error fetching persons:', error);
        res.status(500).send('Internal Server Error');
    }
})

app.get("/api/persons/:name", async(req, res) => {
    const name = req.params.name;
    console.log("name:",name);
    const person = await Person.getPersons(name); 
    if(person){
        res.send(person);
    } else {
        res.status(404).send(`The person with name ${name} was not found.`)
    }
    console.log("person:", person);
})  

app.delete("/api/persons/:id", (req, res) => {
    const idToRemove = req.params.id; 
    console.log("idToRemove", idToRemove);
    const indexToRemove = persons.findIndex(obj => obj.id === idToRemove);
    console.log("indexToRemove", indexToRemove);
    // If found, remove it
    if (indexToRemove !== -1) {
        persons.splice(indexToRemove, 1);
    }

    console.log(persons);
    res.statusMessage = `Array index not found for id=${idToRemove}`;
    res.status(204).end();
})

app.post("/api/persons", async(req, res) => {
    const body = req.body;
    console.log('body',body);

    if (!body) {
        return res.status(400).json({
            error: 'content missing'
        })
    }
    if (!body.name) {
        return res.status(400).json({
            error: 'Person name is missing.'
        })
    }
    if (!body.number) {
        return res.status(400).json({
            error: 'Person number is missing.'
        })
    }
    // console.log('body.name',body.name);
    // console.log('persons', persons);
    // const searchedPersonIndex = persons.findIndex(person => person.name === body.name);
    // console.log('searchedPersonIndex', searchedPersonIndex);
    // if(searchedPersonIndex != -1){
    //     return res.status(400).json({
    //         error: 'Person already exists.'
    //     })
    // }

    let person = new Person();
    //person.id = Person.generateId();
    person.name = body.name;
    person.number = body.number;

    return person.save().then((newPerson) => {
        res.json(newPerson)
    })
})

app.get("/info", (req ,res) => {
    let dateTime = Date();
    let html = `
        <html>
            <body>
                <div>Phone Book has info for 2 people</div>
                <div>${dateTime}</div>
            </body>
        </html>`;
    
        res.contentType = "html/text";
        res.send(html);

})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)