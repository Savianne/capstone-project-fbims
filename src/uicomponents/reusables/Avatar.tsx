import styled, { css } from "styled-components";
import React from "react";
import { IStyledFC } from "../IStyledFC";
import { AVATAR_BASE_URL } from "../../API/BASE_URL";

interface IFCAvatar extends IStyledFC {
    src?: string | null,
    alt: string,
    size: string,
} 

const FCAvatar: React.FC<IFCAvatar> = ({src, alt, className, size}) => {
    const [avatarSrc, setAvatarSrc] = React.useState<"init" | boolean>('init');
    
    React.useEffect(() => {
        if(src) {
            fetch(`${AVATAR_BASE_URL}/${src}`)
            .then(res => {
                res.status == 200?  setAvatarSrc(true) :  setAvatarSrc(false)
            })
            .catch(err => {
                setAvatarSrc(false);
            })
        } else setAvatarSrc(false);
    }, [src]);

    return (
        avatarSrc == "init"? 
        <i className={className}>
            {alt[0].toUpperCase()}
        </i> : 
        avatarSrc? <i className={className}></i> :
        <i className={className}>
            {alt[0].toUpperCase()}
        </i>

    )
}


const Avatar = styled(FCAvatar)`
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    height: ${({size}) => size};
    width:  ${({size}) => size};
    flex: 0 0 ${({size}) => size};
    border: 2px solid ${({theme}) => theme.borderColor};
    border-radius: 50%;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    font-size: 1.2em;
    background-color: #15A9FD;
    ${({src, theme}) => {
        return src? css`background-image: url(${AVATAR_BASE_URL}/${src});` : css`background-color: #15A9FD;`
    }}
`;

export default Avatar;

// import styled, { css } from "styled-components"
// import { IStyledFC } from "../IStyledFC";


// interface IFCAvatar extends IStyledFC {
//     src?: string,
//     alt: string,
//     size: string,
// } 

// const FCAvatar: React.FC<IFCAvatar> = ({src, alt, className, size}) => {

//     return (
//         <i className={className}>
//             {!src? alt[0].toUpperCase() : ''}
//         </i>
//     )
// }


// const Avatar = styled(FCAvatar)`
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     color: #fff;
//     height: ${({size}) => size};
//     width:  ${({size}) => size};
//     flex: 0 0 ${({size}) => size};
//     border: 2px solid ${({theme}) => theme.borderColor};
//     border-radius: 50%;
//     background-position: center;
//     background-repeat: no-repeat;
//     background-size: cover;
//     font-size: 1.2em;
//     ${({src, theme}) => {
//         return src? css`background-image: url(${src});` : css`background-color: ${theme.staticColor.primary};`
//     }}
// `;

// export default Avatar;