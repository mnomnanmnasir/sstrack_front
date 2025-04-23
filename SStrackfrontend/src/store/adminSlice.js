import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
    name: "admin",
    initialState: {
        employess: [],
        settings: [],
        activeTab: null,
        breakTime: [], // Initial state for breakTime
        ids: []
    },
    reducers: {

        setActiveTab: (state, { payload }) => {
            return {
                ...state,
                activeTab: payload

            }
        },

        getEmployess: (state, { payload }) => {
            return {
                ...state,
                employess: payload
            }
        },

        setIds: (state, { payload }) => {
            return {
                ...state,
                ids: [...state.ids, payload]
            }
        },

        setEmployess: (state, { payload }) => {
            const findUser = state.employess.find((f) => f.effectiveSettings[payload.key] === false)
            return {
                ...state,
                employess: state.employess.map((emp) => {
                    if (emp._id === payload.id) {
                        return {
                            ...emp,
                            effectiveSettings: {
                                ...findUser?.effectiveSettings,
                                [payload.key]: !emp?.effectiveSettings[payload.key],
                            }
                        }
                    }
                    else {
                        return emp
                    }
                }),
            }
        },

        // setPunctualitySettings: (state, { payload }) => {
        //     const updatedEmployees = state.employess.map((employee) => {
        //         if (employee._id === payload.id) {
        //             return {
        //                 ...employee,
        //                 effectiveSettings: {
        //                     ...employee.effectiveSettings,
        //                     [payload.key]: payload.isSelected, // Update individualPunctuality or other keys dynamically
        //                 },
        //             };
        //         }
        //         return employee;
        //     });

        //     return {
        //         ...state,
        //         employess: updatedEmployees,
        //     };
        // },

        setPunctualitySettings: (state, { payload }) => {
            // Find the specific user to update
            const findUser = state.employess.find((employee) => employee._id === payload.id);
        
            if (!findUser) {
                console.error("User not found in Redux state!");
                return state; // Return the state unchanged if no user is found
            }
        
            // Update the specific user's settings
            const updatedEmployees = state.employess.map((employee) => {
                if (employee._id === payload.id) {
                    return {
                        ...employee,
                        effectiveSettings: {
                            ...employee?.effectiveSettings,
                            [payload.key]: payload.isSelected, // Dynamically update the toggle state
                        },
                    };
                }
                return employee;
            });
        
            return {
                ...state,
                employess: updatedEmployees,
            };
        },
        
        acceptInvitation: (state, { payload }) => {
            const userId = payload.userId;
            const userIndex = state.employess.findIndex((user) => user._id === userId);
            if (userIndex !== -1) {
                state.employess[userIndex].hasAcceptedInvitation = true;
            }
            return state;
        },


        setEmployessSetting: (state, { payload }) => {
            return {
                ...state,
                employess: state.employess.map((emp, ind) => {
                    if (emp._id === payload.id) {
                        return {
                            ...emp,
                            effectiveSettings: {
                                ...emp.effectiveSettings,
                                screenshots: {
                                    ...emp.effectiveSettings.screenshots,
                                    enabled: payload.checked,
                                    allowBlur: payload.allowBlur, // Update allowBlur based on payload
                                },
                            },
                        }
                    }
                    else {
                        return emp
                    }
                }),
            }
        },

        setEmployessSetting3: (state, { payload }) => {
            if (payload.type === "activityLevelTracking") {
                return {
                    ...state,
                    employess: state.employess.map((emp, ind) => {
                        if (emp._id === payload.id) {
                            return {
                                ...emp,
                                effectiveSettings: {
                                    ...emp.effectiveSettings,
                                    activityLevelTracking: payload.checked
                                },
                            }
                        }
                        else {
                            return emp
                        }
                    }),
                }
            }
            if (payload.type === "urlTracking") {
                return {
                    ...state,
                    employess: state.employess.map((emp, ind) => {
                        if (emp._id === payload.id) {
                            return {
                                ...emp,
                                effectiveSettings: {
                                    ...emp.effectiveSettings,
                                    urlTracking: payload.checked
                                },
                            }
                        }
                        else {
                            return emp
                        }
                    }),
                }
            }
            if (payload.type === "allowAddingOfflineTime") {
                return {
                    ...state,
                    employess: state.employess.map((emp, ind) => {
                        if (emp._id === payload.id) {
                            return {
                                ...emp,
                                effectiveSettings: {
                                    ...emp.effectiveSettings,
                                    allowAddingOfflineTime: payload.checked
                                },
                            }
                        }
                        else {
                            return emp
                        }
                    }),
                }
            }
        },
        setEmployessSetting4: (state, { payload }) => {
            return {
                ...state,
                employess: state.employess.map((emp, ind) => {
                    if (emp._id === payload.id) {
                        return {
                            ...emp,
                            effectiveSettings: {
                                ...emp.effectiveSettings,
                                screenshots: {
                                    ...emp.effectiveSettings.screenshots,
                                    allowBlur: payload.checked,
                                },
                            },
                        }
                    }
                    else {
                        return emp
                    }
                }),
            }
        },

        setEmployessSetting5: (state, { payload }) => {
            console.log(payload);
            return {
                ...state,
                employess: state.employess.map((emp, ind) => {
                    if (emp._id === payload.id) {
                        return {
                            ...emp,
                            effectiveSettings: {
                                ...emp.effectiveSettings,
                                autoPauseTrackingAfter: {
                                    ...emp?.effectiveSettings?.autoPauseTrackingAfter,
                                    [payload.key]: payload.value
                                }
                            },
                        }
                    }
                    else {
                        return emp
                    }
                }),
            }
        },

        setEmployessSetting6: (state, { payload }) => {
            return {
                ...state,
                employess: state.employess.map((emp, ind) => {
                    if (emp._id === payload.id) {
                        return {
                            ...emp,
                            effectiveSettings: {
                                ...emp.effectiveSettings,
                                urlTracking: payload.checked
                            },
                        }
                    }
                    else {
                        return emp
                    }
                }),
            }
        },

        setEmployessSetting7: (state, { payload }) => {
            return {
                ...state,
                employess: state.employess.map((emp, ind) => {
                    if (emp._id === payload.id) {
                        return {
                            ...emp,
                            effectiveSettings: {
                                ...emp.effectiveSettings,
                                allowAddingOfflineTime: payload.checked
                            },
                        }
                    }
                    else {
                        return emp
                    }
                }),
            }
        },

        setEmployessSetting2: (state, { payload }) => {
            return {
                ...state,
                employess: state.employess.map((emp, ind) => {
                    if (emp._id === payload.id) {
                        return {
                            ...emp,
                            effectiveSettings: {
                                ...emp.effectiveSettings,
                                screenshots: {
                                    ...emp.effectiveSettings.screenshots,
                                    frequency: `${payload.frequency}/hr`,
                                },
                            },
                        }
                    }
                    else {
                        return emp
                    }
                }),
            }
        },

        setEmployessSettings: (state, { payload }) => {
            return {
                ...state,
                settings: [...state.settings, payload]
            }
        },

        setAllUserSetting: (state, { payload }) => {
            return {
                ...state,
                employess: state.employess.map((emp) => {
                    if (emp?.effectiveSettings?.individualss === false) {
                        return {
                            ...emp,
                            effectiveSettings: {
                                individualss: false,
                                screenshots: {
                                    ...emp?.effectiveSettings?.screenshots,
                                    enabled: payload.checked,
                                },
                                userId: emp._id,
                            },
                        }
                    } else {
                        return emp;
                    }
                }),
            };
        },
        setAllUserSetting2: (state, { payload }) => {
            return {
                ...state,
                employess: state.employess.map((emp) => {
                    if (emp?.effectiveSettings?.individualss === false) {
                        return {
                            ...emp,
                            effectiveSettings: {
                                individualss: false,
                                screenshots: {
                                    ...emp?.effectiveSettings?.screenshots,
                                    frequency: `${payload.value}/hr`,
                                },
                                userId: emp._id,
                                urlTracking: false,
                            },
                        }
                    } else {
                        return emp;
                    }
                }),
            };
        },
        setAllUserSetting3: (state, { payload }) => {
            console.log(payload.value);
            return {
                ...state,
                employess: state.employess.map((emp) => {
                    if (emp?.effectiveSettings?.individualss === false) {
                        return {
                            ...emp,
                            effectiveSettings: {
                                ...emp?.effectiveSettings,
                                individualss: false,
                                screenshots: {
                                    ...emp?.effectiveSettings?.screenshots,
                                    allowBlur: payload.value,
                                },
                                userId: emp._id,
                            },
                        }
                    } else {
                        return emp;
                    }
                }),
            };
        },
        setAllUserSetting4: (state, { payload }) => {
            console.log(payload);
            if (payload.type === "screenshotEnable") {
                return {
                    ...state,
                    employess: state.employess.map((emp) => {
                        if (emp?.effectiveSettings?.individualss === false) {
                            return {
                                ...emp,
                                effectiveSettings: {
                                    individualss: false,
                                    screenshots: {
                                        ...emp?.effectiveSettings?.screenshots,
                                        enabled: payload.value,
                                    },
                                    userId: emp._id,
                                },
                            }
                        } else {
                            return emp;
                        }
                    }),
                };
            }
            if (payload.type === "activityLevel") {
                return {
                    ...state,
                    employess: state.employess.map((emp) => {
                        if (emp?.effectiveSettings?.individualAct === false) {
                            return {
                                ...emp,
                                effectiveSettings: {
                                    ...emp?.effectiveSettings,
                                    individualAct: false,
                                    activityLevelTracking: payload.value,
                                },
                            }
                        } else {
                            return emp;
                        }
                    }),
                };
            }
            if (payload.type === "urlTracking") {
                return {
                    ...state,
                    employess: state.employess.map((emp) => {
                        if (emp?.effectiveSettings?.individualUrl === false) {
                            return {
                                ...emp,
                                effectiveSettings: {
                                    ...emp?.effectiveSettings,
                                    individualUrl: false,
                                    urlTracking: payload.value,
                                },
                            }
                        } else {
                            return emp;
                        }
                    }),
                };
            }
            if (payload.type === "allowAddingOfflineTime") {
                return {
                    ...state,
                    employess: state.employess.map((emp) => {
                        if (emp?.effectiveSettings?.individualOffline === false) {
                            return {
                                ...emp,
                                effectiveSettings: {
                                    ...emp?.effectiveSettings,
                                    individualOffline: false,
                                    allowAddingOfflineTime: payload.value,
                                },
                            }
                        } else {
                            return emp;
                        }
                    }),
                };
            }
        },
        setAllUserSetting5: (state, { payload }) => {
            return {
                ...state,
                employess: state.employess.map((emp) => {
                    if (emp?.effectiveSettings?.individual === false) {
                        return {
                            ...emp,
                            effectiveSettings: {
                                ...emp?.effectiveSettings,
                                urlTracking: payload,
                            },
                        }
                    } else {
                        return emp;
                    }
                }),
            };
        },
        setAllUserSetting6: (state, { payload }) => {
            return {
                ...state,
                employess: state.employess.map((emp) => {
                    if (emp?.effectiveSettings?.individualAutoPause === false) {
                        return {
                            ...emp,
                            effectiveSettings: {
                                ...emp?.effectiveSettings,
                                allowAddingOfflineTime: payload,
                                userId: emp._id,
                            },
                        }
                    }
                    else {
                        return emp;
                    }
                }),
            };
        },
        setAllUserSetting7: (state, { payload }) => {
            return {
                ...state,
                employess: state.employess.map((emp) => {
                    if (emp?.effectiveSettings?.individualAutoPause === false) {
                        return {
                            ...emp,
                            effectiveSettings: {
                                ...emp?.effectiveSettings,
                                individualAutoPause: false,
                                autoPauseTrackingAfter: {
                                    ...emp?.effectiveSettings?.autoPauseTrackingAfter,
                                    pause: payload,
                                },
                                userId: emp._id,
                            },
                        }
                    }
                    else {
                        return emp;
                    }
                }),
            };
        },
        setAllUserSetting8: (state, { payload }) => {
            return {
                ...state,
                employess: state.employess.map((emp) => {
                    if (emp?.effectiveSettings?.individualAutoPause === false) {
                        return {
                            ...emp,
                            effectiveSettings: {
                                ...emp?.effectiveSettings,
                                individualAutoPause: false,
                                autoPauseTrackingAfter: {
                                    ...emp?.effectiveSettings?.autoPauseTrackingAfter,
                                    frequency: payload,
                                },
                                userId: emp._id,
                            },
                        }
                    }
                    else {
                        return emp;
                    }
                }),
            };
        },
        updateEmployeeSettings(state, action) {
            const { id, isSelected, key } = action.payload;
        
            // Ensure immutability by creating a new array for employees
            state.employess = state.employess.map((emp) =>
                emp._id === id
                    ? {
                        ...emp, // Spread existing employee data
                        effectiveSettings: {
                            ...emp.effectiveSettings, // Spread existing settings
                            [key]: isSelected, // Update the specific key
                        },
                    }
                    : emp // Leave other employees unchanged
            );
        }
        

    },
})

