import { Suspense, useState } from "react";
import Button from "@/components/test";
import { useApi } from "@/hooks/useApi";

const App = () => {
  const [isClicked, setIsClicked] = useState(false);

  const { data, fetchStatus } = useApi("test", { name: "Ryan", age: 38, active: false });

  const hasError = data.status === "error";
  const error = hasError ? data.message : null;

  const isSuccess = data.status === "success";
  const response = isSuccess ? data.response : null;

  const memeUrl =
    "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExNDJkNmc1bTZnZTdzdGRld2tsaDVnbHpqYXk5aTFreW4zeW1ld2hsaSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Nx0rz3jtxtEre/giphy.gif";

  return (
    <div className="mx-auto">
      <img src="./site-icon.svg" alt="Site Icon" className="w-32 h-32 mx-auto my-4" />
      <h1 className="text-4xl mx-auto my-4 text-center">This is test my app, lol</h1>
      <Button isClicked={isClicked} setIsClicked={setIsClicked} />
      {isClicked && <img src={memeUrl} alt="Meme" className="mx-auto my-4" />}
      <p className="text-center text-gray-600">Fetch status: {fetchStatus}</p>
      <p className="text-center">Is there an error: {hasError ? error : "Nope!"}</p>
      <Suspense fallback={<div className="text-center text-gray-600">Loading data...</div>}>
        <div className="bg-gray-100 p-4 rounded shadow-md max-w-md mx-auto my-4">
          <h2 className="text-2xl mb-2">Data from API (test):</h2>
          <pre className="whitespace-pre-wrap">{isSuccess && JSON.stringify(response, null, 2)}</pre>
        </div>
      </Suspense>
    </div>
  );
};

export default App;

