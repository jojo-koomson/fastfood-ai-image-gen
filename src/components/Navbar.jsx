import './styles/navbar.css'

const Navbar = () => {
  return (
    <div className="navContainer">
      <div className="logo-container">
          <h1 className="logo">FastFood.</h1>
      </div>
      
      <ul className="navList">
        <li>Home</li>
        <li>About</li>
        <li>Contact</li>
      </ul>

      <div className="get-user">
        {/* <button className='login'>Login</button>
        <button className='sign-up'>Sign Up</button> */}
      </div>
    </div>
  );
}

export default Navbar;