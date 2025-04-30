const mongoose = require("mongoose");

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://contactabel321:${password}@cluster0.gl6brir.mongodb.net/PhoneBookApp?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);

mongoose
  .connect(url)
  .then((result) => console.log("Connected to Mongo DB......"))
  .catch((error) => console.log("error connecting to MongoDB:", error.message));

const phonebookSchema = new mongoose.Schema({
  name: String,
  phoneNumber: Number,
});

const Phonebook = mongoose.model("Phonebooks", phonebookSchema);

const phonebook = new Phonebook({
  name: name,
  phoneNumber: Number(number),
});

console.log("Name Variable ", name);
console.log("Number Variable", number);

if (process.argv.length === 3) {
  Phonebook.find({}).then((result) => {
    result.forEach((note) => {
      console.log(note.name, note.phoneNumber);
    });
    mongoose.connection.close();
  });
} else {
  phonebook.save().then((result) => {
    console.log(
      `Added ${phonebook.name} number ${phonebook.phoneNumber} to phonebook`
    );
    mongoose.connection.close();
  });
}
