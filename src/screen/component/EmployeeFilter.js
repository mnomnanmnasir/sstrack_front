import { useState, useMemo, useEffect } from "react";
import Select from "react-select";

const EmployeeFilter = ({ employees, onFilter, showLabel = true }) => {
    // Extract unique timezones with their offsets
    // const timezones = [...new Map(
    //     employees.map(emp => [emp.timezone, {
    //         value: emp.timezone,
    //         label: `${emp.timezone} (UTC ${emp.timezoneOffset})`
    //     }])
    // ).values()];
    // ✅ Filter out employees with undefined or null timezone
    const filteredTimezones = (employees || [])
        .filter(emp => emp?.timezone && emp?.timezoneOffset !== undefined)
        .map(emp => ({
            value: emp.timezone,
            label: `${emp.timezone} (UTC ${emp.timezoneOffset >= 0 ? `+${emp.timezoneOffset}` : emp.timezoneOffset})`
        }));

    const timezones = [...new Map(filteredTimezones.map(tz => [tz.value, tz])).values()];

    // Set the first timezone as default if available
    const [selectedTimezone, setSelectedTimezone] = useState(timezones.length > 0 ? timezones[0] : null);

    // const [selectedTimezone, setSelectedTimezone] = useState(timezones.length > 0 ? timezones[0] : null);

    // Filter employees efficiently using useMemo
    const filteredEmployees = useMemo(() => {
        if (!selectedTimezone) return employees || [];
        return (employees || []).filter(emp => emp?.timezone === selectedTimezone?.value);
    }, [selectedTimezone, employees]);    
    
    // const filteredEmployees = useMemo(() => {
    //     return employees.filter(emp => emp.timezone === selectedTimezone?.value);
    // }, [selectedTimezone, employees]);

    // Call onFilter only when filteredEmployees change
    useEffect(() => {
        onFilter(filteredEmployees);
    }, [filteredEmployees]);

    return (
        <div>
            {showLabel && <p className="settingScreenshotIndividual">Please Select Timezone</p>}
            {showLabel && <div className="settingScreenshotDiv" style={{ marginTop: 10, marginBottom: 10 }}>
                {/* <p>Break time allows employees to take short pauses during their work hours.</p> */}
                <p>
                    This dropdown allows you to filter users based on their time zone.
                </p>
            </div>}
            <Select
                options={timezones}
                value={selectedTimezone}
                onChange={setSelectedTimezone}
                placeholder="Select Timezone"
                isClearable
                styles={{
                    control: (base) => ({
                        ...base,
                        width: "200px",  // ✅ Fix width to prevent resizing
                        minWidth: "200px",  // ✅ Ensure minimum width
                        maxWidth: "200px",
                        fontSize: 13  // ✅ Ensure maximum width
                    }),
                    menu: (base) => ({
                        ...base,
                        width: "200px",  // ✅ Fix dropdown menu width
                        minWidth: "200px",
                        maxWidth: "200px",
                        fontSize: 13
                    })
                }}
            />
        </div>
    );
};

export default EmployeeFilter;
