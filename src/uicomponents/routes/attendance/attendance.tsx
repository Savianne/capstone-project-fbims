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
import AddCategoryBanner from "./AddCategoryBanner";
import Categories, {ICategory} from "./Categories";
import SkeletonLoading from "../../reusables/SkeletonLoading";
import CreateEntryForm from "./CreateEntryForm";
import GenerateReportForm from "./GenerateReportForm";
import Scrollbar from "../../reusables/ScrollBar";
import Tabs from "./Tabs";
import Revealer from "../../reusables/Revealer";
import NoRecordFound from "../../NoRecordFound";
import IPendingEntry from "./IPendingEntry";
import PendingEntries from "./PendingEntries";

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


    && ${Revealer} .tab-content {
        display: flex;
        padding: 20px;
        flex: 0 1 100%;
        height: fit-content;
        background-color: ${({theme}) => theme.background.lighter};
    }
`;

const Attendance: React.FC = () => {
    const admin = useAppSelector(state => state.setAdmin.admin);
    const [isLoadingCategories, setIsLoadingCategories] = React.useState(true);
    const [isLoadingPendingEntries, setIsLoadingPendingEntries] = React.useState(true);
    const [totalEntriesUpdate, setTotalEntriesUpdate] = React.useState<{categoryUID: string, uniqueId: string}>();
    const [categories, setCategories] = React.useState<({data: ICategory, fetchTotalEntryIncrementalVal: number})[]>([]);
    const [pendingEntries, setPendingEntries] = React.useState<null | IPendingEntry[]>([]);

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
            } else throw result.error
        })
        .catch(err => {
            setIsLoadingCategories(false);
            console.log(err)
        });
    }

    const fetchPendingEntries = () => {
        setIsLoadingPendingEntries(true);
        doRequest<IPendingEntry[]>({
            url: "/attendance/get-pending-attendance-entries",
            method: "GET"
        })
        .then(result => {
            if(result.success && result.data) {
                setPendingEntries(result.data);
            } else throw result
        })
        .catch(err => {
            console.log(err);
        })
        .finally(() => setIsLoadingPendingEntries(false))
    }

    React.useEffect(() => {
        fetchCategories();
        fetchPendingEntries();
        const socket = io(SOCKETIO_URL);

        socket.on(`${admin?.congregation}-ADDED_NEW_ATTENDANCE_ENTRY`, (data) => {
          setTotalEntriesUpdate({categoryUID: data.category, uniqueId: data.id});
          fetchPendingEntries();
        });

        socket.on('reconnect', (attemptNumber: number) => {
            console.log(`Reconnected to the server after ${attemptNumber} attempts`);
            fetchCategories();
            fetchPendingEntries();
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
                        <Tabs tab={tab} setTab={(tab) => setTab(tab)} />
                    </div>
                    <Revealer reveal={!!tab} maxHeight="fit-content">
                        <div className="tab-content">
                            {
                                tab == "pending-entries"? <>
                                    {
                                        pendingEntries && pendingEntries.length == 0? <NoRecordFound actionBtn={<Button label="Create Entry" icon={<FontAwesomeIcon icon={["fas", "plus"]}/>} variant="hidden-bg-btn" color="primary" onClick={() => setTab("add-entry")}/>} />:
                                        pendingEntries && pendingEntries.length? <PendingEntries pendingEntries={pendingEntries} /> : ""
                                    }
                                </> :
                                tab == "categories"? <>
                                    {
                                        categories.length? <Categories categories={categories} onDeleted={(uid) => setCategories((current) => current.filter(category => category.data.uid !== uid))}/> 
                                        : <NoRecordFound secondaryText="Create Category to Categorize Attendance and track as one" actionBtn={<Button label="Create Category" icon={<FontAwesomeIcon icon={["fas", "plus"]}/>} variant="hidden-bg-btn" color="primary" onClick={() => setTab("add-category")}/>} />
                                    }
                                </> : 
                                tab == "add-category"? <AddCategoryForm dispatch={(newCategory) => setCategories((current) => ([{data: newCategory, fetchTotalEntryIncrementalVal: 1}, ...current]))} />: 
                                tab == "add-entry"? <CreateEntryForm categories={categories.map(category => category.data)} /> : ''
                            }
                        </div>
                    </Revealer>
                </ContentWraper>
            </RouteContentBaseBody>
        </RouteContentBase>
    </>)
};



export default Attendance;