import { Key, LogIn, Mail, PenBox, Phone, User, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import type { user } from "~/routes/profile";
import { isAuthenticated } from "~/utils/auth";

interface login {
  email?: string;
  password?: string;
}

export default function Auth() {
  const [submitting, setSubmitting] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [setLogout] = useState(() => {
    return () => {
      localStorage.removeItem("token");
      window.location.reload();
    };
  });
  const [loginUser, setLoginUser] = useState<login>({
    email: "",
    password: "",
  });
  const [loginErrors, setLoginErrors] = useState<login>({
    email: "",
    password: "",
  });
  const [signUp, setSignUp] = useState<user>({
    firstname: "",
    lastname: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [signUpErrors, setSignUpErrors] = useState<user>({
    firstname: "",
    lastname: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleLoginSignupClick = () => {
    setShowLogin(!showLogin);
    if (!showLogin) {
      setLoginUser({
        email: "",
        password: "",
      });
      setLoginErrors({
        email: "",
        password: "",
      });
    } else {
      setSignUp({
        firstname: "",
        lastname: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setSignUpErrors({
        firstname: "",
        lastname: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    }
  };

  const handleLogin = async () => {
    const newErrors = validateLoginForm();

    if (Object.keys(newErrors).length > 0) {
      setLoginErrors(newErrors);
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${process.env.VITE_API_URL}users/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginUser),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem("token", result.token);
        toast.success(result.message, {
          duration: 4000,
          position: "top-right",
        });
        setIsModalOpen(false);
        window.location.reload();
      }

      toast.success(result.message, {
        duration: 4000,
        position: "top-right",
      });
    } catch (error) {
      toast.error("Login failed!", {
        duration: 4000,
        position: "top-right",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignup = async () => {
    const newErrors = validateSignUpForm();

    if (Object.keys(newErrors).length > 0) {
      console.error("Validation errors: ", newErrors);
      setLoginErrors(newErrors);
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(
        `${process.env.VITE_API_URL}users/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(signUp),
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success("Sign up Successful: ", {
          duration: 4000,
          position: "top-right",
        });
      } else {
        toast.error("Sign up failed!", {
          duration: 4000,
          position: "top-right",
        });
        return;
      }
    } catch (error) {
      toast.error("Sign up failed!", {
        duration: 4000,
        position: "top-right",
      });
      return;
    } finally {
      setSubmitting(false);
      setShowLogin(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (showLogin) {
      setLoginUser((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Clear error when user starts typing
      if (loginErrors) {
        setLoginErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      }
    } else {
      setSignUp((prev) => ({
        ...prev,
        [name]: value,
      }));

      //Clear error when user starts typing
      if (signUpErrors) {
        setSignUpErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      }
    }
  };

  const closeModal = () => {
    setShowLogin(true);
    setIsModalOpen(false);
    setLoginUser({
      email: "",
      password: "",
    });
    setLoginErrors({
      email: "",
      password: "",
    });
    setSignUpErrors({
      firstname: "",
      lastname: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setSignUp({
      firstname: "",
      lastname: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  const validateLoginForm = () => {
    const newErrors: login = {};

    if (!loginUser.email) {
      newErrors.email = "Email is required";
    }

    if (!loginUser.password) {
      newErrors.password = "Password is required";
    }

    return newErrors;
  };

  const validateSignUpForm = () => {
    const newErrors: user = {};

    if (!signUp.firstname) {
      newErrors.firstname = "first name is required";
    }

    if (!signUp.lastname) {
      newErrors.lastname = "last name is required";
    }

    if (signUp.password !== signUp.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!signUp.email) {
      newErrors.email = "Email is required";
    }

    if (!signUp.password) {
      newErrors.password = "Password is required";
    }

    return newErrors;
  };
  return (
    <>
      {!isAuthenticated() ? (
        <li
          onClick={() => setIsModalOpen(true)}
          className={`p-2 text-left hover:bg-gray-300 duration-300 ease-in-out hover:rounded-full w-full`}
        >
          Login/Signup
        </li>
      ) : (
        <>
          <li
            onClick={() => setLogout()}
            className={`p-2 text-left hover:bg-gray-300 duration-300 ease-in-out hover:rounded-full w-full`}
          >
            Logout
          </li>
        </>
      )}
      {isModalOpen &&
        (showLogin ? (
          <div className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-xs bg-opacity-50 z-50 transition animate-fadeIn">
            <div className="bg-white rounded-lg shadow-2xl p-6 md:w-1/3 text-center">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="font-bold text-shadow-2xl text-shadow-blue-700 bg-gradient-to-r from-blue-950 to-blue-500 text-transparent bg-clip-text text-xl p-2 text-center">
                  Login
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-4 space-y-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={loginUser.email}
                        onChange={handleInputChange}
                        className={`text-black w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                          loginErrors.email
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300"
                        }`}
                        placeholder="Email Address"
                      />
                    </div>
                    {loginErrors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {loginErrors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password *
                    </label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        name="password"
                        value={loginUser.password}
                        onChange={handleInputChange}
                        className={`text-black w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                          loginErrors.password
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300"
                        }`}
                        placeholder="Password"
                      />
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex flex-col justify-center gap-2">
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Loging in...
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleLogin}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                      >
                        <LogIn className="inline-block mr-2" />
                        login
                      </button>
                    </>
                  )}
                  <button
                    onClick={handleLoginSignupClick}
                    className="underline text-gray-400 hover:text-blue-400"
                  >
                    Don't have an account? Sign Up
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-xs bg-opacity-50 z-50 transition animate-fadeIn">
            <div className="bg-white h-4/5 rounded-lg shadow-2xl p-3 md:w-1/3 text-center overflow-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="font-bold text-shadow-2xl text-shadow-green-700 bg-gradient-to-r from-green-950 to-green-500 text-transparent bg-clip-text text-xl p-2 text-center">
                  Sign Up
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-4 space-y-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="firstname"
                        value={signUp.firstname}
                        onChange={handleInputChange}
                        className={`text-black w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200 ${
                          signUpErrors.firstname
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300"
                        }`}
                        placeholder="First Name"
                      />
                    </div>
                    {signUpErrors.firstname && (
                      <p className="mt-1 text-sm text-red-600">
                        {signUpErrors.firstname}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="lastname"
                        value={signUp.lastname}
                        onChange={handleInputChange}
                        className={`text-black w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200 ${
                          signUpErrors.lastname
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300"
                        }`}
                        placeholder="Last Name "
                      />
                    </div>
                    {signUpErrors.lastname && (
                      <p className="mt-1 text-sm text-red-600">
                        {signUpErrors.lastname}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={signUp.email}
                        onChange={handleInputChange}
                        className={`text-black w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200 ${
                          signUpErrors.email
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300"
                        }`}
                        placeholder="Email Address"
                      />
                    </div>
                    {signUpErrors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {signUpErrors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={signUp.phone}
                        onChange={handleInputChange}
                        className={`text-black w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200 ${
                          signUpErrors.phone
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300"
                        }`}
                        placeholder="Phone Number"
                      />
                    </div>
                    {signUpErrors.phone && (
                      <p className="mt-1 text-sm text-red-600">
                        {signUpErrors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password *
                    </label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        name="password"
                        value={signUp.password}
                        onChange={handleInputChange}
                        className={`text-black w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200 ${
                          signUpErrors.password
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300"
                        }`}
                        placeholder="Password"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        name="confirmPassword"
                        value={signUp.confirmPassword}
                        onChange={handleInputChange}
                        className={`text-black w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200 ${
                          signUpErrors.confirmPassword
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300"
                        }`}
                        placeholder="Confirm Password"
                      />
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex flex-col justify-center gap-2">
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Signing up...
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleSignup}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                      >
                        <PenBox className="inline-block mr-2" />
                        Sign Up
                      </button>
                    </>
                  )}
                  <button
                    onClick={handleLoginSignupClick}
                    className="underline text-gray-400 hover:text-green-400"
                  >
                    Already have an account? Login
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
    </>
  );
}
