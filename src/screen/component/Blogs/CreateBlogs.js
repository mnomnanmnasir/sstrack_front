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
            formData.append("imageUrl", form.imageUrl); // 👈 attach file

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
            <div className="w-full max-w-2xl mx-auto">
                <form
                    onSubmit={handleSubmit}
                    className="bg-white p-8 rounded-lg shadow-lg space-y-6 w-full border border-gray-200"
                >
                    {/* Title */}
                    <div style={{ display: "flex", alignItems: "center", gap: "20px", margin: "20px 0" }}>
                        <label
                            style={{
                                width: "20%",
                                fontWeight: "500",
                                color: "#4F4F4F",
                                fontSize: "20px",
                                textAlign: "left",
                            }}
                        >
                            Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="Enter a blog title"
                            style={{
                                width: "70%",
                                padding: "10px",
                                border: "1px solid #E0E0E0",
                                borderRadius: "8px",
                                fontSize: "14px",
                                color: "#4F4F4F",
                            }}
                            required
                        />
                    </div>

                    {/* Short Description */}
                    <div style={{ display: "flex", alignItems: "center", gap: "20px", margin: "20px 0" }}>
                        <label
                            style={{
                                width: "20%",
                                fontWeight: "500",
                                color: "#4F4F4F",
                                fontSize: "20px",
                                textAlign: "left",
                            }}
                        >
                            Short Description
                        </label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Write a brief summary of the blog"
                            style={{
                                width: "70%",
                                padding: "10px",
                                border: "1px solid #E0E0E0",
                                borderRadius: "8px",
                                fontSize: "14px",
                                color: "#4F4F4F",
                                resize: "none",
                                height: "100px",
                            }}
                            rows={3}
                            required
                        />
                    </div>

                    {/* Main Content */}
                    <div style={{ display: "flex", alignItems: "center", gap: "20px", margin: "20px 0" }}>
                        <label
                            style={{
                                width: "20%",
                                fontWeight: "500",
                                color: "#4F4F4F",
                                fontSize: "20px",
                                textAlign: "left",
                            }}
                        >
                            Main Content
                        </label>
                        <textarea
                            name="content"
                            value={form.content}
                            onChange={handleChange}
                            placeholder="Write your blog content here..."
                            style={{
                                width: "70%",
                                padding: "10px",
                                border: "1px solid #E0E0E0",
                                borderRadius: "8px",
                                fontSize: "14px",
                                color: "#4F4F4F",
                                resize: "none",
                                height: "100px",
                            }}
                            rows={6}
                            required
                        />
                    </div>

                    {/* Tags */}
                    <div style={{ display: "flex", alignItems: "center", gap: "20px", margin: "20px 0" }}>
                        <label
                            style={{
                                width: "20%",
                                fontWeight: "500",
                                color: "#4F4F4F",
                                fontSize: "20px",
                                textAlign: "left",
                            }}
                        >
                            Tags
                        </label>
                        <input
                            type="text"
                            name="tags"
                            value={form.tags}
                            onChange={handleChange}
                            placeholder="e.g. technology, productivity, tips"
                            style={{
                                width: "70%",
                                padding: "10px",
                                border: "1px solid #E0E0E0",
                                borderRadius: "8px",
                                fontSize: "14px",
                                color: "#4F4F4F",
                            }}
                        />
                    </div>

                    {/* Image Upload */}
                    <div style={{ display: "flex", alignItems: "center", gap: "20px", margin: "20px 0" }}>
                        <label
                            style={{
                                width: "20%",
                                fontWeight: "500",
                                color: "#4F4F4F",
                                fontSize: "20px",
                                textAlign: "left",
                            }}
                        >
                            Image
                        </label>
                        <input
                            type="file"
                            name="imageUrl"
                            onChange={(e) => setForm({ ...form, imageUrl: e.target.files[0] })}
                            style={{
                                width: "70%",
                                padding: "10px",
                                border: "1px solid #E0E0E0",
                                borderRadius: "8px",
                                fontSize: "14px",
                                color: "#4F4F4F",
                            }}
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4 text-center mb-3">
                        <button
                            type="submit"
                            style={{
                                padding: "10px 20px",
                                backgroundColor: "#7FC45B",
                                color: "white",
                                border: "none",
                                borderRadius: "20px",
                                fontWeight: "600",
                                cursor: "pointer",
                            }}
                        >
                            Publish Blog
                        </button>
                    </div>
                </form>
            </div>
            {/* </div> */}
        </div>
    );
};

export default RecentBlogs;
