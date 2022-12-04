import React from "react";
import styled from "styled-components";

import { IStyledFC } from "../IStyledFC";
import Avatar from "./Avatar";

interface IAvatar {
    alt: string,
    src?: string,
}

interface IFCAvatarGroup extends IStyledFC {
    avatars: IAvatar[],
    limit?: number,
    size: string
}

const FCAvatarGroup: React.FC<IFCAvatarGroup> = ({className, size, limit, avatars}) => {
    const [avatarList, updateAvatarList] = React.useState<null | typeof avatars>(null);
    const elemRef = React.useRef<null | HTMLDivElement>(null);

    React.useEffect(() => {
        if(limit && avatars.length && limit < avatars.length) {
            updateAvatarList(avatars.slice(0, limit));
        } else {
            updateAvatarList(avatars);
        }
    }, [avatars, limit]);
    return (
        <div className={className} style={{backgroundColor: elemRef.current?.parentElement?.style.backgroundColor , borderColor: elemRef.current?.style.backgroundColor}} ref={elemRef}>
            {
                avatarList? avatarList.map(avatar => {
                    return (
                        <span className="avatar-wraper">
                            <Avatar src={avatar.src} alt={avatar.alt} size={size} />
                        </span>
                    )
                }) : ''
            }
            {
                limit && avatars && limit < avatars.length? <>
                    <p>+ {avatars.length - limit}</p>
                </> : ''
            }
        </div>
    )
}

const AvatarGroup = styled(FCAvatarGroup)`
    display: flex;
    width: fit-content;
    height: fit-content;
    align-items: center;
    background-color: inherit;

    & .avatar-wraper {
        display: flex;
        width: fit-content;
        height: fit-content;
        padding: 3px;
        margin-left: -6px;
        background-color: inherit;
        border-radius: 50%;
    }

    & .avatar-wraper ${Avatar} {
        border: none;
    }
    
    & .avatar-wraper:first-child {
        margin-left: 0;
    }

    & p {
        margin-left: 5px;
        color: ${({theme}) => theme.textColor.strong};
    }

`;

export default AvatarGroup;