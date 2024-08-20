import { Link, NavLink } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Container from "../Container";

const Navbar = () => {
  const { logout, user } = useAuth();

  const navLinks = (
    <>
      <li>
        <NavLink to="/">Home</NavLink>
      </li>
      <li>
        <NavLink to="/dashboard">Dashboard</NavLink>
      </li>
    </>
  );

  return (
    <>
      <div>
        <div className="border-b">
          <Container>
            <div className="navbar bg-base-100">
              <div className="navbar-start">
                <div className="dropdown">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-ghost lg:hidden"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h8m-8 6h16"
                      />
                    </svg>
                  </div>
                  <div
                    tabIndex={0}
                    className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
                  >
                    <div className="form-control">
                      <input
                        type="text"
                        placeholder="Search"
                        className="input input-bordered w-24 md:w-auto"
                      />
                    </div>
                  </div>
                </div>
                <a className="text-2xl font-medium">Prodify</a>
              </div>
              <div className="navbar-center hidden lg:flex">
                <div className="form-control">
                  <input
                    type="text"
                    placeholder="Search"
                    className="input input-bordered w-24 md:w-auto"
                  />
                </div>
              </div>
              <div className="navbar-end">
                {!user ? (
                  <>
                    <div className="flex gap-2 ">
                      <Link to="/login">
                        <button className="btn text-white bg-[#22303c] hover:bg-[#15202b]">
                          Login
                        </button>
                      </Link>
                      <Link to="/register">
                        <button className="btn text-white bg-[#22303c] hover:bg-[#15202b] ">
                          Register
                        </button>
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="flex-none gap-2">
                    <div className="dropdown dropdown-end">
                      <div
                        tabIndex={0}
                        role="button"
                        className="btn btn-ghost btn-circle avatar"
                      >
                        <div
                          title={user?.displayName}
                          className="w-10 rounded-full"
                        >
                          <img alt="user profile photo" src={user.photoURL} />
                        </div>
                      </div>
                      <ul
                        tabIndex={0}
                        className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
                      >
                        <li>
                          <a onClick={logout}>Logout</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Container>
        </div>
      </div>
    </>
  );
};

export default Navbar;
