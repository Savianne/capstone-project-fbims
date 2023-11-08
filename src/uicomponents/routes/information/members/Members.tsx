import { Link, useNavigate } from "react-router-dom";
import React from "react";
import { useAppSelector } from "../../../../global-state/hooks";
import styled, { ThemeConsumer, css } from "styled-components";
import { debounce } from 'lodash';
import axios from "axios";
import ScaleLoader from "react-spinners/ScaleLoader";
import { CancelTokenSource } from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RouteContentBase, { RouteContentBaseHeader, RouteContentBaseBody } from "../../RouteContentBase";
import { IStyledFC } from "../../../IStyledFC";
import Avatar from "../../../reusables/Avatar";
import { io } from 'socket.io-client';
import { SOCKETIO_URL } from "../../../../API/BASE_URL";
import { API_BASE_URL } from "../../../../API/BASE_URL";
import { TResponseFlag } from "../../../../API/TResponseFlag";
import ResizableContainer from "../../../reusables/ResizableContainer";

//API
import { useGetRecordCountQuery } from "../../../../global-state/api/api";
import { useGetMembersListMutation } from "../../../../global-state/api/api";

import Pagenation from "../../../reusables/Pagenation/Pagenation";
import Pagination from "../../../reusables/Pagenation/Pagination";
import Devider from "../../../reusables/devider";
import SiteMap from "../../SiteMap";
import GoBackBtn from "../../../GoBackBtn";
import InformationRouteMainBoard from "../../InformationRouteMainBoard";
import MembersTable from "./MembersTable";
import Modal from "../../../reusables/Modal";
import MembershipFormModalView from "./MembershipFormModalView";
import Button from "../../../reusables/Buttons/Button";

import useAddSnackBar from "../../../reusables/SnackBar/useSnackBar";

interface IShowEntryCounter extends IStyledFC {
    onChange: (count: number) => void;
    disabled?: boolean,
    max: number,
}

const FCShowEntryCounter: React.FC<IShowEntryCounter> = ({className, onChange, disabled, max}) => {
    const [inputVal, updateInputVal] = React.useState<string | number>(5);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        const numericValue = inputValue.replace(/\D/g, "").slice(0, 3);
        if(+numericValue > 0 && +numericValue <= max) {
            updateInputVal(+numericValue);
        } 
    };
    
    const handleIncrease: React.MouseEventHandler<HTMLSpanElement>  = () => {
        if(!disabled) {
            const newVal = +inputVal + 1;
            if(newVal > 0 && newVal <= max) {
                updateInputVal(newVal);
            }
        }
    }

    const handledecrease: React.MouseEventHandler<HTMLSpanElement>  = () => {
        if(!disabled) {
            const newVal = +inputVal - 1;
            if(newVal > 0 && newVal <= max) {
                updateInputVal(newVal);
            }
        }
    }

    React.useEffect(() => {
        onChange(+inputVal)
    }, [inputVal]);

    return (
        <div className={className}>
            Show
            <div className="input-container">
                <input disabled={disabled} value={inputVal} type="tel" onChange={handleChange} />
                <div className="arrow-icon-area">
                    <span onClick={handleIncrease} className="arrow-icon"><FontAwesomeIcon icon={["fas", "caret-up"]} /></span>
                    <span onClick={handledecrease} className="arrow-icon"><FontAwesomeIcon icon={["fas", "caret-down"]} /></span>
                </div>
            </div>
            Entries
        </div>
    )
}

const ShowEntriesCounter = styled(FCShowEntryCounter)`
    display: flex;
    height: fit-content;
    padding: 10px 5px;
    align-items: center;
    font-size: 11px;
    font-weight: bold;
    color: ${({theme}) => theme.textColor.strong};
    opacity: ${(props) => props.disabled? 0.5 : 1};

    ${(props) => props.disabled && css`cursor: wait;`}

    .input-container {
        display: flex;
        height: 25px;
        align-items: center;
        padding: 5px;
        border: 1.5px solid ${({theme}) => theme.borderColor};
        border-radius: 3px;
        margin: 0 5px;
        ${(props) => props.disabled && css`cursor: wait;`}
    }

    .input-container input,
    .input-container input:hover,
    .input-container input:focus,
    .input-container input:active {
        height: 100%;
        border: 0;
        outline: 0;
        text-align: center;
        background-color: transparent;
        font-weight: bold;
        width: 40px;
        color: ${({theme}) => theme.textColor.strong};
        ${(props) => props.disabled && css`cursor: wait;`}
    }

    .input-container .arrow-icon-area {
        display: flex;
        align-items: center;
        width: 15px;
        flex-wrap: wrap;
        ${(props) => props.disabled && css`cursor: wait;`}
    }

    .input-container .arrow-icon-area .arrow-icon {
        display: flex;
        flex: 0 1 100%;
        justify-content: center;
        align-items: center;
        height: 10px;
        font-size: 11px;
        cursor: pointer;
        opacity: 0.7;
        ${(props) => props.disabled && css`cursor: wait;`}
        
        :hover {
            transition: opacity 300ms;
            opacity: 1;
        }
    }
`;

