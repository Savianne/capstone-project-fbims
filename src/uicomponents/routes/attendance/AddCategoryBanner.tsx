import styled from "styled-components";

const AddCategoryBanner = styled.div`
    display: flex;
    flex: 0 1 100%;
    flex-wrap: wrap;
    justify-content: center;
    border-radius: 5px;
    padding: 0 30px 30px 30px;
    margin: 0 10px;
    background-color: ${({theme}) => theme.background.lighter};

    && img {
        width: 50%;
    }

    && .primary-text, && .secondary-text {
        display: flex;
        flex: 0 1 100%;
        text-align: center;
        line-height: 1;
        color: #2197f4;
        justify-content: center;
        font-size: 40px;
        /* font-variant: all-small-caps; */
        font-weight: bolder;
    }

    && .secondary-text {
        margin-top: 10px;
        font-size: 20px;
        color: #CDDC39;
        font-weight: normal;
        font-variant: normal;
    }
`;

export default AddCategoryBanner;