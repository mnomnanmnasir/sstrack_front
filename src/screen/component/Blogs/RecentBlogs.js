import React from "react";
// import { Button } from "@/components/ui/button";

const RecentBlogs = () => {
    const recentBlogs = [
        {
            title: "Boost Your SEO in 2025",
            description: "Learn the best SEO practices to dominate Google rankings.",
            image: "https://source.unsplash.com/featured/?seo",
        },
        {
            title: "Top 5 UI/UX Trends",
            description: "Discover the latest trends shaping modern interfaces.",
            image: "https://source.unsplash.com/featured/?uxdesign",
        },
        {
            title: "Grow with Content Marketing",
            description: "Strategies to elevate your brand through powerful content.",
            image: "https://source.unsplash.com/featured/?marketing",
        },
        {
            title: "Beginner's Guide to Freelancing",
            description: "Start your freelancing career with confidence.",
            image: "https://source.unsplash.com/featured/?freelance",
        },
    ];

    return (
        <div className="container">

            <div className="userHeader">
                <div className="headerTop">
                    <h5>Recently Added Blogs</h5>
                </div>
            </div>

            <div className="mainwrapper">
                {/* <div className="trialDiv"> */}
                {/* 
                    <h2 className="text-4xl font-extrabold text-center mb-12 bg-gradient-to-r from-[#6ABB47] to-[#2196F3] text-transparent bg-clip-text">
                        Recently Added Blogs
                    </h2> */}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                    {recentBlogs.map((blog, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition overflow-hidden flex flex-col"
                        >
                            {/* <img
                                    src={blog.image}
                                    alt={blog.title}
                                    className="w-full h-52 object-cover"
                                /> */}
                            <div className="flex flex-col flex-grow p-3">
                                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                                    {blog.title}
                                </h3>
                                <p className="text-gray-600 flex-grow">
                                    {blog.description}
                                </p>
                                <button className="mt-0 rounded-full bg-gradient-to-r from-[#6ABB47] to-[#2196F3] hover:opacity-90">
                                    Read More
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RecentBlogs;