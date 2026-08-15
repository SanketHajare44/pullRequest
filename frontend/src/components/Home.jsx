import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Home = () => {
    const user = useSelector((store) => store.user);

    return (
        <div>
            {/* Hero */}
            <div className="hero min-h-[70vh] bg-base-200">
                <div className="hero-content text-center">
                    <div className="max-w-md">
                        <h1 className="text-5xl font-bold font-mono">
                            $ pullRequest
                        </h1>
                        <p className="py-6 text-base-content/70">
                            {user
                                ? `Welcome back, ${user.firstName}. Ready to find your next collaborator?`
                                : "Where developers connect, one pull request at a time. Find devs to build with, learn from, and collaborate on your next project."}
                        </p>

                        {user ? (
                            <div className="flex justify-center gap-3">
                                <Link to="/feed" className="btn btn-primary">
                                    Go to feed
                                </Link>
                            </div>
                        ) : (
                            <div className="flex justify-center gap-3">
                                <Link to="/signup" className="btn btn-primary">
                                    Get started
                                </Link>
                                <Link to="/login" className="btn btn-ghost">
                                    Login
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Features */}
            <div className="max-w-5xl mx-auto px-6 py-16">
                <h2 className="text-3xl font-bold text-center mb-12">
                    How it works
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    <div className="card bg-base-100 shadow-md border border-base-300">
                        <div className="card-body items-center text-center">
                            <div className="text-4xl mb-2">
                                <i className="ti ti-users"></i>
                            </div>
                            <h3 className="card-title">Discover devs</h3>
                            <p className="text-base-content/70 text-sm">
                                Browse developer profiles filtered by skills,
                                tech stack, and interests.
                            </p>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow-md border border-base-300">
                        <div className="card-body items-center text-center">
                            <div className="text-4xl mb-2">
                                <i className="ti ti-git-pull-request"></i>
                            </div>
                            <h3 className="card-title">Send a request</h3>
                            <p className="text-base-content/70 text-sm">
                                Found someone interesting? Send a connection
                                request and see if they merge it.
                            </p>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow-md border border-base-300">
                        <div className="card-body items-center text-center">
                            <div className="text-4xl mb-2">
                                <i className="ti ti-message-circle"></i>
                            </div>
                            <h3 className="card-title">Chat & collaborate</h3>
                            <p className="text-base-content/70 text-sm">
                                Once connected, chat directly and start
                                building something together.
                            </p>
                        </div>
                    </div>

                </div>
            </div>

            {/* CTA footer strip — only for logged-out visitors */}
            {!user && (
                <div className="bg-base-200 py-12 text-center">
                    <h2 className="text-2xl font-bold mb-4">
                        Ready to find your next collaborator?
                    </h2>
                    <Link to="/signup" className="btn btn-primary">
                        Create your profile
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Home;