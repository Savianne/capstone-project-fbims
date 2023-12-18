import React from "react";
import styled from "styled-components";
import { debounce } from "lodash";
import * as Yup from 'yup';
import { io } from "socket.io-client";
import { SOCKETIO_URL } from "../../../../API/BASE_URL";
import { ClipLoader } from "react-spinners";
import { IStyledFC } from "../../../IStyledFC";
import { useAppSelector } from "../../../../global-state/hooks";
import doRequest from "../../../../API/doRequest";
import TAttendanceEntry from "../category/TAttendanceEntry";
import Button from "../../../reusables/Buttons/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Menu, { MenuItem, MenuItemIcon, MenuItemLabel } from "../../../reusables/Menu/Menu";
import Modal from "../../../reusables/Modal";
import Input from "../../../reusables/Inputs/Input";
import useAddSnackBar from "../../../reusables/SnackBar/useSnackBar";
import Devider from "../../../reusables/devider";
import UseRipple from "../../../reusables/Ripple/UseRipple";
import DataDisplayChip from "../../../reusables/DataDisplayChip";
import AttendanceInput from "./AttendanceInput";
import Scrollbar from "../../../reusables/ScrollBar";
import PresentAttendeesGrid from "./PresentAttendeesGrid";
import useConfirmModal from "../../../reusables/ConfirmModal/useConfirmModal";
import ConfirmModal from "../../../reusables/ConfirmModal/ConfirmModal";
import DetailedAttendanceAttendeeTimeInOut from "./DetailedAttendanceAttendeesTimeInOut";

export type TBasicAttendancePresentAttendees = {
    entrySession: number,
    entryUID: string,
    memberUID: string,
    picture: string | null,
    name: string
}

export type TDetailedAttendanceAttendeesResponseType = {
    entrySession: number;
    entryUID: string;
    memberUID: string;
    name: string;
    picture: string | null;
    timeIn: string;
    timeOut: string | null;
    id: number
}

export type TDetailedAttendanceAttendeesRenderType = {
    entrySession: number;
    entryUID: string;
    memberUID: string;
    name: string;
    picture: string | null;
    timeInOut: ({id: number, timeIn: string, timeOut: string | null})[]
}

const AddAttenderBtn = styled(UseRipple)`
    position: absolute;
    right: 10px;
    bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    height: 80px;
    width: 80px;
    background-color: ${({theme}) => theme.background.primary};
    /* font-size: 50px; */
    font-size: 30px;
    box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
    color: ${({theme}) => theme.textColor.strong};
    transition: background-color 300ms linear, height 300ms, width 300ms, right 300ms, box-shadow 300ms;
    cursor: pointer;

    &:hover {
        height: 83px;
        width: 83px;
        /* right: 15px; */
        box-shadow: -0.9px 8px 4px 0 rgba(0, 0, 0, 0.25);
    }
`

const AddSession = styled(UseRipple)`
    display: flex;
    flex: 0 0 20px;
    align-items: center;
    justify-content: center;
    height: 20px;
    font-size: 11px;
    border-radius: 50%;
    color: ${({theme}) => theme.textColor.strong};
    cursor: pointer;

    &&:hover {
        transition: background-color 300ms linear;
        background-color: ${({theme}) => theme.background.lighter};
    }
`

interface IEntryPage extends IStyledFC {
    onClose: () => void;
    entryInfo: TAttendanceEntry;
    editEntryTitleUpdate: (uid: string, title: string) => void
}

const validationSchema = Yup.object().shape({
    title: Yup.string().required(),
});

