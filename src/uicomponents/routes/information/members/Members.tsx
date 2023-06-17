import { Link, useNavigate } from "react-router-dom";
import React from "react";
import styled, { css } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RouteContentBase, { RouteContentBaseHeader, RouteContentBaseBody } from "../../RouteContentBase";
import { IStyledFC } from "../../../IStyledFC";

import { io } from 'socket.io-client';

//API
import { useGetRecordCountQuery } from "../../../../global-state/api/api";
import { useGetMembersListMutation } from "../../../../global-state/api/api";

import Pagenation from "../../../reusables/Pagenation/Pagenation";
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
        align-items: center;
        height: fit-content;
        padding: 20px 5px 0 5px;
    }

    & .table-control ${Pagenation} {
        margin-left: auto;
    }
`;

const Members: React.FC = () => {
    const addSnackBar = useAddSnackBar()
    const {data: membersCount, isLoading: isLoadingMembersCount, isError: isErrorMembersCount, isSuccess: isSuccessMembersCount, refetch: refetchMembersCount} = useGetRecordCountQuery('members');
    const [getMembersList, { data: membersListData, isLoading: isLoadingMembersList, isError: isErrorMembersList}] = useGetMembersListMutation();

    const [addMemberRecordModal, updateAddMemberRecordModal] = React.useState<"close" | "ondisplay" | "open" | "remove" | "inactive">("inactive");
    const [modalIsLoading, updateModalIsLoading] = React.useState(false);
    const [totalPage, setTotalPage] = React.useState<null | number>(null)
   
    const [sorting, setSorting] = React.useState<"A-Z" | "Z-A">("A-Z");
    const [listLimit, setListLimit] = React.useState<null | number>(null);
    const [currentTablePage, updateCurrentTablePage] = React.useState<null | number>(1);

    React.useEffect(() => {
        isErrorMembersCount && addSnackBar("Failed to Load Members Count", "error", 5)
    }, [isErrorMembersCount]);

    React.useEffect(() => {
        if(listLimit && membersCount && membersCount.querySuccess) setTotalPage(Math.ceil(membersCount.result.total_count / listLimit));
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
        const socket = io('http://localhost:3008');

        socket.on('NEW_MEMBERS_RECORD_ADDED', () => {
            refetchMembersCount();
        });

        socket.on('DELETED_MEMBER_RECORD', () => {
            refetchMembersCount();
        });

        return function () {
            socket.disconnect();
        }
    }, []);

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
                dataFolderTotal={membersCount && membersCount.querySuccess && membersCount.result.total_count? membersCount.result.total_count : 0}
                addRecordFormUrl="./new-member"
                addRecordFN={() => updateAddMemberRecordModal("ondisplay")} />
                <div className="table-control">
                    <ShowEntriesCounter disabled={isLoadingMembersCount || isLoadingMembersList} onChange={(val) => setListLimit(val)} max={membersCount && membersCount.querySuccess && membersCount.result.total_count? membersCount.result.total_count : 100} />
                    <Devider $orientation="vertical" $css="height: 30px"/>
                    <SortToggle disabled={isLoadingMembersCount || isLoadingMembersList} active={sorting == "A-Z"} onClick={(e) => setSorting("A-Z")}><FontAwesomeIcon icon={["fas", "sort-alpha-down"]} /></SortToggle><SortToggle disabled={isLoadingMembersCount || isLoadingMembersList} active={sorting == "Z-A"} onClick={(e) => setSorting("Z-A")}><FontAwesomeIcon icon={["fas", "sort-alpha-down-alt"]} /></SortToggle>
                    <Devider $orientation="vertical" $css="height: 30px"/>
                    <Button iconButton icon={<FontAwesomeIcon icon={["fas", "search"]} />} label="Search Button" variant="hidden-bg-btn" />
                    { totalPage !== null && <Pagenation disabled={isLoadingMembersCount || isLoadingMembersList} totalPage={totalPage} onChange={(value) => updateCurrentTablePage(value)} /> }
                </div>
                <MembersTable
                expectedListLen={listLimit? listLimit : 0}
                isLoading={isLoadingMembersList || isLoadingMembersList}
                membersList={
                    membersListData && membersListData.querySuccess && membersListData.result? membersListData.result : []
                } />
                <div className="table-control">
                </div>
            </ContentWraper>                
        </RouteContentBaseBody>
    </RouteContentBase>
    { 
        (addMemberRecordModal == "open" || addMemberRecordModal == "ondisplay" || addMemberRecordModal == "close") && 
        <Modal isLoading={modalIsLoading} state={addMemberRecordModal} title="Add Member Record" onClose={() => updateAddMemberRecordModal("remove")} maxWidth="1000px"> 
            <MembershipFormModalView onError={() => updateModalIsLoading(false)} onSuccess={() => updateModalIsLoading(false)} onLoading={() => updateModalIsLoading(true)}/>
        </Modal>
    }
    </>)
};

export default Members;