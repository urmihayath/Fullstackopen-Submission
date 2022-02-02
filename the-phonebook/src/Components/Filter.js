import React from "react";

const Filter = (props) => {
  const { handleSearch } = props;
  return (
    <div>
      <p>
        filter shows with{" "}
        <input type="text" onChange={(event) => handleSearch(event)} />
      </p>
    </div>
  );
};

export default Filter;
