import React from 'react'

const Errors = (errors) => {
  <div>
    {errors.map((error) => (
      <li key={error} className="errors">
        {error}
      </li>
    ))}
  </div>
};

export default Errors;