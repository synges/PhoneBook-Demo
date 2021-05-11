const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();
const Person = require('./models/person');

app.use(express.static('build'));
app.use(cors());
app.use(express.json());

morgan.token('body', function getBody(req) {
	if (Object.keys(req.body).length === 0) {
		return '';
	} else {
		return JSON.stringify(req.body);
	}
});

app.use(
	morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

app.get('/api/persons', (request, response) => {
	Person.find({}).then((persons) => {
		response.json(persons);
	});
});

app.get('/info', (request, response) => {
	response.send(
		`<p>Phonebook has info from MongoDb people database</p> <p>${Date()}</p>`
	);
});

app.get('/api/persons/:id', (request, response, next) => {
	Person.findById(request.params.id)
		.then((person) => {
			response.json(person);
		})
		.catch((error) => next(error));
});

app.delete('/api/persons/:id', (request, response, next) => {
	Person.findByIdAndRemove(request.params.id)
		.then((result) => {
			response.status(204).end();
		})
		.catch((error) => next(error));
});

app.put('/api/persons/:id', (request, response, next) => {
	const body = request.body;

	const person = {
		name: body.name,
		number: body.number,
	};

	console.log(person);
	console.log(request.params.id);

	Person.findByIdAndUpdate(request.params.id, person, { new: true })
		.then((updatedPerson) => {
			response.json(updatedPerson);
		})
		.catch((error) => next(error));
});

app.post('/api/persons', (request, response) => {
	const body = request.body;

	if (body.name === undefined) {
		return response.status(400).json({ error: 'content missing' });
	}

	const person = new Person({
		name: body.name,
		number: body.number,
	});

	person
		.save()
		.then((savedPerson) => {
			response.json(savedPerson);
		})
		.catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' });
};

// handler of requests with unknown endpoint
app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
	console.log(error);
	response.status(400).send({ error: 'malformatted id' });
};

// handler of requests with result to errors
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
