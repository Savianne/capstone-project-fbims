import React from "react";
import styled from "styled-components";

import Avatar from "../reusables/Avatar";

import { IStyledFC } from "../IStyledFC";

interface IAvatarInfo {
    src?: string,
    alt: string,
}

interface IFCDynamicAvatarList extends IStyledFC {
    avatarSize: string,
    avatarsInfo: IAvatarInfo[],
}

const FCDynamicAvatarList: React.FC<IFCDynamicAvatarList> = ({className, children, avatarsInfo, avatarSize}) => {
    const parentRef = React.useRef<null | HTMLDivElement>(null);

    React.useEffect(() => {
        const resize_observer = new ResizeObserver(entries => {
            console.log(entries[0].contentRect.width)
        });

        if(parentRef)  resize_observer.observe(parentRef.current as Element);

    }, []);

    return (
        <div className={className} ref={parentRef}>
            {
                avatarsInfo.map(avatar => {
                    return (
                        <Avatar {...avatar} size={avatarSize} />
                    )
                })
            }
        </div>
    )
}

const DynamicAvatarList = styled(FCDynamicAvatarList)`
    display: flex;
    flex: 1;
    height: fit-content;
    /* background-color: pink; */

    & ${Avatar} {
        border: 0;
        margin: 2px;
    }

`

export default DynamicAvatarList;