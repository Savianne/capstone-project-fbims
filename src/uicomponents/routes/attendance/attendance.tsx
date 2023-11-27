import { Link, useNavigate } from "react-router-dom";
import React from "react";
import styled from "styled-components";
import { io } from 'socket.io-client';
import { SOCKETIO_URL } from "../../../API/BASE_URL";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAppSelector } from "../../../global-state/hooks";
import RouteContentBase, { RouteContentBaseHeader, RouteContentBaseBody } from "../RouteContentBase";
import doRequest from "../../../API/doRequest";
import Devider from "../../reusables/devider";
import SiteMap from "../SiteMap";
import GoBackBtn from "../../GoBackBtn";
import Button from "../../reusables/Buttons/Button";
import AddCategoryForm from "./AddCategoryForm";
import Categories, {ICategory} from "./Categories";
import CreateEntryForm from "./CreateEntryForm";
import GenerateReportForm from "./GenerateReportForm";
import Scrollbar from "../../reusables/ScrollBar";
import Tabs from "./Tabs";
import Revealer from "../../reusables/Revealer";
import NoRecordFound from "../../NoRecordFound";
import IPendingEntry from "./IPendingEntry";
import PendingEntries, {PendingEntriesSkeleton} from "./PendingEntries";
import FailedToLoadError from "../../reusables/FailedToLoadError";
import SkeletonLoading from "../../reusables/SkeletonLoading";

const IsLoadingCategories = styled.div`
    display: grid;
    flex: 1;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    grid-gap: 20px;
`;

const ContentWraper = styled.div`
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    min-height: calc(100vh - 161.8px);
    overflow: hidden;
    padding: 15px 5px;
    gap: 5px;
    align-content: flex-start;

    && .attendance-page-banner {
        display: flex;
        flex: 0 1 100%;
        height: fit-content;
        flex-wrap: wrap;
        justify-content: center;
        padding: 15px;

        img {
            width: 280px;
        }

        h1 {
            flex: 0 1 100%;
            text-align: center;
            font-size: 30px;
            font-weight: bold;
            color: #fd5959;
        }

        p {
            font-size: 16px;
            text-align: center;
            flex: 0 1 400px;
            color: ${({theme}) => theme.textColor.light};
        }
    }

    && ${Tabs} {
        height: fit-content;
        margin: 0 auto;
    }

    && > .comp-tabs-area {
        /* position: sticky; */
        background-color: ${({theme}) => theme.background.primary};
        top: 65px;
        display: flex;
        flex: 0 1 100%;
        height: fit-content;
        overflow-x: auto;
        scrollbar-width: thin; /* For Firefox */
        -ms-overflow-style: none; /* For IE and Edge */
    }

    && > .comp-tabs-area::-webkit-scrollbar {
        height: 0; /* For Chrome, Safari, and Opera */
    }    

    && .tab-content {
        display: flex;
        flex-wrap: wrap;
        padding: 20px;
        flex: 0 1 100%;
        height: calc(100vh - 251.8px);
        background-color: ${({theme}) => theme.background.lighter};
    }
    
    
    && .tab-content .scroll-content {
        display: flex;
        flex-wrap: wrap;
        flex: 0 1 100%;
        height: fit-content;
        /* height: calc(100vh - 251.8px); */
        /* overflow-y: auto; */
        /* background-color: ${({theme}) => theme.background.lighter}; */
    }

    && .tab-content .scroll-content .load-more-btn {
        display: flex;
        flex: 0 1 100%;
        justify-content: center;
        height: fit-content;
        margin-top: 15px;
    }

    && .tab-content .scroll-content .end-of-list {
        color: ${({theme}) => theme.textColor.light};
        flex: 0 1 100%;
        margin-top: 15px;
        text-align: center;
    }
`;

