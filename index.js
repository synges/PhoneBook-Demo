const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

morgan.token('body', function getBody(req) {
	if (Object.keys(req.body).length === 0) {
		return ''
	} else {
		return JSON.stringify(req.body)
	}
})

app.use(
	morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

persons = [
	{
		name: 'Arto Hellas',
		number: '040-123456',
		id: 1,
	},
	{
		name: 'Ada Lovelace',
		number: '39-44-5323523',
		id: 2,
	},
	{
		name: 'Dan Abramov',
		number: '12-43-234345',
		id: 3,
	},
	{
		name: 'Mary Poppendieck',
		number: '39-23-6423122',
		id: 4,
	},
]

app.get('/api/persons', (request, response) => {
	response.json(persons)
})

app.get('/info', (request, response) => {
	response.send(
		`<p>Phonebook has info for ${persons.length} people</p> <p>${Date()}</p>`
	)
})

app.get('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id)
	const person = persons.find((person) => person.id === id)

	if (person) {
		response.json(person)
	} else {
		response.status(404).end()
	}
})

app.delete('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id)
	persons = persons.filter((person) => person.id !== id)

	response.status(204).end()
})

app.post('/api/persons', (request, response) => {
	const person = request.body

	if (!person.name || !person.number) {
		response.status(400).send({
			error: 'Missiang either Name or number',
		})
	}
	if (persons.find((item) => item.name === person.name)) {
		response.status(400).send({
			error: 'That Person already exists',
		})
	}
	person.id = Math.floor(Math.random() * 100) + 4

	persons = persons.concat(person)

	response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