export const { getEmployess,
    setEmployess,
    setActiveTab,
    setEmployessSetting,
    setEmployessSetting2,
    setEmployessSetting3,
    setEmployessSetting4,
    setEmployessSetting5,
    setEmployessSetting6,
    setEmployessSetting7,
    setAllUserSetting,
    setAllUserSetting2,
    setAllUserSetting3,
    setAllUserSetting4,
    setAllUserSetting5,
    setAllUserSetting6,
    setAllUserSetting7,
    setAllUserSetting8,
    updateEmployeeSettings,
    setIds,
    setEmployessSettings,
    setPunctualitySettings

} = adminSlice.actions

export default adminSlice.reducer



// import { createSlice } from "@reduxjs/toolkit";

// const adminSlice = createSlice({
//     name: "admin",
//     initialState: {
//         employess: [],
//         // employees: [],
//         breakTime: [], // Initial state for breakTime
//         settings: [],
//         activeTab: null,
//         ids: []
//     },
//     reducers: {

//         setActiveTab: (state, { payload }) => {
//             return {
//                 ...state,
//                 activeTab: payload

//             }
//         },

//         getEmployess: (state, { payload }) => {
//             return {
//                 ...state,
//                 employess: payload
//             }
//         },

//         setIds: (state, { payload }) => {
//             return {
//                 ...state,
//                 ids: [...state.ids, payload]
//             }
//         },


