import React, { useEffect, useState } from "react";


function Screenshot() {
    const [datas, setDatas] = useState([]);
    const [idData, setIdData] = useState()
    let token = localStorage.getItem('token');
    const [screenshot, setScreenshot] = useState([])
    const [checkDiv, setCheckDiv] = useState(false);
    const [selectedCheckboxes, setSelectedCheckboxes] = useState();
    const [frequency,setFrequency] = useState("");
    const [allowBlur,setAllowBlur] = useState("");
    const [enabled,setEnabled] = useState(true);
    let headers = {
        Authorization: 'Bearer ' + token,
    }
    const apiUrl = process.env.REACT_APP_API_URL;

    async function getData() {
        try {
            const response = await fetch(`${apiUrl}/manager/employees`, { headers })

            const json = await response.json();
            // console.log(json);
            setDatas(json)
        }
        catch (error) {
            console.log(error);

        }
    }

    useEffect(() => {
        getData();
    }, [])

    async function toggleCheckbox(id,value) {
        setIdData(id)
        if (selectedCheckboxes === id) {
            setSelectedCheckboxes('');
        } else {
            setSelectedCheckboxes(id);
        }
        try {
            const settingResponse = await fetch(`${apiUrl}/superAdmin/Settings/${id}`, { headers });
            const settingJson = await settingResponse.json();
            // console.log(settingJson);
            setScreenshot(settingJson);
        } catch (error) {
            console.error('Error fetching settings:', error);
        }

    }
    

    // console.log(frequency)
    // console.log(allowBlur)
   
   
   


    // console.log(data);
    async function patchData(){
        // console.log(idData);
        // console.log(data);
        try {
            const response = await fetch(`${apiUrl}/superAdmin/settingsE/${idData}`, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json',
                     ...headers,
                },
                body: JSON.stringify( {screenshots : {
                    frequency : frequency,
                    allowBlur : allowBlur,
                    enabled : enabled,
                }}),
            });
            console.log(response.json());
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(()=>{
        patchData();
    
    },[])
    
    return (
        <div>
            <p className="settingScreenshotHeading">Screenshots</p>
            <div className="settingScreenshotDiv">
                <p>How frequently screenshots will be taken.</p>
                <p>This number is an average since screenshots are taken at random intervals.</p>
            </div>
            <div className="takeScreenShotDiv">
                <p>
                    <input type="radio" id="test1" name="radio-group" />
                    <label for="test1">Take</label>
                </p>
                <p>
                    <select className="myselect">
                        <option>12</option>
                        <option>6</option>
                        <option>9</option>
                        <option>3</option>
                    </select>
                    <span>Screenshot per hour</span>
                </p>

                <p>
                    <select className="myselect">
                        <option>Allow blur</option>
                        <option>Blur</option>
                    </select>
                </p>
                <p>
                    <input type="radio" id="test2" name="radio-group" />
                    <label for="test2">Do not Take</label>
                </p>
            </div>
            <div>
                <p className="settingScreenshotIndividual">Individual Settings</p>
                <p className="individualSettingFont">If enabled, the individual setting will be used instead of the team setting</p>



            </div>

            <div> 
                {datas && datas?.employees?.map((name, index) => (
                    <div className="newDiv" key={index}>
                        <div className="form-group">
                            <input
                                type="checkbox"
                                checked={selectedCheckboxes === name._id}
                                onChange={() => toggleCheckbox(name._id)}
                                id={name._id} // Use a unique ID for each checkbox
                            />
                            <label htmlFor={name._id} className="tabish">{name.name}</label>
                        </div>
                        {selectedCheckboxes === name._id && (
                            <div className="takeScreenShotDivs">
                                <div className="takeScreenShotDivs">
                                    <p>
                                        <select onChange={(e)=>setFrequency(e.target.value)} key={index} className="myselect">
                                            <option>{screenshot?.employeeSettings?.screenshots?.frequency}</option>
                                            <option>6/hr</option>
                                            <option>9/hr</option>
                                            <option>3/hr</option>
                                            <option>12/hr</option>
                                        </select>
                                        <span>Screenshot per hour</span>
                                    </p>
                                    <p>
                                        <select onChange={(e)=>setAllowBlur(e.target.value == "Allow blur" ? true : false)} className="myselect">
                                            <option>{screenshot?.employeeSettings?.screenshots?.allowBlur? "Allow Blur" : "Do not Allow Blur"}</option>
                                            <option>Allow blur</option>
                                            <option>Do not Blur</option>
                                        </select>
                                    </p>
                                    <button>save</button>
                                    {/* <p>
                                        <select className="myselect">
                                            <option>{screenshot?.employeeSettings?.screenshots?.enabled? "Take" : "Do not Take"}</option>
                                            <option>Take</option>
                                            <option>Do not Take</option>
                                        </select>
                                    </p> */}
                                </div>
                            </div>
                        )}
                    </div>
                ))}



            </div>

        </div>


    )
}

export default Screenshot;