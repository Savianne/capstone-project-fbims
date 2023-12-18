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

interface IDetailedAttendanceAttendeeTimeInOut extends IStyledFC {
    attendanceInfo: TDetailedAttendanceAttendeesRenderType;
}

const DetailedAttendanceAttendeeTimeInOutFC: React.FC<IDetailedAttendanceAttendeeTimeInOut> = ({className, attendanceInfo}) => {
    const addSnackBar = useAddSnackBar();
    const [onDelete, setOnDelete] = React.useState(false);
    const {modal, confirm} = useConfirmModal();
    return (
        <div className={className}>
            <ConfirmModal context={modal} variant={"default"} />
            <div className="attender-info">
                <Avatar src={attendanceInfo.picture} alt={attendanceInfo.name} size="60px" />
                <strong>{attendanceInfo.name}</strong>
                <Button isLoading={onDelete} label="Remove" icon={<FontAwesomeIcon icon={['fas', 'times']}/>} color="delete" variant="hidden-bg-btn"
                onClick={() => {
                    confirm("Remove Attendee", `Are you sure you want to remove ${attendanceInfo.name} as present?`, () => {
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
                }}/>
            </div>
            <div className="time-in-out-table-container">
                <table>
                    <tr>
                        <th>Time-in</th>
                        <th>Time-out</th>
                    </tr>
                    {
                        attendanceInfo.timeInOut.map(time_in_out => (
                            <tr>
                                <td>{convertTo12HourFormat(time_in_out.timeIn)}</td>
                                <td>{time_in_out.timeOut? convertTo12HourFormat(time_in_out.timeOut) : "--:--:--"}</td>
                            </tr>
                        ))
                    }
                </table>
            </div>
        </div>
    );
}

const DetailedAttendanceAttendeeTimeInOut = styled(DetailedAttendanceAttendeeTimeInOutFC)`
    display: flex;
    flex: 0 1 100%;
    padding: 15px;
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
        margin-left: 15px;
        flex: 1;
        background-color: ${({theme}) => theme.background.primary};
        border-radius: 4px;
        border: 1px solid ${({theme}) => theme.borderColor};
        padding: 10px;

        table {
            border-radius: 4px;
            border: 1px solid ${({theme}) => theme.borderColor};
            width: 100%;

            tr th {
                background-color: ${({theme}) => theme.background.lighter};
            }

            tr th, tr td {
                text-align: center;
                border: 1px solid ${({theme}) => theme.borderColor};
                padding: 10px;
                font-weight: 600;
                width: 50%;
            }

            tr td {
                font-weight: bold;
            }
        }
    }
`;

export default DetailedAttendanceAttendeeTimeInOut;


