import React, { useState } from "react";
import axios from "axios";

const RecentBlogs = () => {
    const [form, setForm] = useState({
        title: "",
        description: "",
        content: "",
        tags: "",
        imageUrl: "",
    });

    const [recentBlogs, setRecentBlogs] = useState([]); // 🟢 No dummy data now

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const formData = new FormData();
            formData.append("title", form.title);
            formData.append("description", form.description);
            formData.append("content", form.content);
            formData.append("tags", form.tags);
            formData.append("image", form.imageUrl); // 👈 attach file

            const res = await axios.post(
                "https://myuniversallanguages.com:9093/api/v1/superAdmin/blogs/create",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            alert("Blog created successfully!");
            setRecentBlogs([...recentBlogs, res.data.data]);
            setForm({ title: "", description: "", content: "", tags: "", imageUrl: "" });
        } catch (error) {
            console.error("Blog creation failed", error);
            alert("Error creating blog");
        }
    };

    return (
        <div className="container">
            <div className="userHeader">
                <div className="headerTop">
                    <h5>Create Blog</h5>
                </div>
            </div>

            {/* Blog Creation Form */}
            {/* <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4"> */}
            <div className="w-full max-w-2xl">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-8 space-y-4 w-full align-items-center justify-content-center">
                <div style={{ display: "flex", alignItems: "flex-start", gap: "20px" }}>
                    <label
                        className="text-center"
                    >
                        Title
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="Enter blog title"
                        className="w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Short description"
                        className="w-full border border-gray-300 p-3 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                    <textarea
                        name="content"
                        value={form.content}
                        onChange={handleChange}
                        placeholder="Full blog content"
                        className="w-full border border-gray-300 p-3 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={6}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                    <input
                        type="text"
                        name="tags"
                        value={form.tags}
                        onChange={handleChange}
                        placeholder="e.g. technology, tips"
                        className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                    <input
                        type="file"
                        name="imageUrl"
                        onChange={(e) => setForm({ ...form, imageUrl: e.target.files[0] })}
                        className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        className="w-full text-white px-4 py-3 rounded-md hover:bg-blue-700 transition"
                    >
                        Create Blog
                    </button>
                </div>
            </form>
            </div>
            {/* </div> */}
        </div>
    );
};

export default RecentBlogs;
