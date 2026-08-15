import axios from "axios";
import { useDispatch } from "react-redux";
import { BASE_URL } from "../utils/constant";
import { removeFeed } from "../utils/feedSlice";

const UserCard = ({ user }) => {
    const dispatch = useDispatch();

    const {
        _id,
        firstName,
        lastName,
        photoUrl,
        about,
        age,
        gender,
    } = user;

    const handleSendRequest = async (status, id) => {
        try {
            const res = await axios.post(
                `${BASE_URL}/request/send/${status}/${id}`,
                {},
                {
                    withCredentials: true,
                }
            );


            // Remove this user from Redux feed
            dispatch(removeFeed(id));

        } catch (err) {
            console.log("Request error:", err);
        }
    };

    return (
        <div className="card bg-base-300 w-96 h-[500px] shadow-xl overflow-hidden">

            {/* Image */}
            <figure className="w-full h-64">
                <img
                    src={photoUrl}
                    alt={`${firstName} ${lastName}`}
                    className="w-full h-full object-cover"
                />
            </figure>

            {/* Card Body */}
            <div className="card-body">

                <h2 className="card-title">
                    {firstName} {lastName}
                </h2>

                <p>
                    {age && `Age: ${age}`}
                    {age && gender && " • "}
                    {gender && `Gender: ${gender}`}
                </p>

                <p className="line-clamp-2">
                    {about}
                </p>

                {/* Buttons */}
                <div className="card-actions justify-center mt-auto gap-4">

                    <button
                        className="btn btn-error text-white border-none w-28"
                        onClick={() =>
                            handleSendRequest("ignored", _id)
                        }
                    >
                        Ignore
                    </button>

                    <button
                        className="btn bg-green-500 hover:bg-green-300 text-white border-none w-28"
                        onClick={() =>
                            handleSendRequest("interested", _id)
                        }
                    >
                        Interested
                    </button>

                </div>
            </div>
        </div>
    );
};

export default UserCard;