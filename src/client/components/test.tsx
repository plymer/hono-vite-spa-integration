const Button = ({ isClicked, setIsClicked }: { isClicked: boolean; setIsClicked: (click: boolean) => void }) => {
  return (
    <button
      className="block mx-auto rounded-md px-4 py-2 border-1 border-black cursor-pointer bg-white hover:bg-neutral-200"
      onClick={() => setIsClicked(!isClicked)}
    >
      {isClicked ? "Say goodbye?" : "Say hello?"}
    </button>
  );
};

export default Button;

