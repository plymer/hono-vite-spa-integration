import { useState } from "react";
import Button from "./components/test.js";

const App = () => {
  const [isClicked, setIsClicked] = useState(false);

  const memeUrl =
    "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExNDJkNmc1bTZnZTdzdGRld2tsaDVnbHpqYXk5aTFreW4yeW1ld2hsaSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Nx0rz3jtxtEre/giphy.gif";

  return (
    <div className="mx-auto">
      <h1 className="text-4xl mx-auto my-4 text-center">This is test my app, lol</h1>
      <Button isClicked={isClicked} setIsClicked={setIsClicked} />
      {isClicked && <img src={memeUrl} alt="Meme" className="mx-auto my-4" />}
    </div>
  );
};

export default App;

