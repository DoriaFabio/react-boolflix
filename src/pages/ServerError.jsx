import { useNavigate } from "react-router-dom";

export default function ServerError() {
  const navigate = useNavigate();

  return (
    <main
      className="relative min-h-screen flex flex-col items-center justify-center text-white px-6 text-center"
      style={{
        backgroundImage: "url('./500.jpg')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <p className="relative text-8xl font-black text-red-600 mb-4 rotate-[30deg]">500</p>
      <h1 className="relative text-3xl font-bold mb-2 rotate-[4deg]">Something went wrong</h1>
      <p className="relative text-gray-300 mb-8 max-w-md font-bold rotate-[-3deg]">
        Dream Layer Failure
      </p>
      <button
        onClick={() => navigate("/")}
        className="relative bg-red-600 hover:bg-red-500 text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 cursor-pointer rotate-[-3deg]"
      >
        Back to Home
      </button>
    </main>
  );
}
