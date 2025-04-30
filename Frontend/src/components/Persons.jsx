import { useState } from "react";
import SinglePerson from "./SinglePerson";
import contactService from "../services/contact";
import Notification from "./Notification";

const Persons = ({ filter, persons }) => {
  const [message, setMessage] = useState(null);
  const [messageDesign, setMessageDesign] = useState(null);
  const handleDelete = (id, name) => {
    console.log(id);
    if (confirm(`Delete ${name}?`)) {
      contactService
        .deleteContact(id)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          setMessageDesign("error");
          setMessage(error.response.data.error);
          setTimeout(() => {
            setMessage(null);
          }, 5000);
        });
    } else {
      console.log("Cancled");
    }
  };
  return (
    <>
      <Notification design={messageDesign} message={message} />
      {filter !== ""
        ? persons
            .filter((person) =>
              person.name.toLowerCase().includes(filter.toLowerCase())
            )
            .map((person) => (
              <div key={person.id}>
                <SinglePerson
                  id={person.id}
                  name={person.name}
                  number={person.number}
                />
                <button onClick={() => handleDelete(person.id, person.name)}>
                  Delete
                </button>
              </div>
            ))
        : persons.map((person) => (
            <div key={person.id}>
              <SinglePerson
                id={person.id}
                name={person.name}
                number={person.number}
              />
              <button onClick={() => handleDelete(person.id, person.name)}>
                Delete
              </button>
            </div>
          ))}
    </>
  );
};

export default Persons;