const EntryPageFC: React.FC<IEntryPage> = ({className, onClose, entryInfo, editEntryTitleUpdate}) => {
    const admin = useAppSelector(state => state.setAdmin.admin);
    const addSnackBar = useAddSnackBar();
    const [editFormData, setEditFormData] = React.useState<{title: string} | null>(null);
    const [editTitleModal, updateEditTitleModal] = React.useState<"close" | "ondisplay" | "open" | "remove" | "inactive">("inactive");
    const [attendanceInputState, setAttendanceInputState] = React.useState<"close" | "ondisplay" | "open" | "remove" | "inactive">("inactive");
    const [errors, setErrors] = React.useState<{ title?: string }>({});
    const [isUpdatingTitle, setIsUpdatingTitle] = React.useState(false);
    const [sessions, setSessions] = React.useState<({id: number})[]>([]);
    const [activeSessionTab, setActiveSessionTab] = React.useState(5);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [isLoadingAttenders, setIsLoadingAttenders] = React.useState(true);
    const [basicAttendancePresentAttendees, setBasicAttendancePresentAttendees] = React.useState<TBasicAttendancePresentAttendees[]>([]);
    const [detailedAttendanceAttendees, setDetailedAttendanceAttendees] = React.useState<TDetailedAttendanceAttendeesRenderType[]>([]);
    const [attenders, setAttenders] = React.useState<({name: string, picture: string | null, memberUID: string})[]>([]);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const fetchBasicAttendancePresentAttendees = () => {
        doRequest<TBasicAttendancePresentAttendees[]>({
            url: `/attendance/get-basic-attendance-present-attendees/${entryInfo.entryUID}`
        })
        .then(result => {
            if(result.success) {
                setBasicAttendancePresentAttendees(result.data as TBasicAttendancePresentAttendees[])
            } else throw result;
        })
        .catch(err => {
            addSnackBar("Failed to load present attendees", "error", 5)
        })

    }

    const fetchDetailedAttendancePresentAttendees = () => {
        doRequest<TDetailedAttendanceAttendeesResponseType[]>({
            url: `/attendance/get-detailed-attendance-attendees/${entryInfo.entryUID}`
        })
        .then(result => {
            if(result.success && result.data) {
                const groupedData:Record<string, TDetailedAttendanceAttendeesRenderType> = {}
                result.data.forEach(item => {
                    const key = item.memberUID;
                    if(groupedData.hasOwnProperty(key)) {
                        groupedData[key].timeInOut.push({id: item.id, timeIn: item.timeIn, timeOut: item.timeOut})
                    } else {
                        groupedData[key] = {
                            entrySession: item.entrySession,
                            entryUID: item.entryUID,
                            memberUID: item.memberUID,
                            name: item.name,
                            picture: item.picture,
                            timeInOut: [{id: item.id, timeIn: item.timeIn, timeOut: item.timeOut}]
                        }
                    }
                });

                setDetailedAttendanceAttendees(Object.values(groupedData));
            } else throw result;
        })
        .catch(err => {
            addSnackBar("Failed to load present attendees", "error", 5)
        })

    }

    const fetchSessions = () => {
        doRequest<({id: number})[]>({
            url: `/attendance/get-entry-sessions/${entryInfo.entryUID}`
        })
        .then(result => {
            if(result.success) {
                setSessions(result.data as ({id: number})[]);
                setActiveSessionTab((result.data as ({id: number})[])[(result.data as ({id: number})[]).length - 1].id)
            } else throw result
        })
        .catch(err => {
            addSnackBar("Error Occcured!", 'error', 5)
        });
    }

    const fetchCategoryAttenders = (categoryUID: string) => {
        setIsLoadingAttenders(true);
        doRequest<({name: string, picture: string | null, memberUID: string})[]>({
            url: `/attendance/attendance-categoty-attenders/${categoryUID}`,
            method: "GET"
        })
        .then(result => {
            if(result.success) {
                setAttenders(result.data as ({name: string, picture: string | null, memberUID: string})[]);
            } else throw result.error
        })
        .catch(err => {
            console.log(err)
        })
        .finally(() => {
            setIsLoadingAttenders(false);
        })
    };

    React.useEffect(() => {
        editFormData && debounce(async () => {
            try {
                await validationSchema.validate(editFormData, { abortEarly: false });
                setErrors({});
            } catch (error: any) {
                if (error instanceof Yup.ValidationError) {
                    const validationErrors: { [K in keyof typeof editFormData]?: string } = {}; // Define the type of validationErrors
                    error.inner.forEach((err) => {
                        if (err.path) {
                            validationErrors[err.path as keyof typeof validationErrors] = err.message;
                        }
                    });
    
                    setErrors(validationErrors);
                }
            }
        }, 300)();
    }, [editFormData]);
    
    React.useEffect(() => {
        setEditFormData({title: entryInfo.description});
    }, [entryInfo]);

    React.useEffect(() => {
        fetchSessions();
        fetchCategoryAttenders(entryInfo.categoryUID);
        const socket = io(SOCKETIO_URL);

        if(entryInfo.type == "basic") {
            fetchBasicAttendancePresentAttendees();
            socket.on(`${admin?.congregation}-NEW_PRESENT_${entryInfo.entryUID}`, (data: TBasicAttendancePresentAttendees) => {
                fetchBasicAttendancePresentAttendees();
                addSnackBar(`New Present: ${data.name}`, "success", 10);
            });
    
            socket.on(`${admin?.congregation}-REMOVED_PRESENT_${entryInfo.entryUID}`, () => {
                fetchBasicAttendancePresentAttendees();
            });
        } else {
            fetchDetailedAttendancePresentAttendees();
            socket.on(`${admin?.congregation}-NEW_TIMEIN_${entryInfo.entryUID}`, (data: TBasicAttendancePresentAttendees) => {
                fetchDetailedAttendancePresentAttendees();
                addSnackBar(`New Time-in: ${data.name}`, "success", 10);
            });

            fetchDetailedAttendancePresentAttendees();
            socket.on(`${admin?.congregation}-NEW_TIMEOUT_${entryInfo.entryUID}`, (data: TBasicAttendancePresentAttendees) => {
                fetchDetailedAttendancePresentAttendees();
                addSnackBar(`Time-out: ${data.name}`, "success", 10);
            });

            socket.on(`${admin?.congregation}-REMOVED_TIMEINOUT_${entryInfo.entryUID}`, (data: TBasicAttendancePresentAttendees) => {
                fetchDetailedAttendancePresentAttendees();
            });

        }

        socket.on(`${admin?.congregation}-ADDED_NEW_ATTENDANCE_ENTRY_SESSION-${entryInfo.entryUID}`, () => {
            fetchSessions()
        });

        socket.on(`${admin?.congregation}-DELETED_ATTENDANCE_ENTRY_SESSION-${entryInfo.entryUID}`, () => {
            fetchSessions()
        });


        socket.on('reconnect', (attemptNumber: number) => {
            console.log(`Reconnected to the server after ${attemptNumber} attempts`);
            fetchSessions();
            fetchBasicAttendancePresentAttendees();
        });

        return function () {
            socket.disconnect();
        }
    }, []);

    React.useEffect(() => {
        console.log(detailedAttendanceAttendees.filter(item => {
            return item.timeInOut.map(item => item.timeOut).includes(null)? true : false;
        }).map(item => item.memberUID));

    }, [detailedAttendanceAttendees])
    return (
        <div className={className}>
           <div className="page-heading">
                <div className="entry-title">
                    <h1>{entryInfo.description}</h1>
                    <Button label="more" icon={<FontAwesomeIcon icon={["fas", "ellipsis-h"]}/>} iconButton variant="hidden-bg-btn"
                    onClick={handleClick} />
                    <Menu
                    placement="bottom"
                    anchorEl={anchorEl} 
                    open={open} 
                    onClose={handleClose}>
                        <MenuItem onClick={() => {
                            handleClose();
                            setTimeout(() => {
                                updateEditTitleModal('ondisplay');
                            }, 400)
                        }}>
                            <MenuItemIcon>
                                <FontAwesomeIcon icon={["fas", "edit"]} />
                            </MenuItemIcon>
                            <MenuItemLabel>Edit Title</MenuItemLabel>
                        </MenuItem>
                        <MenuItem onClick={() => {
                            handleClose();
                            setTimeout(() => {
                                
                            }, 400)
                        }}>
                            <MenuItemIcon>
                                <FontAwesomeIcon icon={["fas", "trash"]} />
                            </MenuItemIcon>
                            <MenuItemLabel>Delete Entry</MenuItemLabel>
                        </MenuItem>
                    </Menu>
                </div>
                {
                    entryInfo.pending? <span className="btn-submit-container">
                        <Button label="Submit" color="primary" variant="hidden-bg-btn" />
                    </span> : <DataDisplayChip icon={<FontAwesomeIcon icon={['fas', "check"]} />}>Submitted</DataDisplayChip>
                }
                <Devider $orientation="vertical" $variant="center"/>
                <span className="btn-close-container">
                    <Button label="close" variant="hidden-bg-btn" icon={<FontAwesomeIcon icon={['fas', 'times']} />} iconButton onClick={onClose}/>
                </span>
           </div>
           <div className="attenders-list">
                <EntrySessionTabs attendanceType={entryInfo.type} entryUID={entryInfo.entryUID} sessions={sessions.map(s => s.id)} activeTab={activeSessionTab} onChangeTab={(tab) => setActiveSessionTab(tab)}/>
                <div className="scroll">
                    <Scrollbar>
                    {
                        entryInfo.type == "basic"? <>
                        {
                            basicAttendancePresentAttendees.length?
                            <PresentAttendeesGrid attenders={basicAttendancePresentAttendees.filter(attendee => attendee.entrySession == activeSessionTab)} entryUID={entryInfo.entryUID} /> : 'No Attendees'
                        }
                        </> :
                        detailedAttendanceAttendees.map(attendee => <DetailedAttendanceAttendeeTimeInOut key={attendee.memberUID} attendanceInfo={attendee} />)
                    }   
                    </Scrollbar>
                </div>
                <AddAttenderBtn onClick={() => setAttendanceInputState('ondisplay')}>
                    <FontAwesomeIcon icon={["fas", "qrcode"]} />
                </AddAttenderBtn>
           </div>
           {
                (attendanceInputState == "open" || attendanceInputState == "ondisplay" || attendanceInputState == "close") &&(attendanceInputState == "open" || attendanceInputState == "ondisplay" || attendanceInputState == "close") &&
                <AttendanceInput 
                categoryUID={entryInfo.categoryUID} 
                presents={
                    entryInfo.type == "basic"? 
                    basicAttendancePresentAttendees.map(a => a.memberUID) : 
                    detailedAttendanceAttendees.filter(item => {
                        return item.timeInOut.map(item => item.timeOut).includes(null)? true : false;
                    }).map(item => item.memberUID)
                } 
                state={attendanceInputState} 
                attendanceType={entryInfo.type} 
                entryUID={entryInfo.entryUID} 
                session={activeSessionTab} 
                onClose={() => setAttendanceInputState("remove")} 
                attender={entryInfo.attender} 
                attenders={attenders} />
           }
           {
                (editTitleModal == "open" || editTitleModal == "ondisplay" || editTitleModal == "close") &&
                <Modal isLoading={isUpdatingTitle} state={editTitleModal} title="Edit Title" onClose={() => {
                    updateEditTitleModal("remove");
                    setEditFormData({title: entryInfo.description})
                }} maxWidth="550px"> 
                    <Input value={editFormData?.title} error={errors.title} type="text" placeholder="Category Title" label="Category-title"name="category-title" onValChange={(e) => setEditFormData({title: e as string})}/>
                    <div className="btn-container">
                        <Button label="Cancel" onClick={() => updateEditTitleModal("close")}/>
                        <Button label="Submit" color="primary" disabled={editFormData?.title.trim() == entryInfo.description.trim() || !!errors.title} 
                        onClick={() => {
                            if(!(editFormData?.title == entryInfo.description)) {
                                if(editFormData?.title == "") return;
                                setIsUpdatingTitle(true);
                                doRequest({
                                    url: `/attendance/update-entry-title/${entryInfo.entryUID}`,
                                    method: "PATCH",
                                    data: {
                                        title: editFormData?.title
                                    }
                                })
                                .then(response => {
                                    if(response.success) {
                                        addSnackBar("Edit Success", "default", 5);
                                        editEntryTitleUpdate(entryInfo.entryUID, editFormData?.title as string);
                                        updateEditTitleModal('close');
                                    } else throw response.error
                                })
                                .catch(err => {
                                    addSnackBar("Edit failed", "error", 5)
                                })
                                .finally(() => {
                                    setIsUpdatingTitle(false);
                                })
                            } else updateEditTitleModal("close");
                        }} />
                    </div>
                </Modal>
            }
        </div>
    )
}

