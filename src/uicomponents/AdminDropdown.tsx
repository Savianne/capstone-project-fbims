import styled from "styled-components";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { IStyledFC } from "./IStyledFC";

//Reusable Components
import Avatar from "./reusables/Avatar";
import UseRipple from "./reusables/Ripple/UseRipple";
import Stack, { StackItem } from "./reusables/Stack";

const FCAdminDropdown: React.FC<IStyledFC> = ({className}) => {
    return (
        <div className={className}>
            <UseRipple>
                <Avatar size='35px' alt="Bpple" src="/assets/images/avatar/apple.png" />
                <Stack>
                    <StackItem><p>Apple Jane De Guzmanssssssssssssss</p></StackItem>
                    <StackItem><p>Roxas Church of Christ</p></StackItem>
                </Stack>
                <div className="dropdown-icon">
                    <FontAwesomeIcon icon={["fas", "caret-down"]} />
                </div>
            </UseRipple>
        </div>
    )
}

const AdminDropdown = styled(FCAdminDropdown)`
    display: flex;
    flex: 0 1 250px;
    width: fit-content;
    height: 65px;
    border-left: 1px solid  ${({theme}) => theme.borderColor};
    font-size: 11px;
    color: ${({theme}) => theme.textColor.strong};
    min-width: 0;

    & ${UseRipple} {
        padding: 0 15px;
        display: flex;
        flex: 0 1 100%;
        height: 100%;
        align-items: center;
        justify-content: center;
        min-width: 0;
    }

    & ${UseRipple} ${Avatar} {
        margin-right: 10px;
    }

    & ${UseRipple} .dropdown-icon {
        font-size: 15px;
        margin-left: 10px;
    }

    ${UseRipple} ${Stack} {
        min-width: 0;
    }

    ${UseRipple} ${Stack} ${StackItem} {
        display: flex;
        min-width: 0;
    }

    & ${UseRipple} ${Stack} ${StackItem} p {
        flex: 1;
        min-width: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    & ${UseRipple} ${Stack} ${StackItem}:first-child {
        font-size: 13px;
    }

    & ${UseRipple} ${Stack} ${StackItem}:last-child {
        color: ${({theme}) => theme.textColor.light};
    }

    @media screen and (max-width: 660px) {
        & {
           flex: 0 1 fit-content;
        }

        & ${UseRipple} ${Avatar} {
            margin-right: 0;
        }
        
        & ${UseRipple} .dropdown-icon,
        ${UseRipple} ${Stack} {
            display: none;
        }
    }

    
`;

// const UserAvatarContainer = styled(UseRipple)`
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     height: 65px;
//     width: 65px;
//     border-left: 1px solid  ${({theme}) => theme.borderColor};
//     background-color: ${({theme}) => theme.background.light};
// `;

// const UserAvatar: React.FC = () => {
//     return (
//         <UserAvatarContainer>
//             <Avatar size='40px' alt="Bpple" src="/assets/images/avatar/apple.png"/>
//         </UserAvatarContainer>
//     )
// };

export default AdminDropdown;