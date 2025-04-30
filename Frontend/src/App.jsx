import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
// import axios from "axios";
import contactService from "./services/contact";
import Notification from "./components/Notification";
// import { rules } from "eslint-plugin-react-refresh";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [message, setMessage] = useState(null);
  const [messageDesign, setMessageDesign] = useState(null);

  useEffect(() => {
    contactService.getAll().then((contacts) => {
      setPersons(contacts);
    });
  }, []);

  const handleNameInput = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberInput = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterInput = (event) => {
    setFilter(event.target.value);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    const newPersonObj = {
      name: newName,
      number: newNumber,
    };

    if (persons.find((person) => person.name == newPersonObj.name)) {
      // axios
      //   .post("http://localhost:3001/persons", newPersonObj)
      console.log(
        "Log find result ",
        persons.find((person) => person.name == newPersonObj.name)
      );

      if (
        confirm(
          `${newPersonObj.name} is already added to phonebook, replace the old number with the new one?`
        )
      ) {
        // contactService.updateContactNumber();
        console.log(
          "Log find result ",
          persons.find((person) => person.name == newPersonObj.name)
        );

        const result = persons.find(
          (person) => person.name == newPersonObj.name
        );

        // console.log(result.id);
        const changedContact = { ...result, number: newPersonObj.number };

        console.log("Changed Contact Number", changedContact);
        contactService.updateContactNumber(result.id, changedContact);
      } else {
        console.log("Cancle");
      }
    } else {
      contactService
        .addContact(newPersonObj)
        .then((response) => {
          console.log(response.data);
          setPersons(persons.concat(newPersonObj));
          setMessageDesign("success");
          setMessage(`Added '${newPersonObj.name}'`);
          setTimeout(() => {
            setMessage(null);
          }, 5000);
          setNewName("");
          setNewNumber("");
        })
        .catch((error) => {
          setMessageDesign("error");
          setMessage(error.response.data.error);
          setTimeout(() => {
            setMessage(null);
          }, 5000);
        });
    }
  };

  return (
    <>
      <div>
        <h2>Phonebook</h2>

        <Notification design={messageDesign} message={message} />

        <Filter value={filter} onChange={handleFilterInput} />

        <h3>Add a new</h3>

        <PersonForm
          onSubmit={handleFormSubmit}
          valueName={newName}
          onChangeName={handleNameInput}
          valueNumber={newNumber}
          onChangeNumber={handleNumberInput}
        />
        <h3>Numbers</h3>

        <Persons filter={filter} persons={persons} />
      </div>
    </>
  );
};

export default App;
