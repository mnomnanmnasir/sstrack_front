import { useState, useMemo, useEffect } from "react";
import Select from "react-select";

const EmployeeFilter = ({ employees, onFilter, showLabel = true }) => {
    // Step 1: Safely extract valid timezone entries
    const filteredTimezones = (Array.isArray(employees) ? employees : [])
        .filter(emp => emp?.timezone && emp?.timezoneOffset !== undefined)
        .map(emp => ({
            value: emp.timezone,
            label: `${emp.timezone} (UTC ${emp.timezoneOffset >= 0 ? `+${emp.timezoneOffset}` : emp.timezoneOffset})`
        }));

    // Step 2: Create unique timezone options
    const timezones = [...new Map(filteredTimezones.map(tz => [tz.value, tz])).values()];

    // Step 3: Set initial selected timezone
    const [selectedTimezone, setSelectedTimezone] = useState(timezones.length > 0 ? timezones[0] : null);

    // Step 4: Memoize filtered employees by selected timezone
    const filteredEmployees = useMemo(() => {
        const list = Array.isArray(employees) ? employees : [];
        if (!selectedTimezone) return list;
        return list.filter(emp => emp?.timezone === selectedTimezone?.value);
    }, [selectedTimezone, employees]);

    // Step 5: Call parent filter handler on change
    useEffect(() => {
        if (typeof onFilter === "function") {
            console.log("✅ Filtered employees:", filteredEmployees);  // Optional: remove in production
            onFilter(filteredEmployees);
        }
    }, [filteredEmployees, onFilter]);

    // Step 6: Render
    return (
        <div>
            {showLabel && <p className="settingScreenshotIndividual">Please Select Timezone</p>}
            {showLabel && (
                <div className="settingScreenshotDiv" style={{ marginTop: 10, marginBottom: 10 }}>
                    <p>This dropdown allows you to filter users based on their time zone.</p>
                </div>
            )}
            <Select
                options={timezones}
                value={selectedTimezone}
                onChange={setSelectedTimezone}
                placeholder="Select Timezone"
                isClearable
                styles={{
                    control: (base) => ({
                        ...base,
                        width: "200px",
                        minWidth: "200px",
                        maxWidth: "200px",
                        fontSize: 13
                    }),
                    menu: (base) => ({
                        ...base,
                        width: "200px",
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