//         // ///////////// update the redux state ///////////////
//         // setEmployess: (state, { payload }) => {
//         //     // const findUser = state.employess.find((f) => f.effectiveSettings[payload.key] === false)

//         //     return {
//         //         ...state,
//         //         employess: state.employess.map((emp) => {
//         //             if (emp._id === payload.id) {
//         //                 return {
//         //                     ...emp,
//         //                     effectiveSettings: {
//         //                         ...emp.effectiveSettings,
//         //                         [payload.key]: payload.isSelected, // Set to the new state directly
//         //                     },
//         //                 };
//         //             }
//         //             return emp;
//         //         }),
//         //     };
//         // },
        // setEmployess: (state, { payload }) => {
        //     const findUser = state.employess.find((f) => f.effectiveSettings[payload.key] === false)
        //     return {
        //         ...state,
        //         employess: state.employess.map((emp) => {
        //             if (emp._id === payload.id) {
        //                 return {
        //                     ...emp,
        //                     effectiveSettings: {
        //                         ...findUser?.effectiveSettings,
        //                         [payload.key]: !emp?.effectiveSettings[payload.key],
        //                     }
        //                 }
        //             }
        //             else {
        //                 return emp
        //             }
        //         }),
        //     }
        // },
        // updateEmployeeSettings(state, action) {
        //     const { id, settings } = action.payload;
        //     const employee = state.employess.find(emp => emp._id === id);
        //     if (employee) {
        //         employee.effectiveSettings = {
        //             ...employee.effectiveSettings,
        //             ...settings,
        //         };
        //     }
        // },