const SortToggle = styled.span<{active: boolean, disabled?:boolean}>`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 30px;
    width: 30px;
    margin-left: 5px;
    cursor: pointer;
    transition: color 300ms;
    color: ${(props) => props.active? props.theme.staticColor.primary : props.theme.textColor.light};
    opacity: ${(props) => props.disabled? 0.5 : 1};

    ${(props) => props.disabled && css`cursor: wait;`}

    ${(props) => props.disabled && css`pointer-events: none;`}
`;

const ContentWraper = styled.div`
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    height: fit-content;
    padding: 15px 5px;

    & .table-control {
        display: flex;
        flex: 0 1 100%;
        height: fit-content;
        align-items: center;
        padding: 20px 5px 0 5px;
        overflow: hidden;
        
        .left-group {
            display: inline-flex;
            height: fit-content;
            align-items: center;
            transition: margin 400ms;            
        }

        .left-group[show='true'] {
            margin-left: 0;
        }

        .left-group[show='false'] {
            margin-left: -230px;
        }

        .input-area {
            display: flex;
            align-items: center;
            flex: 0 1 100%;
            padding-right: 10px;
            height: 50px;
            background-color: ${({theme}) => theme.background.lighter};
            border-radius: 5px;

            input,
            input:active,
            input:focus,
            input:hover {
                display: flex;
                flex: 0 1 100%;
                border: 0;
                outline: 0;
                height: 100%;
                /* font-size: 20px; */
                padding: 0;
                background-color:  transparent;
                color:  ${({theme}) => theme.textColor.strong};
            }

            .search-icon {
                /* font-size: 20px; */
                margin: 0 20px;
                color: ${({theme}) => theme.textColor.strong}
            }
        }
    }

    & .table-control ${Pagination} {
        margin-left: auto;
    }

    & .result-area {
        display: flex;
        flex-wrap: wrap;
        flex: 0 1 100%;
        height: fit-content;
        max-height: CALC(100vh - 35vh);
        margin-top: 10px;
        padding-bottom: 15px;
        overflow-x: auto;

        h1 {
            display: flex;
            flex: 0 1 100%;
            height: 300px;
            font-size: 30px;
            align-items: center;
            justify-content: center;
            color: ${({theme}) => theme.textColor.disabled}
            
        }

        .no-result {
            display: flex;
            flex: 0 1 100%;
            flex-wrap: wrap;
            height: 300px;
            align-items: center;
            align-content: center;
            justify-content: center;

            h1, .icon {
                display: flex;
                flex: 0 1 100%;
                height: fit-content;
                align-items: center;
                justify-content: center;
            }

            .icon {
                font-size: 50px;
                margin-bottom: 10px;
                color: ${({theme}) => theme.textColor.disabled}; 
            }
        }

        .result-item {
            display: flex;
            height: fit-content;
            flex: 0 1 100%;
            padding: 5px;
            align-items: center;
            margin: 1px 5px;
            /* background-color: ${({theme}) => theme.background.light}; */

            ${Avatar} {
                margin-right: 8px;
            }

            .name {
                flex: 1;
                font-size: 12px;
                color: ${({theme}) => theme.textColor.strong};
            }

            .btn-area {
                display: inline-flex;
            }
        }
    }
`;

interface ISearchResult {
    name: string,
    avatar: string,
    memberUID: string,
}

