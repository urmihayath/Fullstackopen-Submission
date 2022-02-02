import React from "react";

const PersonForm = (props) => {
  const {
    handleSaveButton,
    handleNewName,
    handleNewNumber,
    newName,
    newNumber,
  } = props;
  return (
    <form onSubmit={handleSaveButton}>
      <div>
        <input
          type="text"
          placeholder="Name"
          value={newName}
          onChange={handleNewName}
        />
      </div>

      <div>
        <input
          type="number"
          placeholder="Number"
          value={newNumber}
          onChange={handleNewNumber}
        />
      </div>

      <div>
        <button type="submit">Save</button>
      </div>
    </form>
  );
};

export default PersonForm;
