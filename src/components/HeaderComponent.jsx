import HandleSearch from "./handleSearch";

function HeaderComponent() {
  return (
    <header className='flex justify-between items-center text-white bg-black'>
      <img src="./Netflix_logo.png" alt="Logo Netflix" className="ml-5 my-5 w-[150px] h-auto" />
      <HandleSearch />
    </header>
  )
}

export default HeaderComponent