const Members: React.FC = () => {
    const admin = useAppSelector(state => state.setAdmin.admin);
    const navigate = useNavigate();
    const addSnackBar = useAddSnackBar()
    const {data: membersCount, isLoading: isLoadingMembersCount, isError: isErrorMembersCount, isSuccess: isSuccessMembersCount, refetch: refetchMembersCount} = useGetRecordCountQuery('members');
    const [getMembersList, { data: membersListData, isLoading: isLoadingMembersList, isError: isErrorMembersList}] = useGetMembersListMutation();

    const [addMemberRecordModal, updateAddMemberRecordModal] = React.useState<"close" | "ondisplay" | "open" | "remove" | "inactive">("inactive");
    const [modalIsLoading, updateModalIsLoading] = React.useState(false);
    const [totalPage, setTotalPage] = React.useState<null | number>(null)
   
    const [sorting, setSorting] = React.useState<"A-Z" | "Z-A">("A-Z");
    const [listLimit, setListLimit] = React.useState<null | number>(null);
    const [currentTablePage, updateCurrentTablePage] = React.useState<null | number>(1);

    const [searchActive, setSearchActive] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState('');

    const leftGroupToggleRef = React.useRef<null | HTMLDivElement>(null);

    const [isLoading, setIsLoading] = React.useState(false);
    const [result, setResults] = React.useState<null | ISearchResult[]>(null)

    let cancelTokenSource: CancelTokenSource | null = null;

    const performSearch = async (searchQuery: string) => {
        if(searchQuery) {
            setIsLoading(true);
    
            if (cancelTokenSource) {
                cancelTokenSource.cancel('Operation canceled by the user.');
            }
    
            cancelTokenSource = axios.CancelToken.source();
    
            try {
                const response = await axios({
                    url: "/search-member",
                    baseURL: API_BASE_URL,
                    method: "POST",
                    data: {
                        searchTerm: searchQuery
                    },
                    cancelToken: cancelTokenSource.token,
                });
    
                const responseFlag = response.data as TResponseFlag<ISearchResult[]>
                if(responseFlag.success) {
                    setResults(responseFlag.data as ISearchResult[] | null);
                } else throw responseFlag
            } catch (error: any) {
                if (axios.isCancel(error)) {
                    console.log('Request canceled:', error);
                } else {
                    console.log('Error:', error);
                }
            }
    
            setIsLoading(false);
        } else {
            isLoading && setIsLoading(false);
            if (cancelTokenSource) {
                cancelTokenSource.cancel('Operation canceled by the user.');
            }
            setResults(null)
        }
    };

    const debouncedSearch = debounce(performSearch, 300);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setSearchTerm(value);

        debouncedSearch(value);
    };

    React.useEffect(() => {
        isErrorMembersCount && addSnackBar("Failed to Load Members Count", "error", 5)
    }, [isErrorMembersCount]);

    React.useEffect(() => {
        if(listLimit && membersCount && membersCount.success) setTotalPage(Math.ceil(membersCount.data.total_count / listLimit));
    }, [membersCount, listLimit]);

    React.useEffect(() => {
        if(currentTablePage && sorting && listLimit) {
            getMembersList({
                sorting,
                page: currentTablePage,
                limit: listLimit
            });
        }
    }, [currentTablePage, sorting, listLimit, membersCount]);

    React.useEffect(() => {
        isErrorMembersList && addSnackBar('Faild to Load Members List', "error", 5);
    }, [isErrorMembersList]);

    React.useEffect(() => {
        const socket = io(SOCKETIO_URL);

        socket.on(`${admin?.congregation}-NEW_MEMBERS_RECORD_ADDED`, () => {
            refetchMembersCount();
        });

        socket.on(`${admin?.congregation}-DELETED_MEMBER_RECORD`, () => {
            refetchMembersCount();
        });

        return function () {
            socket.disconnect();
        }
    }, []);

    React.useEffect(() => {
        leftGroupToggleRef.current?.setAttribute('show', searchActive? "false" : "true");
    }, [searchActive])
    return (<>
    <RouteContentBase>
        <RouteContentBaseHeader>
            <strong>Members</strong>
            <Devider $orientation="vertical" $variant="center" $css="margin: 0 5px" />
            <SiteMap>
                / <Link to='/information'> information</Link>  / <Link to='/information/members'> members</Link>
            </SiteMap>
            <GoBackBtn />
        </RouteContentBaseHeader>
        <RouteContentBaseBody>
            <ContentWraper>
                <InformationRouteMainBoard 
                bgImage="/assets/images/church.png"
                verseText={{verse: 'Matthew 28:19-20 (NIV)', content: 'Therefore go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit,  and teaching them to obey everything I have commanded you. And surely I am with you always, to the very end of the age.”'}}
                dataFolderIcon={<FontAwesomeIcon icon={["fas", "users"]} />}
                dataFolderTitle="Members"
                dataFolderTotal={membersCount && membersCount.success && membersCount.data.total_count? membersCount.data.total_count : 0}
                addRecordFormUrl="./new-member"
                addRecordFN={() => updateAddMemberRecordModal("ondisplay")} />
                <div className="table-control">
                    <div className="left-group" ref={leftGroupToggleRef}>
                        <ShowEntriesCounter disabled={isLoadingMembersCount || isLoadingMembersList} onChange={(val) => setListLimit(val)} max={membersCount && membersCount.success && membersCount.data.total_count? membersCount.data.total_count : 100} />
                        <Devider $orientation="vertical" $css="height: 30px"/>
                        <SortToggle disabled={isLoadingMembersCount || isLoadingMembersList} active={sorting == "A-Z"} onClick={(e) => setSorting("A-Z")}><FontAwesomeIcon icon={["fas", "sort-alpha-down"]} /></SortToggle><SortToggle disabled={isLoadingMembersCount || isLoadingMembersList} active={sorting == "Z-A"} onClick={(e) => setSorting("Z-A")}><FontAwesomeIcon icon={["fas", "sort-alpha-down-alt"]} /></SortToggle>
                        <Devider $orientation="vertical" $css="height: 30px"/>
                    </div>
                    {
                        searchActive == false && <Button iconButton icon={<FontAwesomeIcon icon={["fas", "search"]} />} label="Search Button" variant="hidden-bg-btn" onClick={() => setSearchActive(true)} />
                    }
                    {
                        searchActive && 
                        <div className="input-area">
                            <span className="search-icon">
                                <FontAwesomeIcon icon={["fas", "search"]} />
                            </span>
                            <input autoFocus value={searchTerm} placeholder="Search for members" onChange={handleInputChange} />
                                {
                                    isLoading && <ScaleLoader color="#36d7b7" height={"10px"} style={{marginRight: "5px", width: '60px'}}/>
                                }
                            <Button 
                            onClick={() => {
                                setSearchTerm("");
                                isLoading && setIsLoading(false);
                                if (cancelTokenSource) {
                                    cancelTokenSource.cancel('Operation canceled by the user.');
                                }
                                setResults(null);
                            }} label="" variant="hidden-bg-btn" iconButton icon={<FontAwesomeIcon icon={["fas", "times"]} />} />
                            <Devider $variant="center" $orientation="vertical" $flexItem $css="margin-left: 10px;margin-right: 10px;height: 60%"/>
                            <Button onClick={() => setSearchActive(false)} label="Close" variant="hidden-bg-btn" />
                        </div>
                    }
                    { searchActive == false && totalPage !== null && <Pagination disabled={isLoadingMembersCount || isLoadingMembersList} totalPage={totalPage} onChange={(value) => updateCurrentTablePage(value)} /> }
                </div>
                {
                    searchActive? <div className="result-area">
                    {
                        result == null && <h1>Type the name of the member to search...</h1>
                    }
                    {
                        result != null && result.length == 0 && <span className="no-result">
                            <span className="icon"><FontAwesomeIcon icon={["fas", "tired"]} /></span>
                            <h1>No result found!</h1>
                        </span>
                    }
                    {
                        result != null && result.length != 0 && result.map(item => (
                            <div className="result-item">
                                <Avatar src={item.avatar} alt={item.name} size="30px" />
                                <p className="name">{ item.name }</p>
                                <div className="btn-area">
                                    <Button label="Edit Info" icon={<FontAwesomeIcon icon={["fas", "user-pen"]} />} variant="hidden-bg-btn" color="edit" iconButton onClick={() => navigate(`/app/information/members/edit/${item.memberUID}`)} />
                                    <Button label="View Member" icon={<FontAwesomeIcon icon={["fas", "user"]} />} variant="hidden-bg-btn" color="primary" iconButton onClick={() => navigate(`/app/information/members/view/${item.memberUID}`)} />
                                </div>
                            </div>
                        ))
                    }
                    </div> : 
                    <MembersTable
                    expectedListLen={listLimit? listLimit : 0}
                    isLoading={isLoadingMembersList || isLoadingMembersList}
                    membersList={
                        membersListData && membersListData.querySuccess && membersListData.result? membersListData.result : []
                    } />
                }
            </ContentWraper>                
        </RouteContentBaseBody>
    </RouteContentBase>
    { 
        (addMemberRecordModal == "open" || addMemberRecordModal == "ondisplay" || addMemberRecordModal == "close") && 
        <Modal isLoading={modalIsLoading} state={addMemberRecordModal} title="Add Member Record" onClose={() => updateAddMemberRecordModal("remove")} maxWidth="1000px"> 
            <MembershipFormModalView 
            onError={() => {
                updateModalIsLoading(false);
                addSnackBar("Query Failed!", "error", 5)
            }}
            onSuccess={() => {
                addSnackBar("Record Added Successfully!", "success", 5);
                updateModalIsLoading(false)
            }} 
            onLoading={() => updateModalIsLoading(true)}/>
        </Modal>
    }
    </>)
};

export default Members;