import { Link } from "react-router-dom";

function HeaderComponent() {
  return (
    <header className='flex justify-between items-center text-white bg-black'>
      <Link to={"/"}><img src="../Netflix_logo.png" alt="Logo Netflix" className="ml-5 my-5 w-[100px] md:w-[150px] h-auto" /></Link>
    </header>
  )
}

export default HeaderComponent