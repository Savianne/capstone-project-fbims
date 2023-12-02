import React from "react";
import styled from "styled-components";
import { IStyledFC } from "../../../IStyledFC";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../../../reusables/Buttons/Button";
import Avatar from "../../../reusables/Avatar";
import doRequest from "../../../../API/doRequest";
import useAddSnackBar from "../../../reusables/SnackBar/useSnackBar";

interface IAttendersGrid extends IStyledFC {
    attenders: ({ name: string, picture: string | null, memberUID: string})[],
    categoryUID: string,
    onRemoved: (uid:string) => void,
}

const AttendersTabContentFC: React.FC<IAttendersGrid> = ({className, attenders, onRemoved, categoryUID}) => {
    return(
        <div className={className}>
            {
                attenders.map(attender => <AttenderCard onRemoved={(uid) => onRemoved(uid)} categoryUID={categoryUID} key={attender.memberUID} {...attender} />)
            }
        </div>
    )
};

interface IAttenderCard extends IStyledFC {
   name: string, 
   picture: string | null, 
   memberUID: string,
   categoryUID: string,
   onRemoved: (uid:string) => void,
}

const AttenderCardFC: React.FC<IAttenderCard> = ({className, name, picture, memberUID,categoryUID, onRemoved}) => {
    const addSnackBar = useAddSnackBar();
    const [onDelete, setOnDelete] = React.useState(false);

    return(
        <div className={className}>
            <Avatar src={picture} alt={name} size="60px"/>
            <strong className="attender-name">{name}</strong>
            <Button isLoading={onDelete} label="Remove" icon={<FontAwesomeIcon icon={['fas', 'times']}/>} color="theme" variant="hidden-bg-btn"
            onClick={() => {
                setOnDelete(true);
                doRequest({
                    method: "DELETE",
                    url: `/attendance/remove-category-attender/${categoryUID}/${memberUID}`,
                })
                .then(response => {
                    if(response.success) {
                        setTimeout(() => {
                            onRemoved(memberUID);
                            setOnDelete(false)
                            addSnackBar("Remove Success!", "default", 5);
                        }, 500)
                    } else throw response
                })
                .catch(err => {
                    addSnackBar("Failed to remove. Try again.", "error", 5)
                })
            }}/>
        </div>
    )
}

const AttenderCard = styled(AttenderCardFC)`
    display: flex;
    flex-wrap: wrap;
    flex: 0 0 140px;
    padding: 20px 5px;
    height: 160px;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    background-color: ${({theme}) => theme.background.primary};

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
`

const AttendersGrid = styled(AttendersTabContentFC)`
    flex: 1.5;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    grid-gap: 10px;
    padding: 20px 0;
`

export default AttendersGrid;