//         ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//         acceptInvitation: (state, { payload }) => {
//             const userId = payload.userId;
//             const userIndex = state.employess.findIndex((user) => user._id === userId);
//             if (userIndex !== -1) {
//                 state.employess[userIndex].hasAcceptedInvitation = true;
//             }
//             return state;
//         },


//         setEmployessSetting: (state, { payload }) => {
//             return {
//                 ...state,
//                 employess: state.employess.map((emp, ind) => {
//                     if (emp._id === payload.id) {
//                         return {
//                             ...emp,
//                             effectiveSettings: {
//                                 ...emp.effectiveSettings,
//                                 screenshots: {
//                                     ...emp.effectiveSettings.screenshots,
//                                     enabled: payload.checked,
//                                     allowBlur: payload.allowBlur, // Update allowBlur based on payload
//                                 },
//                             },
//                         }
//                     }
//                     else {
//                         return emp
//                     }
//                 }),
//             }
//         },

//         setEmployessSetting3: (state, { payload }) => {
//             if (payload.type === "activityLevelTracking") {
//                 return {
//                     ...state,
//                     employess: state.employess.map((emp, ind) => {
//                         if (emp._id === payload.id) {
//                             return {
//                                 ...emp,
//                                 effectiveSettings: {
//                                     ...emp.effectiveSettings,
//                                     activityLevelTracking: payload.checked
//                                 },
//                             }
//                         }
//                         else {
//                             return emp
//                         }
//                     }),
//                 }
//             }
//             if (payload.type === "urlTracking") {
//                 return {
//                     ...state,
//                     employess: state.employess.map((emp, ind) => {
//                         if (emp._id === payload.id) {
//                             return {
//                                 ...emp,
//                                 effectiveSettings: {
//                                     ...emp.effectiveSettings,
//                                     urlTracking: payload.checked
//                                 },
//                             }
//                         }
//                         else {
//                             return emp
//                         }
//                     }),
//                 }
//             }
//             if (payload.type === "allowAddingOfflineTime") {
//                 return {
//                     ...state,
//                     employess: state.employess.map((emp, ind) => {
//                         if (emp._id === payload.id) {
//                             return {
//                                 ...emp,
//                                 effectiveSettings: {
//                                     ...emp.effectiveSettings,
//                                     allowAddingOfflineTime: payload.checked
//                                 },
//                             }
//                         }
//                         else {
//                             return emp
//                         }
//                     }),
//                 }
//             }
//         },
//         setEmployessSetting4: (state, { payload }) => {
//             return {
//                 ...state,
//                 employess: state.employess.map((emp, ind) => {
//                     if (emp._id === payload.id) {
//                         return {
//                             ...emp,
//                             effectiveSettings: {
//                                 ...emp.effectiveSettings,
//                                 screenshots: {
//                                     ...emp.effectiveSettings.screenshots,
//                                     allowBlur: payload.checked,
//                                 },
//                             },
//                         }
//                     }
//                     else {
//                         return emp
//                     }
//                 }),
//             }
//         },

