require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const Phonebook = require("./models/phonebook");
const { default: mongoose } = require("mongoose");

const app = express();

// let persons = [
//   {
//     id: "1",
//     name: "Arto Hellas",
//     number: "040-123456",
//   },
//   {
//     id: "2",
//     name: "Ada Lovelace",
//     number: "39-44-5323523",
//   },
//   {
//     id: "3",
//     name: "Dan Abramov",
//     number: "12-43-234345",
//   },
//   {
//     id: "4",
//     name: "Mary Poppendieck",
//     number: "39-23-6423122",
//   },
// ];

// const requestLogger = (request, response, next) => {
//   console.log("Method:", request.method);
//   console.log("Path:  ", request.path);
//   console.log("Body:  ", request.body);
//   console.log("---");
//   next();
// };

app.use(express.static("dist"));

app.use(express.json());
// app.use(requestLogger);
morgan.token("body", (req) => {
  return req.method === "POST" ? JSON.stringify(req.body) : "";
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.get("/info", (request, response) => {
  // console.log("Get Phonebook Info");
  response.send(
    `<p>Phonebook has info for ${Phonebook.length} people</p><p>${Date()}</p>`
  );
});

app.get("/api/persons", (request, response) => {
  Phonebook.find({}).then((persons) => {
    console.log(persons);
    response.json(persons);
  });
});

app.get("/api/persons/:id", (request, response, next) => {
  console.log("Get Single Person");
  const id = request.params.id;
  Phonebook.findById(id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      console.log(error);
      response.status(400).send({ error: "malformatted id" });
    });
});

app.get("/api/persons/:id", (request, response, next) => {
  Phonebook.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })

    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  Phonebook.findByIdAndDelete(id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
  // console.log(`Deleted ID is ${id}`, persons);
});

app.put("/api/persons/:id", (request, response, next) => {
  const { name, number } = request.body;

  Phonebook.findById(request.params.id)
    .then((person) => {
      if (!person) {
        return response.status(404).end();
      }

      person.name = name;
      person.phoneNumber = number;

      return person.save().then((updatedPerson) => {
        response.json(updatedPerson);
      });
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response, next) => {
  const body = request.body;

  // if (!body.name || !body.number) {
  //   return response.status(400).json({
  //     error: "name or number missing",
  //   });
  // }
  // if (Phonebook.find() => person.name === body.name)) {
  //   return response.status(400).json({
  //     error: "name must be unique",
  //   });
  // }

  const person = new Phonebook({
    name: body.name,
    phoneNumber: body.number,
  });

  person
    .save()
    .then((savePerson) => {
      console.log(savePerson);
      response.json(savePerson);
    })
    .catch((error) => next(error));

  // Phonebook = Phonebook.concat(person);

  // response.json(person);

  // console.log("Saved ", person);
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler);

const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
