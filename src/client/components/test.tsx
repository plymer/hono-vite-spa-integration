const Button = () => {
  const onClick = () => {
    console.log("Button clicked!");
  };

  return <button onClick={onClick}>Button Test 1234567</button>;
};

export default Button;