//         setEmployessSetting5: (state, { payload }) => {
//             console.log(payload);
//             return {
//                 ...state,
//                 employess: state.employess.map((emp, ind) => {
//                     if (emp._id === payload.id) {
//                         return {
//                             ...emp,
//                             effectiveSettings: {
//                                 ...emp.effectiveSettings,
//                                 autoPauseTrackingAfter: {
//                                     ...emp?.effectiveSettings?.autoPauseTrackingAfter,
//                                     [payload.key]: payload.value
//                                 }
//                             },
//                         }
//                     }
//                     else {
//                         return emp
//                     }
//                 }),
//             }
//         },

//         setEmployessSetting6: (state, { payload }) => {
//             return {
//                 ...state,
//                 employess: state.employess.map((emp, ind) => {
//                     if (emp._id === payload.id) {
//                         return {
//                             ...emp,
//                             effectiveSettings: {
//                                 ...emp.effectiveSettings,
//                                 urlTracking: payload.checked
//                             },
//                         }
//                     }
//                     else {
//                         return emp
//                     }
//                 }),
//             }
//         },

//         setEmployessSetting7: (state, { payload }) => {
//             return {
//                 ...state,
//                 employess: state.employess.map((emp, ind) => {
//                     if (emp._id === payload.id) {
//                         return {
//                             ...emp,
//                             effectiveSettings: {
//                                 ...emp.effectiveSettings,
//                                 allowAddingOfflineTime: payload.checked
//                             },
//                         }
//                     }
//                     else {
//                         return emp
//                     }
//                 }),
//             }
//         },

