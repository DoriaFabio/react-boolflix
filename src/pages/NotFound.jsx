import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <main
      className="relative flex-1 flex flex-col items-center justify-center text-white px-6 text-center"
      style={{
        backgroundImage: "url('./404.jpg')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
      <div className="absolute inset-0 bg-black/70" />
      <p className="relative text-8xl font-black text-red-600 mb-4">404</p>
      <h1 className="relative text-3xl font-bold mb-2">Page not found</h1>
      <p className="relative text-gray-300 mb-8 max-w-md font-bold">
        It seems that we are a little lost too.
        The page you are looking for does not exist.
      </p>
      <button
        onClick={() => navigate("/")}
        className="relative bg-red-600 hover:bg-red-500 text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 cursor-pointer"
      >
        Back to Home
      </button>
    </main>
  );
}