interface IEntrySessionTabs extends IStyledFC {
    entryUID: string,
    sessions: number[];
    activeTab: number;
    onChangeTab: (tab: number) => void;
    attendanceType: "basic" | "detailed";
}

const EntrySessionTabsFC: React.FC<IEntrySessionTabs> = ({className, entryUID, sessions, activeTab, onChangeTab, attendanceType}) => {
    const addSnackBar = useAddSnackBar();
    const [isLoading, setIsLoading] = React.useState(false);

    return(
        <div className={className}>
            {
                sessions.map((session, i) => (
                    <EntrySessionTab 
                    key={session}
                    isActive={session == activeTab} 
                    entryUID={entryUID}
                    session={session}
                    tabText={`Session ${i + 1}`}
                    onChangeTab={(session) => onChangeTab(session)}
                    attendanceType={attendanceType} />
                ))
            }
            {
                isLoading? <ClipLoader size={10} color="#36d7b7" /> : 
                <AddSession onClick={() => {
                    setIsLoading(true);
                    doRequest({
                        method: "POST",
                        url: `/attendance/add-entry-session/${entryUID}`
                    })
                    .then(result => {
                        if(result.success) {
    
                        } else throw result
                    })
                    .catch(err => {
                        addSnackBar('Error Occured!', "error", 5)
                    })
                    .finally(() => setIsLoading(false))
                }}>
                    <FontAwesomeIcon icon={["fas", "plus"]} />
                </AddSession>
            }
        </div>
    )
}

