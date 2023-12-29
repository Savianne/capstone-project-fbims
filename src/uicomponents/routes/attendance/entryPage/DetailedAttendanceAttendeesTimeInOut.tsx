import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IStyledFC } from "../../../IStyledFC";
import { TDetailedAttendanceAttendeesRenderType } from "./EntryPage";
import Avatar from "../../../reusables/Avatar";
import Button from "../../../reusables/Buttons/Button";
import useConfirmModal from "../../../reusables/ConfirmModal/useConfirmModal";
import useAddSnackBar from "../../../reusables/SnackBar/useSnackBar";
import doRequest from "../../../../API/doRequest";
import ConfirmModal from "../../../reusables/ConfirmModal/ConfirmModal";
import convertTo12HourFormat from "../../../../utils/helpers/convertTo12Hrs";
import DataDisplayChip from "../../../reusables/DataDisplayChip";
import UseRipple from "../../../reusables/Ripple/UseRipple";
import SpinnerLoadingIndicator from "../../../reusables/SpinnerLoadingIndicator";

const ActionBtn = styled(UseRipple)`
    display: flex;
    font-size: 10px;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    cursor: pointer;
`;

const EditActionBtn = styled(ActionBtn)`
    color: ${({theme}) => theme.staticColor.edit};
`;

const RemoveActionBtn = styled(ActionBtn)`
    color: ${({theme}) => theme.staticColor.delete};
`

interface IDetailedAttendanceAttendeeTimeInOut extends IStyledFC {
    attendanceInfo: TDetailedAttendanceAttendeesRenderType;
    isPendingEntry: boolean;
}

const DetailedAttendanceAttendeeTimeInOutFC: React.FC<IDetailedAttendanceAttendeeTimeInOut> = ({className, attendanceInfo, isPendingEntry}) => {
    const addSnackBar = useAddSnackBar();
    const [onDelete, setOnDelete] = React.useState(false);
    const {modal, confirm} = useConfirmModal();

    return (
        <div className={className}>
            <ConfirmModal context={modal} variant={"delete"} />
            <div className="attender-info">
                <Avatar src={attendanceInfo.picture} alt={attendanceInfo.name} size="60px" />
                <strong>{attendanceInfo.name}</strong>
                {
                    isPendingEntry? 
                    <Button isLoading={onDelete} label="Remove" icon={<FontAwesomeIcon icon={['fas', 'times']}/>} color="delete" variant="hidden-bg-btn"
                    onClick={() => {
                        confirm("Delete Time", `Are you sure you want to remove ${attendanceInfo.name} as present?`, () => {
                            setOnDelete(true);
                            doRequest({
                                method: "DELETE",
                                url: `/attendance/remove-time-in-out/${attendanceInfo.entryUID}/${attendanceInfo.memberUID}`,
                            })
                            .then(response => {
                                if(response.success) {
                                    setTimeout(() => {
                                        addSnackBar("Remove Success!", "default", 5);
                                    }, 500)
                                } else throw response
                            })
                            .catch(err => {
                                setOnDelete(false)
                                addSnackBar("Failed to remove. Try again.", "error", 5)
                            })
                        })
                    }}/> : ""
                }
            </div>
            <div className="time-in-out-table-container">
                <table>
                    <tr>
                        <th className="time-in">Time-in</th>
                        <th className="time-out">Time-out</th>
                        {
                            isPendingEntry? <th className="action">Actions</th> : ""
                        }
                    </tr>
                    {
                        attendanceInfo.timeInOut.map(time_in_out => (
                            <TableRow isPendingEntry={isPendingEntry} key={time_in_out.id} timeInOut={time_in_out} entrySession={attendanceInfo.entrySession} entryUID={attendanceInfo.entryUID} memberUID={attendanceInfo.memberUID} />
                        ))
                    }
                </table>
            </div>
        </div>
    );
}

interface ITableRowProps extends IStyledFC {
    entrySession: number;
    entryUID: string;
    memberUID: string;
    timeInOut: {id: number, timeIn: string, timeOut: string | null};
    isPendingEntry: boolean
}

