import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constant";
import { addRequest, removeRequest } from "../utils/requestSlice";

const Request = () => {
    const dispatch = useDispatch();

    // Get requests from Redux store
    const requests = useSelector((store) => store.request);

    // Fetch received requests
    const fetchRequest = async () => {
        try {
            const res = await axios.get(
                BASE_URL + "/user/requests/received",
                {
                    withCredentials: true,
                }
            );

            // Store requests in Redux
            dispatch(addRequest(res.data.data));
        } catch (err) {
            console.log("Request Error:", err);
        }
    };

    const requestReview = async (status, id) => {
        try {
            const res = await axios.post(BASE_URL + "/request/reviews/" + status + "/" + id, {}, { withCredentials: true });

            //removed user that accepted or rejected fromm the redux tool
            dispatch(removeRequest(id));
        }
        catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchRequest();
    }, []);

    if (!requests) return;

    if (requests.length === 0) {
        return "No Request Found"
    }

    return (
        <div className="flex flex-col items-center gap-4 mt-8">

            {requests.map((request) => {

                const {
                    _id,
                    fromUserId,
                    status,
                } = request;

                const {
                    firstName,
                    lastName,
                    age,
                    gender,
                    about,
                    skills,
                    photoUrl,
                } = fromUserId;

                return (
                    <div
                        key={_id}
                        className="card card-side bg-base-300 shadow-xl w-96"
                    >

                        {/* Profile Image */}
                        <figure className="p-4">
                            <img
                                src={photoUrl}
                                alt={`${firstName} ${lastName}`}
                                className="w-24 h-24 rounded-full object-cover"
                            />
                        </figure>

                        {/* User Information */}
                        <div className="card-body text-left">

                            <h3 className="font-bold text-lg">
                                {firstName} {lastName}
                            </h3>

                            {/* Age and Gender */}
                            <p className="text-sm text-gray-500">
                                {age && `Age: ${age}`}
                                {age && gender && " • "}
                                {gender && `Gender: ${gender}`}
                            </p>

                            {/* About */}
                            <p>
                                {about}
                            </p>

                            {/* Skills */}
                            <p>
                                <span className="font-semibold">
                                    Skills:
                                </span>{" "}
                                {skills?.join(", ")}
                            </p>

                            {/* Request Status */}
                            <p>
                                <span className="font-semibold">
                                    Status:
                                </span>{" "}
                                {status}
                            </p>

                            {/* Buttons */}
                            <div className="card-actions justify-end">

                                <button
                                    className="btn btn-success btn-sm"
                                    onClick={() => requestReview("accepted", _id)}
                                >
                                    Accept
                                </button>

                                <button
                                    className="btn btn-error btn-sm"
                                    onClick={() => requestReview("rejected", _id)}
                                >
                                    Reject
                                </button>

                            </div>

                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Request;