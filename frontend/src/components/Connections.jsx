import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Connections = () => {
    const navigate = useNavigate();

    const connections =
        useSelector((store) => store.connection) || [];

    console.log(
        "CONNECTION PAGE:",
        connections
    );

    return (
        <div className="w-full max-w-3xl mx-auto my-10 px-4">

            {/* Heading */}
            <h2 className="text-3xl font-bold text-center mb-8">
                Connections
            </h2>

            {/* No Connections */}
            {connections.length === 0 ? (

                <p className="text-center text-gray-500">
                    You don't have any connections yet.
                </p>

            ) : (

                <div className="space-y-4">

                    {connections.map(
                        (connection) => (

                            <div
                                key={connection._id}
                                className="
                                    flex
                                    items-center
                                    gap-5
                                    p-5
                                    bg-base-200
                                    rounded-xl
                                    shadow-sm
                                "
                            >

                                {/* Profile Image */}

                                <img
                                    src={
                                        connection.photoUrl
                                    }
                                    alt={
                                        connection.firstName
                                    }
                                    className="
                                        w-20
                                        h-20
                                        rounded-full
                                        object-cover
                                    "
                                />


                                {/* User Information */}

                                <div className="flex-1">

                                    <h3 className="text-xl font-semibold">

                                        {connection.firstName}{" "}

                                        {connection.lastName}

                                    </h3>


                                    <p className="
                                        text-sm
                                        text-gray-500
                                        mt-1
                                    ">

                                        {connection.age &&
                                            `Age: ${connection.age}`}

                                        {connection.age &&
                                            connection.gender &&
                                            " • "}

                                        {connection.gender &&
                                            `Gender: ${connection.gender}`}

                                    </p>


                                    {connection.about && (

                                        <p className="
                                            text-sm
                                            mt-2
                                            line-clamp-2
                                        ">

                                            {connection.about}

                                        </p>

                                    )}

                                </div>


                                {/* Chat Button */}

                                <button
                                    className="btn btn-primary"
                                    onClick={() =>
                                        navigate(
                                            `/chat/${connection._id}`
                                        )
                                    }
                                >
                                    Chat
                                </button>

                            </div>
                        )
                    )}

                </div>
            )}

        </div>
    );
};

export default Connections;