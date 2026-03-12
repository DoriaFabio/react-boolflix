import { FiChevronDown } from "react-icons/fi";

export const GENRES = [
  { id: null,  name: "All" },
  { id: 28,    name: "Action" },
  { id: 12,    name: "Adventure" },
  { id: 16,    name: "Animation" },
  { id: 35,    name: "Comedy" },
  { id: 80,    name: "Crime" },
  { id: 18,    name: "Drama" },
  { id: 14,    name: "Fantasy" },
  { id: 27,    name: "Horror" },
  { id: 9648,  name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878,   name: "Sci-Fi" },
  { id: 53,    name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37,    name: "Western" },
  { id: 36,    name: "History" },
  { id: 10402, name: "Music" },
];

export default function GenreSelect({ value, onChange, large = false }) {
  return (
    <div className={`relative ${!large ? "w-full" : ""}`}>
      <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      <select
        value={String(value)}
        onChange={onChange}
        className={`
          appearance-none bg-black text-white
          border border-transparent
          focus:border-red-600
          focus:shadow-[0_0_10px_rgba(229,9,20,0.5)]
          rounded-full outline-none
          transition-all duration-300 cursor-pointer
          ${large ? "pl-5 pr-12 py-2.5 text-base min-w-[180px]" : "w-full pl-4 pr-10 py-2 text-sm"}
        `}
      >
        {GENRES.map((g) => (
          <option key={String(g.id)} value={String(g.id)}>
            {g.name}
          </option>
        ))}
      </select>
    </div>
  );
}
