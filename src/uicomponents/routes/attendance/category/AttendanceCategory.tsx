import { Link, useNavigate } from "react-router-dom";
import React from "react";
import styled from "styled-components";
import * as Yup from 'yup';
import { debounce } from 'lodash';
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useAddSnackBar from "../../../reusables/SnackBar/useSnackBar";
import RouteContentBase, { RouteContentBaseHeader, RouteContentBaseBody } from "../../RouteContentBase";
import SkeletonLoading from "../../../reusables/SkeletonLoading";
import Devider from "../../../reusables/devider";
import SiteMap from "../../SiteMap";
import GoBackBtn from "../../../GoBackBtn";
import AttendanceCategorySkeleton from "./AttendanceCategorySkeleton";
import doRequest from "../../../../API/doRequest";
import Button from "../../../reusables/Buttons/Button";
import Modal from "../../../reusables/Modal";
import Input from "../../../reusables/Inputs/Input";
import Tabs from "./Tabs";
import Scrollbar from "../../../reusables/ScrollBar";
import Revealer from "../../../reusables/Revealer";
import AttendersTabContent from "./AttendersTabContent";
import AttendanceEntriesListView, {AttendanceEntriesSkeleton} from "./EntriesListView";
import TAttendanceEntry from "./TAttendanceEntry";
import DateRangeSelect from "../../../reusables/DateRange";
import NoRecordFound from "../../../NoRecordFound";

interface ICategoryData {
    id: string,
    uid: string,
    title: string,
    type: "basic" | "detailed",
    attender: "all" | "select",
}

const ContentWraper = styled.div`
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    height: calc(100vh - 143.8px);
    align-content: flex-start;
    overflow: hidden;
    padding: 0 5px 15px 5px;

    && > header {
        display: flex;
        flex: 0 1 100%;
        height: 60px;
        /* background-color: gray; */
        align-items: center;
        line-height: 1.3;
        color: ${({theme}) => theme.textColor.strong};
        
        .category-info {
            display: flex;
            flex-direction: column;

            .title {
                display: inline-flex;
                align-items: center;
                font-size: 18px;
                font-weight: 600;

                .edit-title-btn {
                    width: fit-content;
                    height: fit-content;
                    font-size: 11px;
                    margin-left: 10px;
                    cursor: pointer;
                    color: ${({theme}) => theme.textColor.light};
                }
            }

            .type {
                color: ${({theme}) => theme.textColor.light};
                font-size: 13px;
            }
        }

        .list-view-toggles {
            display: flex;
            align-items: center;
            width: fit-content;
            height: 30px;
            margin-left: auto;

            ${Button} {
                flex-shrink: 0;
            }
        }

    }
    
    && ${Input} {
        margin: 15px 0;
    }

    && .btn-container {
        display: flex;
        flex: 0 1 100%;
        justify-content: flex-end;
        gap: 5px;
    }

    && ${Tabs} {
        height: fit-content;
    }

    && > .tabs-area {
        display: flex;
        flex: 0 1 100%;
    }

    && > .scroll {
        position: relative;
        display: flex;
        flex: 0 1 calc(100% + 10px);
        height: calc(100% - 195px);
        /* overflow: auto; */
    }

    && .scroll ${Revealer} {
        /* max-height: fit-content; */
        margin-right: 15px;
    }

    && .scroll ${Revealer} .tab-container {
        position: relative;
        display: flex;
        flex: 0 1 100%;
        flex-wrap: wrap;
        padding: 15px;
        height: fit-content;
        /* box-shadow: 0px 0 4px 0px rgba(0, 0, 0, 0.25); */
        background-color: ${({theme}) => theme.background.lighter};
    }   

    && .scroll ${Revealer} .tab-container > .btn-close {
        position: absolute;
        display: inline;
        height: fit-content;
        width: fit-content;
        font-size: 13px;
        top: 5px;
        right: 8px;
        color: ${({theme}) => theme.textColor.light};
        cursor: pointer;

        :hover {
            transition: color 300ms;
            color: ${({theme}) => theme.textColor.strong};
        }
    }

    && .scroll ${Revealer} .tab-container  .load-more-btn {
        display: flex;
        flex: 0 1 100%;
        justify-content: center;
        height: fit-content;
        margin-top: 15px;
    }

    && .scroll ${Revealer} .tab-container .end-of-list {
        color: ${({theme}) => theme.textColor.light};
        flex: 0 1 100%;
        margin-top: 15px;
        text-align: center;
    }

    && .list-toolbar {
        /* position: sticky;
        top: 0; */
        display: flex;
        flex: 0 1 100%;
        align-items: center;
        padding: 15px;
        height: 40px;
        gap: 10px;
        border-radius: 5px;
        background-color: ${({theme}) => theme.background.primary};
        color: ${({theme}) => theme.textColor.strong};
        /* box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.25); */
        margin-bottom: 10px;
        z-index: 150;

        ${Input} {
            flex: 0 1 200px;
            margin-top: 25px;
        }
    }
`;

const validationSchema = Yup.object().shape({
    title: Yup.string().required(),
});


