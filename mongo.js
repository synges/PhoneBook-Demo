const mongoose = require('mongoose');

if (process.argv.length < 3) {
	console.log(
		'Please provide the password as an argument: node mongo.js <password>'
	);
	process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://synges:${password}@cluster0.yvall.mongodb.net/Phonebook?retryWrites=true&w=majority`;

mongoose.connect(url, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
	useCreateIndex: true,
});

const phoneSchema = new mongoose.Schema({
	name: String,
	number: String,
});

const Person = mongoose.model('person', phoneSchema);

if (process.argv.length == 3) {
	Person.find({}).then((result) => {
		result.forEach((person) => console.log(person));
		mongoose.connection.close();
	});
} else {
	const person = new Person({
		name: process.argv[3],
		number: process.argv[4],
	});
	person.save().then((result) => {
		console.log(`added ${person.name} number ${person.number} to phonebook`);
		mongoose.connection.close();
	});
}
