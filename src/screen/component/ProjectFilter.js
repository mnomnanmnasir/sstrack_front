import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import jwtDecode from "jwt-decode";

const ProjectFilter = ({ onProjectDataFetched }) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [userType, setUserType] = useState(null);
  const [projectOptions, setProjectOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found.");
      setLoading(false);
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      setUserType(decodedToken.userType);
    } catch (error) {
      console.error("Error decoding token:", error);
      setLoading(false);
    }
  }, []);

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const headers = { Authorization: `Bearer ${token}` };
        const url = `https://myuniversallanguages.com:9093/api/v1/superAdmin/getProjects`;

        const response = await axios.patch(url, {}, { headers }); // Changed to PATCH with empty body

        console.log("Projects API Response:", response.data);

        const projects = Array.isArray(response.data) ? response.data : response.data.projects;

        if (!Array.isArray(projects)) {
          console.error("Unexpected API response format:", response.data);
          return;
        }

        const uniqueProjects = Array.from(
          new Map(
            projects.map((project) => [project.name, { label: project.name, value: project._id }])
          ).values()
        ).sort((a, b) => a.label.toLowerCase().localeCompare(b.label.toLowerCase())); // Sorting alphabetically

        setProjectOptions(uniqueProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };


    fetchProjects();
  }, []);

  // Fetch project details when a project is selected
  useEffect(() => {
    const fetchProjectData = async () => {
      if (!selectedProject) {
        onProjectDataFetched?.(undefined);
        return;
      }
    
      const token = localStorage.getItem("token");
      if (!token || !userType) {
        console.error("User type or token is missing");
        return;
      }
    
      try {
        const apiUrl =
          userType === "manager"
            ? `https://myuniversallanguages.com:9093/api/v1/manager/day?daySpecifier=this&projectId=${selectedProject.value}`
            : `https://myuniversallanguages.com:9093/api/v1/owner/day?daySpecifier=this&projectId=${selectedProject.value}`;
    
        console.log(`Fetching project data from: ${apiUrl}`);
    
        const response = await axios.patch(apiUrl, {}, {
          headers: { Authorization: `Bearer ${token}` }, // ✅ Correct placement
        });
    
        console.log("Project API Response:", response.data);
    
        onProjectDataFetched?.(response.data);
      } catch (error) {
        console.error("Error fetching project data:", error);
      }
    };
    

    fetchProjectData();
  }, [selectedProject, userType]);

  return (
    <div>
      <p className="settingScreenshotIndividual">Project filter</p>
      {loading ? (
        <p>Loading projects...</p>
      ) : (
        <Select
          options={projectOptions}
          onChange={setSelectedProject}
          placeholder="Select a Project"
          isClearable
        />
      )}
    </div>
  );
};

export default ProjectFilter;