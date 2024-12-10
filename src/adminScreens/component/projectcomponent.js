import React, { useEffect, useState } from "react";


function ProjectComponent(props) {
    const [data,setData] = useState({});
    const projectId = props.id;
    // console.log(projectId);
    const token = localStorage.getItem("token");
    const headers = {
        Authorization: "Bearer " + token,
    };
    
    const apiUrl = "https://myuniversallanguages.com:9093/api/v1";
    const getData = async ()=>{
     try{
        const response = await fetch(`${apiUrl}/superAdmin/${projectId}`,{
            method : "GET",
            headers,
           })
           if (response.ok) {
            const json = await response.json();
            // console.log(json);
            setData(json)
          
    
        } else {
            // console.log('Failed to create object:', response.status, response.statusText);
        }
     }catch(err){
        // console.log(err);
     }
    }
    useEffect(()=>{
        getData()
    },[projectId])
    return (
        <div >
            <div className="displayLabel">
                <input className="checkboxes" type="checkbox" checked />
                <label className="administration">{data && data?.name}</label>
            </div>
            <div className="projectsGroupsMain">
                <div className="userGroupMainDiv">
                    <div>
                        <h5 className="roleHeadingContent">Projects</h5>
                        <div className="viewTimelineButtonMain">
                            <button className="viewTimelineContent addAll">Add all</button>
                            <button className="viewTimelineContent">Remove all</button>
                        </div>
                    </div>
                    <div>
                        <p className="inputCheckbox"><input className="checkboxLarge" type="checkbox" />
                            <p>Use per project pay rates</p>
                        </p>
                    </div>
                </div>
                <div className="toggleMainContent">
                    {/* {console.log(data)} */}
                   {data && data?.userId?.map((id)=>{
                    return(
                        <div className="toggleMain">
                            {/* {console.log(id)} */}
                        <label className="switch" for="project1">
                            <input className="toggleContent" type="checkbox" id="project1" />
                            <div className="slider round"></div>
                            <label className="groupLabel" for="group">{id.name}</label>
                        </label>
                    </div>
                    )
                   })}
                   
                </div>
            </div>
        </div>
    )
}

export default ProjectComponent;