import React, { useEffect } from "react";
import NavBar from "./NavBar";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import axios from "axios";
import { BASE_URL } from "../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { addConnection } from "../utils/connectionSlice";

const Body = () => {
    const dispatch = useDispatch();

    const userData = useSelector(
        (store) => store.user
    );

    // =====================================
    // FETCH LOGGED-IN USER
    // =====================================

    const fetchUser = async () => {
        try {
            const res = await axios.get(
                BASE_URL + "/profile/view",
                {
                    withCredentials: true,
                }
            );

            dispatch(addUser(res.data));

        } catch (err) {

            if (err.response?.status !== 401) {
                console.error(
                    "Error fetching user:",
                    err
                );
            }
        }
    };

    // =====================================
    // FETCH CONNECTIONS
    // =====================================

    const fetchConnections = async () => {
        try {
            const res = await axios.get(
                BASE_URL + "/user/connections",
                {
                    withCredentials: true,
                }
            );

            dispatch(
                addConnection(res.data)
            );

        } catch (err) {

            console.error(
                "Error fetching connections:",
                err
            );
        }
    };

    // =====================================
    // FETCH USER ON INITIAL LOAD
    // =====================================

    useEffect(() => {

        if (!userData) {
            fetchUser();
        }

    }, [userData]);

    // =====================================
    // FETCH CONNECTIONS AFTER USER EXISTS
    // =====================================

    useEffect(() => {

        if (userData) {
            fetchConnections();
        }

    }, [userData]);

    return (
        <div className="flex flex-col min-h-screen">

            <NavBar />

            <main className="flex-1">
                <Outlet />
            </main>

            <Footer />

        </div>
    );
};

export default Body;