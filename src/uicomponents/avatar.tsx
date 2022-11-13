import styled from "styled-components";

interface IAvatar {
    size: string,
    url: string,
}
const Avatar = styled.i<IAvatar>`
    display: flex;
    height: ${({size}) => size};
    width: ${({size}) => size};
    background-image: url(${({url}) => url});
    border: 2px solid ${({theme}) => theme.borderColor};
    border-radius: 50%;
    background-size: cover;
    background-repeat: no-no-repeat;
`;

export default Avatar;