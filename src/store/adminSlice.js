import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
    name: "admin",
    initialState: {
        employess: [],
        settings: [],
        activeTab: null,
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

    setIds,
    setEmployessSettings,
    
} = adminSlice.actions

export default adminSlice.reducer