import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface ISiteMap {
    className?: string,
    children?: React.ReactChild | React.ReactChild[],
}

const FCSiteMap: React.FC<ISiteMap> = ({className, children}) => {
    return (
        <div className={className}>
            <span className='icon'>
                <FontAwesomeIcon icon={["fas", "sitemap"]} />
            </span>
            { children }
        </div>
    );
}

const SiteMap = styled(FCSiteMap)`
    display: flex;
    width: fit-content;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: ${({theme}) => theme.staticColor.primary};

    & .icon {
        font-size: 11px;
        margin-right: 5px;
        color: ${({theme}) => theme.textColor.light}
    }

    & a {
        text-decoration: none;
        color: inherit;
    }

    & a:hover {
        text-decoration: underline;
        color: inherit;
    }

`

export default SiteMap;