interface IEntrySessionTab extends IStyledFC {
    entryUID: string;
    session: number;
    attendanceType: "basic" | "detailed";
    tabText: string;
    isActive: boolean;
    onChangeTab: (tab: number) => void
}


const EntrySessionTabFC:React.FC<IEntrySessionTab> = ({className, entryUID, session, attendanceType, tabText, isActive, onChangeTab}) => {
    const addSnackBar = useAddSnackBar();
    const [onRemove, setOnRemove] = React.useState(false);
    const {modal, confirm} = useConfirmModal();
    return(
        <div className={isActive? `${className} tab-active` : `${className}`} 
        onClick={() => onChangeTab(session)}>
            {tabText} 
            {
                isActive? onRemove? <ClipLoader size={8} color="#36d7b7" cssOverride={{marginLeft: "15px"}} /> : <span className="remove-icon-btn" onClick={() => {
                    setOnRemove(true);
                    doRequest({
                        method: "DELETE",
                        url: `/attendance/delete-attendance-entry-session/${attendanceType}/${entryUID}/${session}`
                    })
                    .then(result => {
                        addSnackBar("Session removed!", "default", 5);
                    })
                    .catch(err => {
                        if(err == "Has attendee") {
                            confirm("Invalid action", `Deletion of session is not permitted while attendees are present. Please remove attendees from the session before attempting to delete it.`)
                        }
                        setOnRemove(false);
                    })
                }}>
                    <FontAwesomeIcon icon={["fas", "times"]} />
                </span> : ""
            }
            <ConfirmModal context={modal} variant={"warning"} />
        </div>
    )
}

