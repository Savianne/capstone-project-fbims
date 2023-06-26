import styled from "styled-components";
import Avatar from "../reusables/Avatar";

const SearchStyled = styled.div`
    position: fixed;
    display: flex;
    width: 100%;
    height: 100vh;
    background-color: ${({theme}) => theme.mode == "dark"? "#00000073" : "#1e1e1e38"};
    z-index: 5000;
    left: 0;
    top: 0;
    justify-content: center;

    .search-modal {
        display: flex;
        flex-wrap: wrap;
        width: 900px;
        height: fit-content;
        background-color:  ${({theme}) => theme.background.primary};
        color:  ${({theme}) => theme.textColor.strong};
        margin-top: 100px;
        border-radius: 5px;
        box-shadow: 17px 20px 61px 21px rgb(0 0 0 / 25%);
        
        .input-area {
            display: flex;
            align-items: center;
            flex: 0 1 100%;
            padding-right: 10px;
            height: 70px;
            box-shadow: -1px 18px 5px -18px rgba(112,112,112,0.33);

            input,
            input:active,
            input:focus,
            input:hover {
                display: flex;
                flex: 0 1 100%;
                border: 0;
                outline: 0;
                height: 100%;
                font-size: 20px;
                padding: 0;
                background-color:  transparent;
                color:  ${({theme}) => theme.textColor.strong};
            }

            .search-icon {
                font-size: 20px;
                margin: 0 20px;
            }
        }

        .result-area {
            display: flex;
            flex-wrap: wrap;
            flex: 0 1 100%;
            height: fit-content;
            max-height: 600px;
            margin-top: 10px;
            padding-bottom: 15px;

            h1 {
                display: flex;
                flex: 0 1 100%;
                height: 300px;
                font-size: 30px;
                align-items: center;
                justify-content: center;
                color: ${({theme}) => theme.textColor.disabled}
                
            }

            .no-result {
                display: flex;
                flex: 0 1 100%;
                flex-wrap: wrap;
                height: 300px;
                align-items: center;
                align-content: center;
                justify-content: center;

                h1, .icon {
                    display: flex;
                    flex: 0 1 100%;
                    height: fit-content;
                    align-items: center;
                    justify-content: center;
                }

                .icon {
                    font-size: 50px;
                    margin-bottom: 10px;
                    color: ${({theme}) => theme.textColor.disabled}; 
                }
            }

            .result-item {
                display: flex;
                height: fit-content;
                flex: 0 1 100%;
                padding: 5px;
                align-items: center;
                margin: 1px 15px;
                background-color: ${({theme}) => theme.background.light};

                ${Avatar} {
                    margin-right: 8px;
                }

                .name {
                    flex: 1;
                    font-size: 12px;
                }
            }
        }
    }

`;

export default SearchStyled;