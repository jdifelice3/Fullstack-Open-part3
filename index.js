const express = require('express')
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