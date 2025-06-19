import React, { useState, useEffect } from "react";
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
    const apiUrl = process.env.REACT_APP_API_URL;
    const [userPermissions, setUserPermissions] = useState({});
    const [blogUsers, setBlogUsers] = useState([]);

    const handlePermissionChange = async (userId, permissionType, isChecked) => {
        const token = localStorage.getItem("token");

        const updatedPermissions = {
            ...userPermissions[userId],
            [permissionType]: isChecked,
        };

        setUserPermissions((prev) => ({
            ...prev,
            [userId]: updatedPermissions,
        }));

        const payload = {
            usersData: [
                {
                    userId: userId,
                    blogsAccess: {
                        write: updatedPermissions.write,
                        update: updatedPermissions.update,
                        delete: updatedPermissions.delete,
                    },
                },
            ],
        };

        try {
            await axios.post(
                `${apiUrl}/superAdmin/blogs/access`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            console.log("✅ Blog access updated", payload);
        } catch (err) {
            console.error("❌ Failed to update blog access", err);
        }
    };

    useEffect(() => {
        const fetchBlogUsers = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(
                    `${apiUrl}/superAdmin/blogs/users`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                if (res.data?.data) {
                    const permissionsMap = {};
                    res.data.data.forEach((entry) => {
                        permissionsMap[entry.userId] = {
                            write: entry.blogsAccess?.write || false,
                            update: entry.blogsAccess?.update || false,
                            delete: entry.blogsAccess?.delete || false,
                        };
                    });

                    setUserPermissions(permissionsMap);
                    setBlogUsers(res.data.data); // still required for name/email
                }
            } catch (error) {
                console.error("Failed to fetch blog users", error);
            }
        };

        fetchBlogUsers();
    }, []);

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
                <table className="table table-bordered">
                    <thead>
                        <tr className="text-center">
                            <th>#</th>
                            <th>User Name</th>
                            <th>Email</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-center">
                        {blogUsers.filter(user => user && user.name && user.email).length > 0 ? (
                            blogUsers
                                .filter(user => user && user.name && user.email)
                                .map((user, index) => (
                                    <tr key={user._id}>
                                        <td>{index + 1}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                                {["create", "update", "delete"].map((perm) => (
                                                    <label key={perm}>
                                                        <input
                                                            type="checkbox"
                                                            checked={userPermissions[user._id]?.[perm] || false}
                                                            onChange={(e) =>
                                                                handlePermissionChange(user._id, perm, e.target.checked)
                                                            }
                                                        />{" "}
                                                        {perm.charAt(0).toUpperCase() + perm.slice(1)}
                                                    </label>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center">No blog users found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {/* </div> */}
        </div>
    );
};

export default RecentBlogs;