const AttendanceCategory: React.FC = () => {
    const addSnackBar = useAddSnackBar();
    const {categoryUID} = useParams();
    const [editTitleModal, updateEditTitleModal] = React.useState<"close" | "ondisplay" | "open" | "remove" | "inactive">("inactive");
    const [isLoadingCategoryInfo, setIsLoadingCategoryInfo] = React.useState(true);
    const [categoryData, setCategoryData] = React.useState<ICategoryData>();
    const [isLoadingAttenders, setIsLoadingAttenders] = React.useState(true);
    const [attenders, setAttenders] = React.useState<({name: string, picture: string | null, memberUID: string})[]>([]);
    const [editFormData, setEditFormData] = React.useState<{title: string} | null>(null);
    const [errors, setErrors] = React.useState<{ title?: string }>({});
    const [attendanceEntries, updateAttendanceEntries] = React.useState<{total: number, entries: TAttendanceEntry[]} | null>(null);
    const [isLoadingAttendanceEntries, setIsLoadingAttendanceEntries] = React.useState(true);
    const [isLoadingMoreAttendanceEntries, setIsLoadingMoreAttendanceEntries] = React.useState(false);
    const [dateRangeFilter, setDateRangeFilter] = React.useState<{from: Date, to: Date} | null>(null);
    const [isUpdatingTitle, setIsUpdatingTitle] = React.useState(false);

    const [tab, setTab] = React.useState('entries');

    const fetchAttendanceEntries = (categoryUID: string, dateRangeFilter: {from: string, to: string} | null) => {
        setIsLoadingAttendanceEntries(true);
        doRequest<{total: number, entries: TAttendanceEntry[]}>({
            url: `/attendance/get-attendance-entries-by-category/${categoryUID}/0`,
            data: {dateRangeFilter: dateRangeFilter},
            method: "POST"
        })
        .then(result => {
            if(result.success && result.data) {
                setTimeout(() => {
                    updateAttendanceEntries(result.data as {total: number, entries: TAttendanceEntry[]});
                    setIsLoadingAttendanceEntries(false)
                }, 1000)
            } else throw result
        })
        .catch(err => {
            console.log(err);
        })
    }

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
        if(categoryData) {
            setEditFormData({title: categoryData.title});
            if(categoryData.attender == "select") {
                doRequest<({name: string, picture: string | null, memberUID: string})[]>({
                    url: `/attendance/attendance-categoty-attenders/${categoryData.uid}`,
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
            }
        }
    }, [categoryData]);

    React.useEffect(() => {
        if(categoryUID) {
            setIsLoadingCategoryInfo(true);
            doRequest<ICategoryData>({
                url: `/attendance/get-attendance-category/${categoryUID}`
            })
            .then(result => {
                if(result.success) {
                    setCategoryData(result.data)
                } else throw result.error
            })
            .catch(err => {
                console.log(err)
            })
            .finally(() => {
                setTimeout(() => {
                    setIsLoadingCategoryInfo(false);
                }, 1000)
            })
        }
    }, [categoryUID]);

    React.useEffect(() => {
        if(categoryData) {
            debounce(() => {
                fetchAttendanceEntries(categoryData.uid, dateRangeFilter? {from: `${dateRangeFilter.from.getFullYear()}-${dateRangeFilter.from.getMonth() + 1}-${dateRangeFilter.from.getDate()}`, to: `${dateRangeFilter.to.getFullYear()}-${dateRangeFilter.to.getMonth() + 1}-${dateRangeFilter.to.getDate()}`} : null);
            }, 500)()
        }
    }, [dateRangeFilter, categoryData])
    return (<>
        <RouteContentBase>
            <RouteContentBaseHeader>
                <strong>Category [{isLoadingCategoryInfo? 'Loading...' : `${categoryData?.title}`}]</strong>
                <Devider $orientation="vertical" $variant="center" $css="margin: 0 5px" />
                <SiteMap>
                    / <Link to='/app/attendance'> attendance</Link>/ <Link to='./'> category/{categoryUID}</Link>
                </SiteMap>
                <GoBackBtn />
            </RouteContentBaseHeader>
            <RouteContentBaseBody>
                <ContentWraper>
                    {
                        !isLoadingCategoryInfo? <>
                        <header>
                            <div className="category-info">
                                <span className="title">
                                    <h1>{categoryData?.title}</h1>
                                    <span className="edit-title-btn" onClick={() => updateEditTitleModal('ondisplay')}>
                                        <FontAwesomeIcon icon={["fas", "edit"]}/>
                                    </span>
                                </span>
                                <p className="type">{categoryData?.type == "basic"? "Basic (Present/Absent)" : "Detailed (Time-in/Time-out)"}</p>
                            </div>
                        </header>
                        <Scrollbar scrollBarProps={{
                            autoHeight: true
                        }}>
                            <div className="tabs-area">
                                <Tabs tab={tab} setTab={(tab) => setTab(tab)} />
                            </div>
                        </Scrollbar>
                        <div className="list-toolbar">
                            {
                                tab == "entries"? <>
                                <FontAwesomeIcon icon={["fas", "filter"]} />
                                <Devider $orientation="vertical" $variant="center" />
                                <DateRangeSelect value={dateRangeFilter} onValChange={(v) => setDateRangeFilter(v)} />
                                </> : 
                                tab == "attenders"? <>
                                
                                </> : ""
                            }
                        </div>
                        <div className="scroll"> 
                            <Scrollbar>
                                <Revealer reveal={!!tab} maxHeight="fit-content">
                                    <div className="tab-container">
                                        {
                                            tab == "entries"? <>
                                            {
                                                isLoadingAttendanceEntries? <AttendanceEntriesSkeleton /> : <>
                                                {
                                                    attendanceEntries? <>
                                                        {
                                                            attendanceEntries.total > 0? <AttendanceEntriesListView entries={attendanceEntries.entries} /> : <NoRecordFound />
                                                        }
                                                    </> : ""
                                                }
                                                </>
                                            }
                                            {
                                                attendanceEntries && attendanceEntries.entries.length == attendanceEntries.total? <p className="end-of-list">--End of list--</p> :
                                                <div className="load-more-btn">
                                                    <Button isLoading={isLoadingMoreAttendanceEntries} label="Load more" color="primary" variant="hidden-bg-btn" 
                                                    onClick={() => {
                                                        setIsLoadingMoreAttendanceEntries(true);
                                                        doRequest<{total: number, entries: TAttendanceEntry[]}>({
                                                            url: `/attendance/get-attendance-entries-by-category/${categoryData?.uid}/${attendanceEntries?.entries.length}`,
                                                            data: {dateRangeFilter: dateRangeFilter? {from: `${dateRangeFilter.from.getFullYear()}-${dateRangeFilter.from.getMonth() + 1}-${dateRangeFilter.from.getDate()}`, to: `${dateRangeFilter.to.getFullYear()}-${dateRangeFilter.to.getMonth() + 1}-${dateRangeFilter.to.getDate()}`} : null},
                                                            method: "POST"
                                                        })
                                                        .then(result => {
                                                            if(result.success && result.data) {
                                                                setTimeout(() => {
                                                                    updateAttendanceEntries({...result.data, entries: [...attendanceEntries?.entries as TAttendanceEntry[], ...result.data?.entries as TAttendanceEntry[]]} as {total: number, entries: TAttendanceEntry[]});
                                                                    setIsLoadingMoreAttendanceEntries(false)
                                                                }, 1000)
                                                            } else throw result
                                                        })
                                                        .catch(err => {
                                                            console.log(err);
                                                        })
                                                    }}/>
                                                </div> 
                                            }
                                            </> :
                                            tab == "attenders"? <>
                                                <AttendersTabContent attender={categoryData?.attender as "all" | "select"} attenders={attenders} onAdded={(attender) => {}} onRemoved={(attenderUid) => {}}/>
                                            </> :
                                            tab == "report"? <>
                                                <div style={{display: "flex", width: "100%", height: "1500px", color: "white"}}>
                                                    report
                                                </div>
                                            </> :
                                            tab == "add-entry"? <>
                                            
                                            </> : ""
                                        }
                                    </div>
                                </Revealer>
                            </Scrollbar>
                        </div>
                        </> : <AttendanceCategorySkeleton />
                    }
                    { 
                        (editTitleModal == "open" || editTitleModal == "ondisplay" || editTitleModal == "close") && 
                        <Modal isLoading={isUpdatingTitle} state={editTitleModal} title="Edit Title" onClose={() => {
                            updateEditTitleModal("remove");
                            setEditFormData({title: categoryData?.title as string})
                        }} maxWidth="550px"> 
                            <Input value={editFormData?.title} error={errors.title} type="text" placeholder="Category Title" label="Category-title"name="category-title" onValChange={(e) => setEditFormData({title: e as string})}/>
                            <div className="btn-container">
                                <Button label="Cancel" onClick={() => updateEditTitleModal("close")}/>
                                <Button label="Submit" color="primary" disabled={editFormData?.title.trim() == categoryData?.title.trim() || !!errors.title} 
                                onClick={() => {
                                    if(!(editFormData?.title == categoryData?.title)) {
                                        if(editFormData?.title == "") return;
                                        setIsUpdatingTitle(true);
                                        doRequest({
                                            url: `/attendance/update-category-title/${categoryData?.uid}`,
                                            method: "PATCH",
                                            data: {
                                                title: editFormData?.title
                                            }
                                        })
                                        .then(response => {
                                            if(response.success) {
                                                addSnackBar("Edit Success", "default", 5);
                                                setCategoryData({...categoryData as ICategoryData, title: editFormData?.title as string})
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
                </ContentWraper>
            </RouteContentBaseBody>
        </RouteContentBase>
    </>)
};

const ListViewToggle = styled(Button)<{active: boolean}>`
    transition: color 300ms;
    color: ${(props) => props.active? props.theme.staticColor.primary : props.theme.textColor.light};
`;

export default AttendanceCategory;