const {errorHandler} = require('./errorHandlers/errorHandler');

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

app.use(errorHandler);

app.get("/api/persons", async(req, res, next) => {
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

app.get("/api/persons/:name", async(req, res, next) => {
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

app.get("/api/persons/id/:id", async(req, res, next) => {
    const id = req.params.id;
    console.log("name:",id);
    const person = await Person.getPersonById(id); 
    if(person){
        res.send(person);
    } else {
        res.status(404).send(`The person with name ${id} was not found.`)
    }
    console.log("person:", person);
})  

app.delete("/api/persons/:id", async(req, res, next) => {
    const id = req.params.id; 
    console.log("id", id);
    Person.deleteOne({ _id: id })
        .then((result) => {
            console.log('Delete result:', result);
            res.status(204).end();
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Server error');
        });
})

app.post("/api/persons", async(req, res, next) => {
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
   
    let person = new Person();
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