//         setEmployessSetting2: (state, { payload }) => {
//             return {
//                 ...state,
//                 employess: state.employess.map((emp, ind) => {
//                     if (emp._id === payload.id) {
//                         return {
//                             ...emp,
//                             effectiveSettings: {
//                                 ...emp.effectiveSettings,
//                                 screenshots: {
//                                     ...emp.effectiveSettings.screenshots,
//                                     frequency: `${payload.frequency}/hr`,
//                                 },
//                             },
//                         }
//                     }
//                     else {
//                         return emp
//                     }
//                 }),
//             }
//         },

//         setEmployessSettings: (state, { payload }) => {
//             return {
//                 ...state,
//                 settings: [...state.settings, payload]
//             }
//         },

//         setAllUserSetting: (state, { payload }) => {
//             return {
//                 ...state,
//                 employess: state.employess.map((emp) => {
//                     if (emp?.effectiveSettings?.individualss === false) {
//                         return {
//                             ...emp,
//                             effectiveSettings: {
//                                 individualss: false,
//                                 screenshots: {
//                                     ...emp?.effectiveSettings?.screenshots,
//                                     enabled: payload.checked,
//                                 },
//                                 userId: emp._id,
//                             },
//                         }
//                     } else {
//                         return emp;
//                     }
//                 }),
//             };
//         },
//         setAllUserSetting2: (state, { payload }) => {
//             return {
//                 ...state,
//                 employess: state.employess.map((emp) => {
//                     if (emp?.effectiveSettings?.individualss === false) {
//                         return {
//                             ...emp,
//                             effectiveSettings: {
//                                 individualss: false,
//                                 screenshots: {
//                                     ...emp?.effectiveSettings?.screenshots,
//                                     frequency: `${payload.value}/hr`,
//                                 },
//                                 userId: emp._id,
//                                 urlTracking: false,
//                             },
//                         }
//                     } else {
//                         return emp;
//                     }
//                 }),
//             };
//         },
//         setAllUserSetting3: (state, { payload }) => {
//             console.log(payload.value);
//             return {
//                 ...state,
//                 employess: state.employess.map((emp) => {
//                     if (emp?.effectiveSettings?.individualss === false) {
//                         return {
//                             ...emp,
//                             effectiveSettings: {
//                                 ...emp?.effectiveSettings,
//                                 individualss: false,
//                                 screenshots: {
//                                     ...emp?.effectiveSettings?.screenshots,
//                                     allowBlur: payload.value,
//                                 },
//                                 userId: emp._id,
//                             },
//                         }
//                     } else {
//                         return emp;
//                     }
//                 }),
//             };
//         },
//         setAllUserSetting4: (state, { payload }) => {
//             console.log(payload);
//             if (payload.type === "screenshotEnable") {
//                 return {
//                     ...state,
//                     employess: state.employess.map((emp) => {
//                         if (emp?.effectiveSettings?.individualss === false) {
//                             return {
//                                 ...emp,
//                                 effectiveSettings: {
//                                     individualss: false,
//                                     screenshots: {
//                                         ...emp?.effectiveSettings?.screenshots,
//                                         enabled: payload.value,
//                                     },
//                                     userId: emp._id,
//                                 },
//                             }
//                         } else {
//                             return emp;
//                         }
//                     }),
//                 };
//             }
//             if (payload.type === "activityLevel") {
//                 return {
//                     ...state,
//                     employess: state.employess.map((emp) => {
//                         if (emp?.effectiveSettings?.individualAct === false) {
//                             return {
//                                 ...emp,
//                                 effectiveSettings: {
//                                     ...emp?.effectiveSettings,
//                                     individualAct: false,
//                                     activityLevelTracking: payload.value,
//                                 },
//                             }
//                         } else {
//                             return emp;
//                         }
//                     }),
//                 };
//             }
//             if (payload.type === "urlTracking") {
//                 return {
//                     ...state,
//                     employess: state.employess.map((emp) => {
//                         if (emp?.effectiveSettings?.individualUrl === false) {
//                             return {
//                                 ...emp,
//                                 effectiveSettings: {
//                                     ...emp?.effectiveSettings,
//                                     individualUrl: false,
//                                     urlTracking: payload.value,
//                                 },
//                             }
//                         } else {
//                             return emp;
//                         }
//                     }),
//                 };
//             }
//             if (payload.type === "allowAddingOfflineTime") {
//                 return {
//                     ...state,
//                     employess: state.employess.map((emp) => {
//                         if (emp?.effectiveSettings?.individualOffline === false) {
//                             return {
//                                 ...emp,
//                                 effectiveSettings: {
//                                     ...emp?.effectiveSettings,
//                                     individualOffline: false,
//                                     allowAddingOfflineTime: payload.value,
//                                 },
//                             }
//                         } else {
//                             return emp;
//                         }
//                     }),
//                 };
//             }
//         },
//         setAllUserSetting5: (state, { payload }) => {
//             return {
//                 ...state,
//                 employess: state.employess.map((emp) => {
//                     if (emp?.effectiveSettings?.individual === false) {
//                         return {
//                             ...emp,
//                             effectiveSettings: {
//                                 ...emp?.effectiveSettings,
//                                 urlTracking: payload,
//                             },
//                         }
//                     } else {
//                         return emp;
//                     }
//                 }),
//             };
//         },
//         setAllUserSetting6: (state, { payload }) => {
//             return {
//                 ...state,
//                 employess: state.employess.map((emp) => {
//                     if (emp?.effectiveSettings?.individualAutoPause === false) {
//                         return {
//                             ...emp,
//                             effectiveSettings: {
//                                 ...emp?.effectiveSettings,
//                                 allowAddingOfflineTime: payload,
//                                 userId: emp._id,
//                             },
//                         }
//                     }
//                     else {
//                         return emp;
//                     }
//                 }),
//             };
//         },
//         setAllUserSetting7: (state, { payload }) => {
//             return {
//                 ...state,
//                 employess: state.employess.map((emp) => {
//                     if (emp?.effectiveSettings?.individualAutoPause === false) {
//                         return {
//                             ...emp,
//                             effectiveSettings: {
//                                 ...emp?.effectiveSettings,
//                                 individualAutoPause: false,
//                                 autoPauseTrackingAfter: {
//                                     ...emp?.effectiveSettings?.autoPauseTrackingAfter,
//                                     pause: payload,
//                                 },
//                                 userId: emp._id,
//                             },
//                         }
//                     }
//                     else {
//                         return emp;
//                     }
//                 }),
//             };
//         },
//         setAllUserSetting8: (state, { payload }) => {
//             return {
//                 ...state,
//                 employess: state.employess.map((emp) => {
//                     if (emp?.effectiveSettings?.individualAutoPause === false) {
//                         return {
//                             ...emp,
//                             effectiveSettings: {
//                                 ...emp?.effectiveSettings,
//                                 individualAutoPause: false,
//                                 autoPauseTrackingAfter: {
//                                     ...emp?.effectiveSettings?.autoPauseTrackingAfter,
//                                     frequency: payload,
//                                 },
//                                 userId: emp._id,
//                             },
//                         }
//                     }
//                     else {
//                         return emp;
//                     }
//                 }),
//             };
//         },
//         getE(state, action) {
//             state.employess = action.payload;
//             // state.employees = action.payload; // Note: Fix typo from 'employess' to 'employees'
//         },
        // updateEmployeeSettings(state, action) {
        //     const { id, isSelected, key } = action.payload;
        //     const employee = state.employess.find(emp => emp._id === id);
        //     if (employee) {
        //         // Update the specific setting based on the key
        //         employee.effectiveSettings = {
        //             ...employee.effectiveSettings,
        //             [key]: isSelected,
        //         };
        //     }
        // },

        
        
        
