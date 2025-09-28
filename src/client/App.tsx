import { useEffect, useState } from "react";
// import siteIcon from "/site-icon.svg";
import Button from "./components/test";

const App = () => {
  const [isClicked, setIsClicked] = useState(false);

  const [data, setData] = useState<any>();

  const apiUrl = "/api/test";

  useEffect(() => {
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  const memeUrl =
    "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExNDJkNmc1bTZnZTdzdGRld2tsaDVnbHpqYXk5aTFreW4zeW1ld2hsaSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Nx0rz3jtxtEre/giphy.gif";

  console.log("Data from /api:", data);

  return (
    <div className="mx-auto">
      {/* <img src={siteIcon} alt="Site Icon" className="w-32 h-32 mx-auto my-4" /> */}
      <h1 className="text-4xl mx-auto my-4 text-center">This is test my app, lol</h1>
      <Button isClicked={isClicked} setIsClicked={setIsClicked} />
      {isClicked && <img src={memeUrl} alt="Meme" className="mx-auto my-4" />}
      {data && (
        <div className="bg-gray-100 p-4 rounded shadow-md max-w-md mx-auto my-4">
          <h2 className="text-2xl mb-2">Data from API ({apiUrl}):</h2>
          <pre className="whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default App;

