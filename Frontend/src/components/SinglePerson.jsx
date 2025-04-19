const SinglePerson = ({ id, name, number }) => {
  // console.log({ key }, { name }, { number });
  return (
    <>
      <div>
        {id} {name} {number}
      </div>
    </>
  );
};

export default SinglePerson;
