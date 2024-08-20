import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";
import axios from "axios";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

const Login = () => {
  const [registerError, setRegisterError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { googleLogin, signInUser, saveUser, setLoading } = useAuth();

  //Email Password Sing in
  const handleSignIn = async (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const pass = form.password.value;
    console.log({ email, pass });

    // reset error
    setRegisterError("");

    if (pass.length < 6) {
      setRegisterError("Password should be at least 6 characters");
      return;
    } else if (!/[A-Z]/.test(pass)) {
      setRegisterError(
        "Your password should have at least one upper case characters."
      );
      return;
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(pass)) {
      setRegisterError(
        "Your password should have at least one special character."
      );
      return;
    }

    try {
      // get block users
      const { data: blockUsers } = await axios(
        `${import.meta.env.VITE_API_URL}/block-user/${email}`
      );

      // Check if user is blocked
      if (blockUsers.includes(email)) {
        setRegisterError("Your account is blocked.");
        toast.error("Your account is blocked.");
        return;
      }

      // normal user
      const result = await signInUser(email, pass);
      console.log(result.user);
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/jwt`,
        {
          email: result?.user?.email,
        },
        { withCredentials: true }
      );
      console.log(data);

      navigate(location?.state || "/");
      toast.success("Sign In Successful");
    } catch (err) {
      console.log(err);
      toast.error(err?.message);
    }
  };

  // google sign in
  const handleGoogleSignIn = async () => {
    try {
      const result = await googleLogin();
      console.log("fffffff", result);

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/jwt`,
        {
          email: result?.user?.email,
        },
        { withCredentials: true }
      );
      console.log(data);

      toast.success("Sign In Successful");
      navigate("/");
    } catch (err) {
      console.log(err);
      toast.error(err?.message);
    }
  };

  return (
    <div className=" bg-base">
      <div className="container mx-auto px-2  flex min-h-[calc(100vh-168px)]">
        <div className="w-full max-w-sm p-6 m-auto mx-auto  rounded-lg shadow-md  border">
          <div>
            <h1 className="font-bold text-3xl text-center mt-4">
              Please Login
            </h1>
          </div>

          <form onSubmit={handleSignIn} className="mt-6">
            <div>
              <label className="form-control w-full">Email</label>
              <input
                type="email"
                name="email"
                className="input input-bordered  block w-full px-4 py-2 mt-2"
                required
              />
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between">
                <label className="form-control w-full  ">Password</label>
              </div>

              <input
                type="password"
                name="password"
                className="input input-bordered  block w-full px-4 py-2 mt-2"
                required
              />
            </div>
            {registerError && <p className="text-red-700">{registerError}</p>}

            <div className="mt-6">
              <button className="btn w-full text-white bg-[#22303c] hover:bg-[#15202b] ">
                Sign In
              </button>
            </div>
          </form>

          <div className="flex items-center justify-between mt-4">
            <span className="w-1/5 border-b dark:border-gray-600 lg:w-1/5"></span>

            <a
              href="#"
              className="text-xs text-center text-gray-500 uppercase dark:text-gray-400 hover:underline"
            >
              or login with Social Media
            </a>

            <span className="w-1/5 border-b dark:border-gray-400 lg:w-1/5"></span>
          </div>

          <div
            onClick={handleGoogleSignIn}
            className="flex items-center mt-6 -mx-2"
          >
            <button
              type="button"
              className="flex items-center justify-center w-full px-6 py-2 mx-2 text-sm font-medium text-white transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:bg-blue-400 focus:outline-none"
            >
              <svg className="w-4 h-4 mx-2 fill-current" viewBox="0 0 24 24">
                <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"></path>
              </svg>

              <span className="hidden mx-2 sm:inline">Sign in with Google</span>
            </button>
          </div>

          <p className="mt-8 text-xs font-light text-center text-gray-400">
            {" "}
            Do not have an account?{" "}
            <Link to="/register">
              <span className="underline underline-offset-2 ">Register</span>{" "}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