//         //    ///////real///////////////
//         // updateEmployeeSettings: (state, action) => {
//         //     const { id, isSelected, key } = action.payload;
//         //     const employee = state.employess.find(emp => emp._id === id);
//         //     if (employee) {
//         //       employee.effectiveSettings = {
//         //         ...employee.effectiveSettings,
//         //         [key]: isSelected,
//         //       };
//         //     }
//         //   },



//         setBreakTime: (state, action) => {
//             state.breakTime = action.payload; // Update breakTime with the payload
//         },
//         updateBreakTime: (state, action) => {
//             const { index, newBreakTime } = action.payload;
//             state.breakTime[index] = newBreakTime; // Update specific break time
//         },












//         // updateEmployeeSettings(state, action) {
//         //     const { id, isSelected, key } = action.payload;
//         //     const employee = state.employess.find(emp => emp._id === id);
//         //     if (employee) {
//         //         // Update the specific setting based on the key
//         //         employee.effectiveSettings = {
//         //             ...employee.effectiveSettings,
//         //             [key]: isSelected,
//         //         };
//         //     }
//         // }

//     },
// })

// export const { getEmployess,
//     setEmployess,
//     setActiveTab,
//     setEmployessSetting,
//     setEmployessSetting2,
//     setEmployessSetting3,
//     setEmployessSetting4,
//     setEmployessSetting5,
//     setEmployessSetting6,
//     setEmployessSetting7,
//     setAllUserSetting,
//     setAllUserSetting2,
//     setAllUserSetting3,
//     setAllUserSetting4,
//     setAllUserSetting5,
//     setAllUserSetting6,
//     setAllUserSetting7,
//     setAllUserSetting8,
//     updateEmployeeSettings,
//     setIds,
//     setEmployessSettings,
//     getE,
//     // updateEmployeeSettings,

// } = adminSlice.actions

// export default adminSlice.reducer
// In your adminSlice.js

// import { createSlice } from '@reduxjs/toolkit';

// const adminSlice = createSlice({
//     name: 'admin',
//     initialState: {
//         employees: [],
//         activeTab: null,
//     },
//     reducers: {
// getE(state, action) {
//     state.employees = action.payload;
// },
// updateEmployeeSettings(state, action) {
//     const { id, isSelected, key } = action.payload;
//     const employee = state.employees.find(emp => emp._id === id);
//     if (employee) {
//         // Update the specific setting based on the key
//         employee.effectiveSettings = {
//             ...employee.effectiveSettings,
//             [key]: isSelected,
//         };
//     }
// },
//     },
// });

// Export actions
// export const { getE, updateEmployeeSettings } = adminSlice.actions;

// Export reducer
// export default adminSlice.reducer;      