import React, { useState } from 'react';

function DemoApp() {
    const [name, setName] = useState("");
    const [age, setAge] = useState();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [secondStep, setSecondStep] = useState(false);

    const handleNameChange = (e) => {
        setName(e.target.value)
    }
    const handleAgeChange = (e) => {
        setAge(e.target.value)
    }
    const handleEmailChange = (e) => {
        setEmail(e.target.value)
    }
    const handlePasswordChange = (e) => {
        setPassword(e.target.value)
    }

    const onSubmit = (e) => {
        e.preventDefault();
        const data = [
            {
                name: name,
                age: age,
                email: email,
                password: password
            }
        ]
        console.log("data" ,data)
    }

    const inputData = [
        {
            name: "name",
            type: "text",
            placeholder: "Enter your name",
            value:name,
            onChangefunc : (e)=>  handleNameChange(e)
        },
        {
            name: "age",
            type: "number",
            placeholder: "Enter your age",
            value:age,
            onChangefunc : (e)=>  handleAgeChange(e)
        },
        {
            name: "email",
            type: "email",
            placeholder: "Enter your email",
            value:email,
            onChangefunc : (e)=>  handleEmailChange(e)
        },
        {   
            name: "password",
            type: "password",
            placeholder: "Enter your password",
            value:password,
            onChangefunc : (e)=>  handlePasswordChange(e)
        }
    ]

    return ( 
        <div>
            {inputData.map((item)=> <input type={item.name} value={item.name} key={item.value} onChange={(e) => item.onChangefunc(e)}/>)}
            <button onClick={onSubmit}>Next</button>
        </div>
    );
}

export default DemoApp;
