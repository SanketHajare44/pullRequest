import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constant";
import { addFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";

const Feed = () => {
    const feed = useSelector((store) => store.feed);
    const dispatch = useDispatch();

    const getFeed = async () => {
        try {
            const res = await axios.get(
                BASE_URL + "/user/feed",
                {
                    withCredentials: true,
                }
            );

            dispatch(addFeed(res.data));
        } catch (err) {
            console.error("Feed Error:", err);
        }
    };

    useEffect(() => {
        if (!feed) {
            getFeed();
        }
    }, []);

    // Feed is still loading
    if (!feed) {
        return (
            <div className="flex justify-center mt-10">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    // No users available
    if (feed.length === 0) {
        return (
            <div className="flex justify-center mt-10">
                <h2 className="text-xl font-semibold">
                    No more users found
                </h2>
            </div>
        );
    }

    return (
        <div className="flex justify-center mt-10">
            <UserCard user={feed[0]} />
        </div>
    );
};

export default Feed;