const Attendance: React.FC = () => {
    const admin = useAppSelector(state => state.setAdmin.admin);
    const [isLoadingCategories, setIsLoadingCategories] = React.useState(true);
    const [isLoadingPendingEntries, setIsLoadingPendingEntries] = React.useState(true);
    const [loadingPendingEntriesError, setLoadingPendingEntriesError] = React.useState(false);
    const [loadingCategoriesError, setLoadingCategoriesError] = React.useState(false);
    const [isLoadingMorePendingEntries, setIsLoadingMorePendingEntries] = React.useState(false);
    const [totalEntriesUpdate, setTotalEntriesUpdate] = React.useState<{categoryUID: string, uniqueId: string}>();
    const [categories, setCategories] = React.useState<({data: ICategory, fetchTotalEntryIncrementalVal: number})[]>([]);
    const [pendingEntries, setPendingEntries] = React.useState<null | IPendingEntry[]>(null);
    const [totalPendingEntries, setTotalPendingEntries] = React.useState(0);
    const [tab, setTab] = React.useState('pending-entries');

    const fetchCategories = () => {
        setIsLoadingCategories(true);
        doRequest<ICategory[]>({
            url: "/attendance/congregation-attendance-category",
            method: "GET"
        })
        .then(result => {
            setIsLoadingCategories(false);
            if(result.success) {
                const mapedRes = result.data?.map(c => ({data: c, fetchTotalEntryIncrementalVal: 1}))
                setCategories(mapedRes as typeof categories)
                loadingCategoriesError && setLoadingCategoriesError(false)
            } else throw result.error
        })
        .catch(err => {
            setIsLoadingCategories(false);
            setLoadingCategoriesError(true);
        });
    }

    const fetchPendingEntries = () => {
        setIsLoadingPendingEntries(true);
        doRequest<IPendingEntry[]>({
            url: `/attendance/get-pending-attendance-entries/0`,
            method: "GET"
        })
        .then(result => {
            if(result.success && result.data) {
                setTimeout(() => {
                    setPendingEntries(result.data as IPendingEntry[]);
                    setIsLoadingPendingEntries(false);
                    loadingPendingEntriesError && setLoadingPendingEntriesError(false);
                }, 1000)
            } else throw result
        })
        .catch(err => {
            setLoadingPendingEntriesError(true);
        })
    }

    const fetchTotalPendingEntries = () => {
        doRequest<number>({
            url: `/attendance/get-total-pending-attendance-entries`,
            method: "GET"
        })
        .then(result => {
            if(result.success && result.data) {
                setTotalPendingEntries(result.data);
            } else throw result
        })
        .catch(err => {
            console.log(err);
        })
    }

    React.useEffect(() => {
        fetchCategories();
        fetchPendingEntries();
        fetchTotalPendingEntries();
        const socket = io(SOCKETIO_URL);

        socket.on(`${admin?.congregation}-ADDED_NEW_ATTENDANCE_ENTRY`, (data) => {
          setTotalEntriesUpdate({categoryUID: data.category, uniqueId: data.id});
          fetchPendingEntries();
          fetchTotalPendingEntries();
        });

        socket.on('reconnect', (attemptNumber: number) => {
            console.log(`Reconnected to the server after ${attemptNumber} attempts`);
            fetchCategories();
            fetchPendingEntries();
            fetchTotalPendingEntries();
        });

        return function () {
            socket.disconnect();
        }
    }, []);

    React.useEffect(() => {
        if(totalEntriesUpdate && categories) {
            setCategories([...categories.map(c => {
                return c.data.uid == totalEntriesUpdate.categoryUID? {data: {...c.data}, fetchTotalEntryIncrementalVal: c.fetchTotalEntryIncrementalVal + 1} : c
            })])
        }
    }, [totalEntriesUpdate])
    return (<>
        <RouteContentBase>
            <RouteContentBaseHeader>
                <strong>Attendance</strong>
                <Devider $orientation="vertical" $variant="center" $css="margin: 0 5px" />
                <SiteMap>
                    / <Link to='/attendance'> attendance</Link>
                </SiteMap>
                <GoBackBtn />
            </RouteContentBaseHeader>
            <RouteContentBaseBody>
                <ContentWraper>
                    <div className="attendance-page-banner">
                        <img src="/assets/images/attendance-page-illustration.png" alt="attendance" />
                        <h1>ATTENDANCE MONITORING SYSTEM</h1>
                        <p>Track members' participation in church events, services, and activities.</p>
                    </div>
                    <div className="comp-tabs-area">
                        <Tabs tab={tab} setTab={(tab) => setTab(tab)} categoriesCount={categories.length} pendingEntriesCount={totalPendingEntries}/>
                    </div>
                    {/* <Revealer reveal={!!tab} maxHeight="fit-content"> */}
                        <div className="tab-content">
                            <Scrollbar>
                                <div className="scroll-content">
                                {
                                    tab == "pending-entries"? <>
                                        {
                                            isLoadingPendingEntries? <PendingEntriesSkeleton /> :
                                            <>
                                            {
                                                loadingPendingEntriesError? <FailedToLoadError /> : 
                                                pendingEntries && pendingEntries.length == 0? <NoRecordFound actionBtn={<Button label="Create Entry" icon={<FontAwesomeIcon icon={["fas", "plus"]}/>} variant="hidden-bg-btn" color="primary" onClick={() => setTab("add-entry")}/>} />:
                                                pendingEntries && pendingEntries.length? <>
                                                    <PendingEntries pendingEntries={pendingEntries} />
                                                    {
                                                        pendingEntries.length == totalPendingEntries? <p className="end-of-list">--End of list--</p> :
                                                        <div className="load-more-btn">
                                                            <Button isLoading={isLoadingMorePendingEntries} label="Load more" color="primary" variant="hidden-bg-btn" 
                                                            onClick={() => {
                                                                setIsLoadingMorePendingEntries(true);
                                                                doRequest<IPendingEntry[]>({
                                                                    url: `/attendance/get-pending-attendance-entries/${pendingEntries.length}`,
                                                                    method: "GET"
                                                                })
                                                                .then(result => {
                                                                    if(result.success && result.data) {
                                                                        setPendingEntries([...pendingEntries, ...result.data]);
                                                                        loadingPendingEntriesError && setLoadingPendingEntriesError(false);
                                                                    } else throw result
                                                                })
                                                                .catch(err => {
                                                                    setLoadingPendingEntriesError(true);
                                                                })
                                                                .finally(() => setIsLoadingMorePendingEntries(false))
                                                            }}/>
                                                        </div>
                                                    } 
                                                </> : ""
                                            }
                                            </>
                                        }
                                    </> :
                                    tab == "categories"? <>
                                        {
                                            isLoadingCategories? <IsLoadingCategories>
                                                <SkeletonLoading height={170} />
                                                <SkeletonLoading height={170} />
                                                <SkeletonLoading height={170} />
                                                <SkeletonLoading height={170} />
                                                <SkeletonLoading height={170} />
                                                <SkeletonLoading height={170} />
                                                <SkeletonLoading height={170} />
                                                <SkeletonLoading height={170} />
                                                <SkeletonLoading height={170} />
                                                <SkeletonLoading height={170} />
                                            </IsLoadingCategories> :
                                            loadingCategoriesError? <FailedToLoadError /> :
                                            categories.length? <Categories categories={categories} onDeleted={(uid) => setCategories((current) => current.filter(category => category.data.uid !== uid))}/> 
                                            : <NoRecordFound secondaryText="Create Category to Categorize Attendance and track as one" actionBtn={<Button label="Create Category" icon={<FontAwesomeIcon icon={["fas", "plus"]}/>} variant="hidden-bg-btn" color="primary" onClick={() => setTab("add-category")}/>} />
                                        }
                                    </> : 
                                    tab == "add-category"? <AddCategoryForm dispatch={(newCategory) => setCategories((current) => ([{data: newCategory, fetchTotalEntryIncrementalVal: 1}, ...current]))} />: 
                                    tab == "add-entry"? <CreateEntryForm categories={categories.map(category => category.data)} /> : ''
                                }
                                </div>
                            </Scrollbar>
                        </div>
                    {/* </Revealer> */}
                </ContentWraper>
            </RouteContentBaseBody>
        </RouteContentBase>
    </>)
};



export default Attendance;