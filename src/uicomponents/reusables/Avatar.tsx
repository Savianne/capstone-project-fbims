import styled, { css } from "styled-components";
import { IStyledFC } from "../IStyledFC";


interface IFCAvatar extends IStyledFC {
    src?: string,
    alt: string,
    size: string,
} 

const FCAvatar: React.FC<IFCAvatar> = ({src, alt, className, size}) => {

    return (
        <i className={className}>
            {!src? alt[0].toUpperCase() : ''}
        </i>
    )
}


const Avatar = styled(FCAvatar)`
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    height: ${({size}) => size};
    width: ${({size}) => size};
    border: 2px solid ${({theme}) => theme.borderColor};
    border-radius: 50%;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    font-size: 1.2em;
    ${({src, theme}) => {
        return src? css`background-image: url(${src});` : css`background-color: ${theme.staticColor.primary};`
    }}
`;

export default Avatar;