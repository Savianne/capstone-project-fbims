import React from "react";
import styled from "styled-components";
import { IStyledFC } from "../../../IStyledFC";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../../../reusables/Buttons/Button";
import Avatar from "../../../reusables/Avatar";
import doRequest from "../../../../API/doRequest";
import useAddSnackBar from "../../../reusables/SnackBar/useSnackBar";
import ConfirmModal from "../../../reusables/ConfirmModal/ConfirmModal";
import useConfirmModal from "../../../reusables/ConfirmModal/useConfirmModal";
import DataDisplayChip from "../../../reusables/DataDisplayChip";

interface IPresentAttendeesGrid extends IStyledFC {
    attenders: ({ name: string, picture: string | null, memberUID: string})[],
    entryUID: string,
    isPendingEntry: boolean;
    // onRemoved: (uid:string) => void,
}

const PresentAttendeesGridFC: React.FC<IPresentAttendeesGrid> = ({className, attenders, entryUID, isPendingEntry}) => {
    return(
        <div className={className}>
            {
                attenders.map(attender => <AttenderCard isPendingEntry={isPendingEntry} entryUID={entryUID} key={attender.memberUID} {...attender} />)
            }
        </div>
    )
};

interface IAttenderCard extends IStyledFC {
   name: string, 
   picture: string | null, 
   memberUID: string,
   entryUID: string,
   isPendingEntry: boolean;
}

const AttenderCardFC: React.FC<IAttenderCard> = ({className, name, picture, memberUID, entryUID, isPendingEntry }) => {
    const addSnackBar = useAddSnackBar();
    const [onDelete, setOnDelete] = React.useState(false);
    const {modal, confirm} = useConfirmModal();

    return(
        <div className={className}>
            <ConfirmModal context={modal} variant={"default"} />
            <Avatar src={picture} alt={name} size="80px"/>
            <strong className="attender-name">{name}</strong>
            <DataDisplayChip variant="outlined" severity="success" icon={<FontAwesomeIcon icon={['fas', "check"]} />}>Present</DataDisplayChip>
            {
                isPendingEntry?
                <Button isLoading={onDelete} label="Remove" icon={<FontAwesomeIcon icon={['fas', 'times']}/>} color="delete" variant="hidden-bg-btn"
                onClick={() => {
                    confirm("Remove Present", `Are you sure you want to remove ${name} as present?`, () => {
                        setOnDelete(true);
                        doRequest({
                            method: "DELETE",
                            url: `/attendance/remove-present/${entryUID}/${memberUID}`,
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
    )
}

const AttenderCard = styled(AttenderCardFC)`
    display: flex;
    flex-wrap: wrap;
    flex: 0 0 150px;
    padding: 20px 5px;
    height: 180px;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    background-color: ${({theme}) => theme.background.primary};
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);

    && > .attender-name {
        display: flex;
        flex: 0 1 100%;
        justify-content: center;
        text-align: center;
        font-size: 13px;
        font-weight: 600;
        margin: 5px 0;
        color: ${({theme}) => theme.textColor.strong};
    }

    > ${Button} {
        margin-top: 10px;
    }
`

const PresentAttendeesGrid = styled(PresentAttendeesGridFC)`
    flex: 1.5;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    grid-gap: 10px;
    padding: 20px;
`

export default PresentAttendeesGrid;