const EntrySessionTab = styled(EntrySessionTabFC)`
    display: flex;
    flex: 0 0 fit-content;
    align-items: center;
    height: 25px;
    padding: 0 10px;
    font-size: 13px;
    cursor: pointer;

    && > .remove-icon-btn {
        width: fit-content;
        height: fit-content;
        font-size: 10px;
        margin-left: 15px;
    }
`;

const EntrySessionTabs = styled(EntrySessionTabsFC)`
    display: flex;
    flex: 0 1 100%;
    align-items: center;
    height: 25px;
    transition: background-color 300ms;
    background-color: ${({theme}) => theme.mode == "dark"? "#171d2045" : "#dadada45"};
    overflow-x: auto;
    color: ${({theme}) => theme.textColor.strong};
    scrollbar-width: thin; /* For Firefox */
    -ms-overflow-style: none; /* For IE and Edge */

    &&::-webkit-scrollbar {
        height: 0; /* For Chrome, Safari, and Opera */
    }   

    && > .tab-active {
        background-color: ${({theme}) => theme.background.lighter};
    }
`;

const EntryPage = styled(EntryPageFC)`
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    flex-wrap: wrap;
    width: calc(100% - 40px);
    padding: 10px 20px;
    height: 100vh;
    align-content: flex-start;
    background-color: ${({theme}) => theme.background.primary};
    z-index: 10000;
    
    && > .page-heading {
        display: flex;
        flex: 0 1 100%;
        height: 35px;
        align-items: center;

        .entry-title {
            display: flex;
            flex: 0 1 fit-content;
            align-items: center;
            color: ${({theme}) => theme.textColor.strong};
        }

        .btn-submit-container, ${DataDisplayChip} {
            margin-left: auto;
        }

        .btn-close-container {
            flex: 0 1 fit-content;
        }
    }

    && > .page-heading > .entry-title > h1 {
        font-size: 18px;
        font-weight: 600;
        margin-right: 5px;
    }

    && > .attenders-list {
        position: relative;
        display: flex;
        flex-wrap: wrap;
        flex: 0 1 100%;
        height: calc(100vh - 65px);
        margin-top: 10px;
        background-color: ${({theme}) => theme.background.lighter};

        .scroll {
        position: relative;
        display: flex;
        flex: 0 1 100%;
        min-height: calc(100% - 25px);
    }
    }
`;

export default EntryPage;