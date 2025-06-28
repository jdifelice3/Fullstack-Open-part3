const express = require('express')
const morgan = require("morgan")
const app = express(); 

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.use(express.json());
app.use(express.static('dist'));

morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : '';
});

// Use morgan with custom format including the body
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body', {
  
}));

app.get("/api/persons", (req, res) => {
    res.send(persons);
})

app.get("/api/person/:id", (req, res) => {
    const id = req.params.id;
    console.log("id:",id);
    const person = persons.find(person => person.id === id);
    if(person){
        res.send(person);
    } else {
        res.status(404).send(`The person with id ${id} was not found.`)
    }
    console.log("person:", person);
})  

app.delete("/api/person/:id", (req, res) => {
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

app.post("/api/persons", (req, res) => {
    console.log('request',req);
    let id = generateId();
    //console.log('req', req);
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
    console.log('body.name',body.name);
    console.log('persons', persons);
    const searchedPersonIndex = persons.findIndex(person => person.name === body.name);
    console.log('searchedPersonIndex', searchedPersonIndex);
    if(searchedPersonIndex != -1){
        return res.status(400).json({
            error: 'Person already exists.'
        })
    }

    const person = {
        id: generateId(),
        name: body.name, 
        number: body.number
    }

    persons = persons.concat(person)

    res.json(persons)
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

const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => Number(n.id)))
    : 0
  return String(maxId + 1)
}

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)