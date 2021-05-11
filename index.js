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
	console.log('not implemented');
});

app.get('/api/persons/:id', (request, response) => {
	Person.findById(request.params.id).then((person) => {
		response.json(person);
	});
});

app.delete('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id);
	persons = persons.filter((person) => person.id !== id);

	response.status(204).end();
});

app.post('/api/persons', (request, response) => {
	const person = request.body;

	if (!person.name || !person.number) {
		response.status(400).send({
			error: 'Missiang either Name or number',
		});
	}
	if (persons.find((item) => item.name === person.name)) {
		response.status(400).send({
			error: 'That Person already exists',
		});
	}
	person.id = Math.floor(Math.random() * 100) + 4;

	persons = persons.concat(person);

	response.json(person);
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
