import React from "react";

const SinglePerson = (props) => {
  const { person, handleDeleteData } = props;

  return (
    <div>
      <div>
        <h4>
          {person.name} {person.number}
        </h4>
        <button onClick={handleDeleteData}>delete</button>
      </div>
    </div>
  );
};

export default SinglePerson;
