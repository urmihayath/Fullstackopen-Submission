import "./App.css";
import React from "react";
import { useState, useEffect } from "react";
import SinglePerson from "./Components/SinglePerson";
import PersonForm from "./Components/PersonForm";
import Filter from "./Components/Filter";
import contactService from "./Components/Services";
import axios from "axios";

function App() {
  const [persons, setPersons] = useState([]);
  const [fliteredData, setFilteredData] = useState([]);
  const [notification, setNotification] = useState("");
  useEffect(() => {
    contactService.getAll().then((initialContacts) => {
      setPersons(initialContacts);
      setFilteredData(initialContacts);
    });
  }, []);

  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");

  const handleNewName = (event) => {
    setNewName(event.target.value);
  };

  const handleNewNumber = (event) => {
    setNewNumber(event.target.value);
  };

  const handleSaveButton = (event) => {
    event.preventDefault();

    const newPerson = {
      name: newName,
      number: newNumber,
      id: Math.round(Math.random() * 100),
    };

    if (persons.find((person) => person.name === newName)) {
      if (window.confirm(`Do you want to replace the number?`)) {
        console.log(newName);
        const name = persons.find((p) => p.name === newName);
        console.log(name);
        const changedNum = { ...name, number: newNumber };
        console.log(changedNum);

        axios
          .put(`http://localhost:3001/persons/${name.id}`, changedNum)
          .then((response) => {
            console.log(response.data);
            setNewNumber("");
            setNewName("");
            setPersons(
              persons.map((p) => (p.name !== newName ? p : response.data))
            );
          });

        setNotification(`The number of ${newName} has been updated`);
        setTimeout(() => {
          setNotification("");
        }, 5000);
      }
    } else {
      contactService.create(newPerson).then((returnedPerson) => {
        setPersons(persons.concat(newPerson));
        setFilteredData(persons.concat(newPerson));
        setNewNumber("");
        setNewName("");

        setNotification(`${newName} Added`);
        setTimeout(() => {
          setNotification("");
        }, 5000);
      });
    }
  };

  const handleSearch = (event) => {
    let value = event.target.value.toLowerCase();
    let result = [];
    console.log(value);
    result = fliteredData.filter(
      (person) => person.name.toLowerCase().search(value) !== -1
    );
    setPersons(result);
  };

  const handleDeleteData = (id) => {
    if (window.confirm("Do you really want to delete the contact?")) {
      axios
        .delete(`http://localhost:3001/persons/${id}`)
        .then(() => {
          setPersons(persons.filter((p) => p.id !== id));
          setFilteredData(persons.filter((p) => p.id !== id));
        })
        .catch((error) => {
          setNotification("This contact is already deleted");
          setTimeout(() => {
            setNotification("");
          }, 5000);

          setPersons(persons.filter((p) => p.id !== id));
          setFilteredData(persons.filter((p) => p.id !== id));
        });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>

      <div className="search">
        <Filter handleSearch={handleSearch}></Filter>
      </div>

      <PersonForm
        handleSaveButton={handleSaveButton}
        handleNewName={handleNewName}
        handleNewNumber={handleNewNumber}
        newName={newName}
        newNumber={newNumber}
      ></PersonForm>

      <h2>Numbers</h2>
      <h1 style={{ background: "#ccc", color: "green" }}>{notification}</h1>
      {persons.map((person) => (
        <SinglePerson
          person={person}
          key={person.id}
          handleDeleteData={() => handleDeleteData(person.id)}
        ></SinglePerson>
      ))}

      <div>debug : {newName}</div>
    </div>
  );
}

export default App;