const TableRowFC: React.FC<ITableRowProps> = ({className, entrySession, entryUID, memberUID, timeInOut, isPendingEntry}) => {
    const [onDeleteState, setOnDeleteState] = React.useState(false);
    const {modal, confirm: confirmDelete} = useConfirmModal()
    const addSnackBar = useAddSnackBar();

    return (
        <tr className={className}>
            <td className="time-in">
                <DataDisplayChip clickable severity="info" icon={<FontAwesomeIcon icon={['far', "clock"]} />}>{convertTo12HourFormat(timeInOut.timeIn)}</DataDisplayChip>
            </td>
            <td className="time-out">{timeInOut.timeOut? <DataDisplayChip severity="info" icon={<FontAwesomeIcon icon={['far', "clock"]} />}>{convertTo12HourFormat(timeInOut.timeOut)}</DataDisplayChip> : "--:--:--"}</td>
            {
                isPendingEntry? 
                <td className="action">
                    <ConfirmModal context={modal} variant="delete"/>
                    <div className="action-btn-group">
                        {/* <EditActionBtn onClick={() => {}}>
                            <FontAwesomeIcon icon={['fas', 'edit']} />
                        </EditActionBtn> */}
                        <RemoveActionBtn onClick={() => {
                            confirmDelete('Delete Time', "Are you sure about this action? This can not be undone!", () => {
                                doRequest({
                                    method: "DELETE",
                                    url: `/attendance/remove-time-in-out-by-id/${entryUID}/${memberUID}/${timeInOut.id}`
                                })
                                .then(res => {
                                    addSnackBar("Delete Success", "default", 5);
                                })
                                .catch(err => {
                                    addSnackBar("Failed to delete", "error", 5)
                                })
                            })
                        }}>
                            {
                                onDeleteState? <SpinnerLoadingIndicator msSpeed={1000} /> : <FontAwesomeIcon icon={['fas', 'trash']} />
                            }
                        </RemoveActionBtn>    
                    </div>
                </td> : ""
            }
        </tr>
    )
}

const TableRow = styled(TableRowFC)`
    && > td > .action-btn-group {
        display: flex;
        width: 100%;
        justify-content: center;
        height: fit-content;
    }

    && > td > ${ConfirmModal} {
        text-align: left;
    }

`

const DetailedAttendanceAttendeeTimeInOut = styled(DetailedAttendanceAttendeeTimeInOutFC)`
    display: flex;
    flex: 0 1 100%;
    flex-wrap: wrap;
    justify-content: center;
    padding: 15px;
    gap: 15px;
    color: ${({theme}) => theme.textColor.strong};
    
    && .attender-info {
        display: flex;
        flex-direction:column; 
        justify-content: center;
        align-items: center;
        flex: 0 0 150px;
        height: fit-content;

        strong {
            font-size: 13px;
            text-align: center;
            font-weight: 600;
            margin-top: 5px;
        }
    }

    && .time-in-out-table-container {
        display: flex;
        flex: 1 0 300px;
        background-color: ${({theme}) => theme.background.primary};
        border-radius: 4px;
        border: 1px solid ${({theme}) => theme.borderColor};
        padding: 10px;

        table {
            border-radius: 4px;
            border: 1px solid ${({theme}) => theme.borderColor};
            border-collapse: collapse;
            width: 100%;
            table-layout: fixed;

            tr {
                width: 100%;
            }

            tr > th {
                background-color: ${({theme}) => theme.background.lighter};
            }

            tr > th, tr > td {
                text-align: center;
                border: 1px solid ${({theme}) => theme.borderColor};
                padding: 10px;
                font-weight: 600;
            }

            tr > .time-in, tr > .time-out {
                width: calc((100% - 124px) / 2);
            }

            tr > .action {
                width: 60px;
            }
        }
    }
`;

export default DetailedAttendanceAttendeeTimeInOut;


