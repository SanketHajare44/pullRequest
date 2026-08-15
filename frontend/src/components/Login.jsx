import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
    useLocation,
    useNavigate,
} from "react-router-dom";

import { addUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constant";

const Login = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [emailId, setEmailId] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const isLoginForm =
        location.pathname === "/login";

    // =====================================
    // LOGIN
    // =====================================

    const handleLogin = async () => {
        try {
            setError("");
            setLoading(true);

            const res = await axios.post(
                BASE_URL + "/login",
                {
                    emailId,
                    password,
                },
                {
                    withCredentials: true,
                }
            );

            // Save logged-in user in Redux
            dispatch(addUser(res.data));

            // Body.jsx will detect userData
            // and fetch connections
            navigate("/feed");

        } catch (err) {

            console.error(
                "Login error:",
                err
            );

            setError(
                err.response?.data?.message ||
                err.response?.data ||
                "Invalid credentials!"
            );

        } finally {
            setLoading(false);
        }
    };

    // =====================================
    // SIGNUP
    // =====================================

    const handleSignUp = async () => {
        try {
            setError("");
            setLoading(true);

            await axios.post(
                BASE_URL + "/signup",
                {
                    firstName,
                    lastName,
                    emailId,
                    password,
                },
                {
                    withCredentials: true,
                }
            );

            navigate("/login");

        } catch (err) {

            console.error(
                "Signup error:",
                err
            );

            setError(
                err.response?.data?.message ||
                err.response?.data ||
                "Signup failed!"
            );

        } finally {
            setLoading(false);
        }
    };

    // =====================================
    // FORM SUBMIT
    // =====================================

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isLoginForm) {
            handleLogin();
        } else {
            handleSignUp();
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh] px-4">

            <div className="card w-full max-w-sm bg-base-200 shadow-xl border border-base-300">

                <div className="card-body">

                    <h2 className="text-2xl font-bold text-center mb-1">
                        {isLoginForm
                            ? "Welcome back"
                            : "Create an account"}
                    </h2>

                    <p className="text-center text-sm text-base-content/60 mb-4">
                        {isLoginForm
                            ? "Log in to keep building"
                            : "Join and start connecting with developers"}
                    </p>

                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-4"
                    >

                        {!isLoginForm && (
                            <label className="form-control w-full">

                                <div className="label pb-1">
                                    <span className="label-text">
                                        First name
                                    </span>
                                </div>

                                <input
                                    type="text"
                                    className="input input-bordered w-full focus:input-primary"
                                    value={firstName}
                                    onChange={(e) =>
                                        setFirstName(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter first name"
                                />

                            </label>
                        )}

                        {!isLoginForm && (
                            <label className="form-control w-full">

                                <div className="label pb-1">
                                    <span className="label-text">
                                        Last name
                                    </span>
                                </div>

                                <input
                                    type="text"
                                    className="input input-bordered w-full focus:input-primary"
                                    value={lastName}
                                    onChange={(e) =>
                                        setLastName(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter last name"
                                />

                            </label>
                        )}

                        <label className="form-control w-full">

                            <div className="label pb-1">
                                <span className="label-text">
                                    Email
                                </span>
                            </div>

                            <input
                                type="email"
                                autoComplete="off"
                                className="input input-bordered w-full focus:input-primary"
                                value={emailId}
                                onChange={(e) =>
                                    setEmailId(
                                        e.target.value
                                    )
                                }
                                placeholder="you@example.com"
                            />

                        </label>

                        <label className="form-control w-full">

                            <div className="label pb-1">
                                <span className="label-text">
                                    Password
                                </span>
                            </div>

                            <input
                                type="password"
                                autoComplete="current-password"
                                className="input input-bordered w-full focus:input-primary"
                                value={password}
                                onChange={(e) =>
                                    setPassword(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter password"
                            />

                        </label>

                        {error && (
                            <div className="alert alert-error py-2 px-3 text-sm">
                                <span>{error}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary w-full mt-1"
                            disabled={loading}
                        >
                            {loading && (
                                <span className="loading loading-spinner loading-sm" />
                            )}

                            {isLoginForm
                                ? "Login"
                                : "Sign up"}
                        </button>

                    </form>

                    <div className="divider text-xs text-base-content/40 my-2">
                        or
                    </div>

                    <p
                        className="text-center text-sm cursor-pointer text-base-content/70 hover:text-primary transition-colors"
                        onClick={() => {

                            setError("");

                            navigate(
                                isLoginForm
                                    ? "/signup"
                                    : "/login"
                            );

                        }}
                    >
                        {isLoginForm
                            ? "New here? Create an account"
                            : "Already have an account? Log in"}
                    </p>

                </div>
            </div>
        </div>
    );
};

export default Login;