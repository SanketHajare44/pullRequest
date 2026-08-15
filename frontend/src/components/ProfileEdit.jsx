import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constant";
import { useNavigate } from "react-router-dom";
import UserCard from "./UserCard";

const ProfileEdit = () => {
    const user = useSelector((store) => store.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [photoUrl, setPhotoUrl] = useState("");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");
    const [about, setAbout] = useState("");
    const [skills, setSkills] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user) return;

        setFirstName(user.firstName || "");
        setLastName(user.lastName || "");
        setPhotoUrl(user.photoUrl || "");
        setAge(user.age || "");
        setGender(user.gender || "");
        setAbout(user.about || "");
        setSkills(user.skills ? user.skills.join(", ") : "");
    }, [user]);

    const handleEdit = async () => {
        try {
            setLoading(true);

            const res = await axios.patch(
                BASE_URL + "/profile/edit",
                {
                    firstName,
                    lastName,
                    photoUrl,
                    age,
                    gender,
                    about,
                    skills: skills
                        .split(",")
                        .map((skill) => skill.trim())
                        .filter((skill) => skill !== ""),
                },
                {
                    withCredentials: true,
                }
            );

            dispatch(addUser(res.data.data));

            setError("");
            setSuccess("Profile updated successfully!");

            setTimeout(() => {
                navigate("/");
            }, 2000);

        } catch (err) {
            setSuccess("");
            setError(err?.response?.data || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-start gap-10 my-10 px-6">

            {/* Edit Profile Form */}
            <div className="card card-dash bg-base-300 w-[450px] shadow-xl">
                <div className="card-body">
                    <h2 className="card-title justify-center text-2xl mb-4">
                        Edit Profile
                    </h2>

                    <div className="space-y-5">

                        {/* First Name */}
                        <label className="form-control w-full">
                            <div className="label">
                                <span className="label-text">First Name</span>
                            </div>

                            <input
                                type="text"
                                className="input input-bordered w-full"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </label>

                        {/* Last Name */}
                        <label className="form-control w-full">
                            <div className="label">
                                <span className="label-text">Last Name</span>
                            </div>

                            <input
                                type="text"
                                className="input input-bordered w-full"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </label>

                        {/* Photo URL */}
                        <label className="form-control w-full">
                            <div className="label">
                                <span className="label-text">Photo URL</span>
                            </div>

                            <input
                                type="text"
                                className="input input-bordered w-full"
                                value={photoUrl}
                                onChange={(e) => setPhotoUrl(e.target.value)}
                            />
                        </label>

                        {/* Age & Gender */}
                        <div className="flex gap-4">
                            <label className="form-control flex-1">
                                <div className="label">
                                    <span className="label-text">Age</span>
                                </div>

                                <input
                                    type="number"
                                    className="input input-bordered w-full"
                                    value={age}
                                    onChange={(e) => setAge(e.target.value)}
                                />
                            </label>

                            <label className="form-control flex-1">
                                <div className="label">
                                    <span className="label-text">Gender</span>
                                </div>

                                <select
                                    className="select select-bordered w-full"
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                >
                                    <option value="">Select</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </label>
                        </div>

                        {/* Skills */}
                        <label className="form-control w-full">
                            <div className="label">
                                <span className="label-text">Skills</span>
                            </div>

                            <input
                                type="text"
                                className="input input-bordered w-full"
                                value={skills}
                                onChange={(e) => setSkills(e.target.value)}
                                placeholder="Java, React, Node.js"
                            />
                        </label>

                        {/* About */}
                        <label className="form-control w-full">
                            <div className="label">
                                <span className="label-text">About</span>
                            </div>

                            <textarea
                                className="textarea textarea-bordered w-full h-28 resize-none"
                                value={about}
                                onChange={(e) => setAbout(e.target.value)}
                                placeholder="Write something about yourself..."
                            />
                        </label>
                    </div>

                    {success && (
                        <div className="alert alert-success mt-4">
                            <span>{success}</span>
                        </div>
                    )}

                    {error && (
                        <div className="alert alert-error mt-4">
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="card-actions justify-center mt-5">
                        <button
                            className="btn btn-primary w-full"
                            onClick={handleEdit}
                            disabled={loading}
                        >
                            {loading ? "Saving..." : "Save Profile"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Live Preview */}
            <div className="sticky top-24">
                <UserCard
                    user={{
                        ...user,
                        firstName,
                        lastName,
                        photoUrl,
                        age,
                        gender,
                        about,
                        skills: skills
                            .split(",")
                            .map((skill) => skill.trim())
                            .filter((skill) => skill !== ""),
                    }}
                />
            </div>

        </div>
    );
};

export default ProfileEdit;