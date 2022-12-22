import styled from "styled-components";
import React from "react";

//Reusable Components
import Avatar from "./reusables/Avatar";
import UseRipple from "./reusables/Ripple/UseRipple";

const UserAvatarContainer = styled(UseRipple)`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 65px;
    width: 65px;
    border-left: 1px solid  ${({theme}) => theme.borderColor};
    background-color: ${({theme}) => theme.background.light};
`;

const UserAvatar: React.FC = () => {
    return (
        <UserAvatarContainer>
            <Avatar size='40px' alt="Bpple" src="/assets/images/avatar/apple.png"/>
        </UserAvatarContainer>
    )
};

export default UserAvatar;