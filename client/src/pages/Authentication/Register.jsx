import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import { useState } from "react";
import { TbFidgetSpinner } from "react-icons/tb";
import { FaSpinner } from "react-icons/fa";

const Register = () => {
  const [registerError, setRegisterError] = useState("");
  const {
    user,
    createUser,
    updateUserProfile,
    setUser,
    googleLogin,
    loading,
    setLoading,
  } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  //email password sign up
  const handleSignUp = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.fullName.value;
    const email = form.email.value;
    const password = form.password.value;
    const image = form.image.files[0];
    const formData = new FormData();
    formData.append("image", image);

    // reset error
    setRegisterError("");

    if (password.length < 6) {
      setRegisterError("Password should be at least 6 characters");
      return;
    } else if (!/[A-Z]/.test(password)) {
      setRegisterError(
        "Your password should have at least one upper case characters."
      );
      return;
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      setRegisterError(
        "Your password should have at least one special character."
      );
      return;
    }

    try {
      setLoading(true);
      // img upload
      const { data: imgData } = await axios.post(
        `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_IMGBB_API_KEY
        }`,
        formData
      );
      console.log(imgData.data.display_url);

      // registration
      const result = await createUser(email, password);
      console.log(result);

      // update profile
      await updateUserProfile(name, imgData.data.display_url);

      // jwt
      const { data: jwtData } = await axios.post(
        `${import.meta.env.VITE_API_URL}/jwt`,
        {
          email: result?.user?.email,
        },
        { withCredentials: true }
      );
      console.log(jwtData);

      navigate("/");
      toast.success("Sign Up Successful");

      // save user data
      const photo = imgData.data.display_url;
      const userData = {
        name,
        email,
        photo,
      };

      await axios.put(`${import.meta.env.VITE_API_URL}/user`, userData);
    } catch (err) {
      console.log(err);
      toast.error(err?.message);
    }
  };

  // google sign in
  const handleGoogleSignIn = async () => {
    try {
      const result = await googleLogin();
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/jwt`,
        {
          email: result?.user?.email,
        },
        { withCredentials: true }
      );
      console.log(data);
      console.log(result);
      toast.success("Sign In Successful");
      navigate("/");
    } catch (err) {
      console.log(err);
      toast.error(err?.message);
    }
  };

  return (
    <div className=" bg-base">
      <div className="container mx-auto px-2  flex min-h-[100vh]">
        <div className="w-full max-w-sm p-6 m-auto mx-auto  rounded-lg shadow-md border">
          <div>
            <h1 className="font-bold text-3xl text-center mt-4">
              Create Account
            </h1>
          </div>

          <form onSubmit={handleSignUp} className="mt-6 ">
            {/* name */}
            <div className="mb-3">
              <label className="form-control w-full">Full Name</label>
              <input
                type="text"
                placeholder="Full Name"
                name="fullName"
                required
                className="input input-bordered  block w-full px-4 py-2 mt-2"
              />
            </div>

            {/* image */}
            <div className="mb-3">
              <label className="form-control w-full">Select Image</label>
              <input
                type="file"
                name="image"
                id="image"
                accept="image/*"
                required
                className="input input-bordered  block w-full px-4 py-2 mt-2"
              />
            </div>
            {/* email */}
            <div className="mb-3">
              <label className="form-control w-full">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                className="input input-bordered  block w-full px-4 py-2 mt-2"
              />
            </div>
            {/* password */}
            <div className="mb-3">
              <div className="flex items-center justify-between">
                <label className="form-control w-full">Password</label>
              </div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                className="input input-bordered  block w-full px-4 py-2 mt-2"
              />
            </div>
            {registerError && <p className="text-red-700">{registerError}</p>}

            <div className="mt-6">
              <button
                disabled={loading}
                className="btn w-full text-white bg-[#22303c] hover:bg-[#15202b]"
              >
                {" "}
                {loading ? (
                  <FaSpinner className="animate-spin m-auto" />
                ) : (
                  "Register"
                )}
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
            Already have an account?{" "}
            <Link to="/login">
              <span className="underline underline-offset-2">Login</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
