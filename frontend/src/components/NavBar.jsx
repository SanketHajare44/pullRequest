import axios from "axios";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constant";

const NavBar = () => {
    const user = useSelector((store) => store.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const closeDropdown = () => {
        document.activeElement.blur();
    };

    const handleLogOut = async () => {
        try {
            await axios.post(
                BASE_URL + "/logout",
                {},
                { withCredentials: true }
            );

            dispatch({ type: "logout" });

            navigate("/login");

        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="navbar bg-base-100 shadow-md px-6 sticky top-0 z-50">
            {/* Logo */}
            <div className="flex-1">
                <Link to="/" className="btn btn-ghost text-2xl font-bold font-mono normal-case">
                    $ pullRequest
                </Link>
            </div>

            {/* Center Nav Links */}
            <div className="hidden sm:flex gap-1 mr-4">
                <Link to="/" className="btn btn-ghost btn-sm">
                    Home
                </Link>
                {user && (
                    <Link to="/feed" className="btn btn-ghost btn-sm">
                        Feed
                    </Link>
                )}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
                {!user ? (
                    <Link to="/login" className="btn btn-primary">
                        Login
                    </Link>
                ) : (
                    <div className="dropdown dropdown-end">
                        <div
                            tabIndex={0}
                            role="button"
                            className="flex items-center gap-3 cursor-pointer hover:bg-base-200 px-3 py-2 rounded-lg transition-colors"
                        >
                            <p className="font-medium hidden sm:block">
                                Welcome, {user.firstName}
                            </p>

                            <div className="avatar">
                                <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                    <img
                                        src={user.photoUrl}
                                        alt={user.firstName}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>

                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-lg bg-base-100 rounded-box w-56 border border-base-300 gap-1"
                        >
                            <li className="sm:hidden">
                                <Link to="/" onClick={closeDropdown}>
                                    <i className="ti ti-home text-base"></i>
                                    Home
                                </Link>
                            </li>

                            <li>
                                <Link to="/feed" onClick={closeDropdown}>
                                    <i className="ti ti-layout-grid text-base"></i>
                                    Feed
                                </Link>
                            </li>

                            <li>
                                <Link to="/profile/edit" onClick={closeDropdown}>
                                    <i className="ti ti-user text-base"></i>
                                    Edit profile
                                </Link>
                            </li>

                            <li>
                                <Link to="/connections" onClick={closeDropdown}>
                                    <i className="ti ti-users text-base"></i>
                                    Connections
                                </Link>
                            </li>

                            <li>
                                <Link to="/requests" onClick={closeDropdown}>
                                    <i className="ti ti-user-plus text-base"></i>
                                    Requests
                                </Link>
                            </li>

                            <div className="divider my-0"></div>

                            <li>
                                <button onClick={() => { closeDropdown(); handleLogOut(); }} className="text-error">
                                    <i className="ti ti-logout text-base"></i>
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NavBar;