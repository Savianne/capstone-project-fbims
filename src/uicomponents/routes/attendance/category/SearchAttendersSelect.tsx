import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ScaleLoader } from "react-spinners";
import { debounce } from "lodash";
import { usePopper } from "react-popper";
import axios, {CancelTokenSource } from "axios";
import { API_BASE_URL } from "../../../../API/BASE_URL";
import { TResponseFlag } from "../../../../API/TResponseFlag";
import Button from "../../../reusables/Buttons/Button";
import Avatar from "../../../reusables/Avatar";
import { IStyledFC } from "../../../IStyledFC";

interface ISearchResult {
    name: string,
    avatar: string,
    memberUID: string,
}

interface ISearchAttenders extends IStyledFC {
    onSelected?: (result: ISearchResult) => void;
    attenders: ({ name: string, picture: string | null, memberUID: string})[],
}


const Backdrop = styled.div`
    && {
        display: flex;
        width: 100%;
        height: 100vh;
        position: fixed;
        top: 0;
        left: 0;
        background: ${({theme}) => theme.mode == "dark"? "rgb(0 0 0 / 19%)" : "rgb(74 74 74 / 4%)"};
        z-index: 1000;
    }

    && > .search-result-area {
        display: flex;
        flex-wrap: wrap;
        width: 410px;
        height: fit-content;
        /* max-height: calc(100vh - 35vh); */
        /* padding-bottom: 15px; */
        /* border-left: 5px solid #cecfcfa1; */
        margin-bottom: 15px;
        border-radius: 5px;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.25);
        background-color: ${({theme}) => theme.background.primary};

        h1 {
            display: flex;
            flex: 0 1 100%;
            height: 100px;
            font-size: 20px;
            align-items: center;
            justify-content: center;
            color: ${({theme}) => theme.textColor.disabled}
            
        }

        .no-result {
            display: flex;
            flex: 0 1 100%;
            flex-wrap: wrap;
            height: 150px;
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
            margin: 1px 5px;

            ${Avatar} {
                margin-right: 8px;
            }

            .name {
                flex: 1;
                font-size: 12px;
                color: ${({theme}) => theme.textColor.strong};
            }

            .btn-area {
                display: inline-flex;
                align-items: center;
            }
        }
    }
`

const SearchAttendersFC: React.FC<ISearchAttenders> = ({className, attenders, onSelected}) => {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [searchActive, setSearchActive] = React.useState(false);
    const [isLoadingSearch, setIsLoadingSearch] = React.useState(false);
    const [result, setResults] = React.useState<null | ISearchResult[]>(null);
    const [referenceElement, setReferenceElement] = React.useState<null | HTMLDivElement>(null);
    const [popperElement, setPopperElement] = React.useState<null | HTMLDivElement>(null);

    const { styles, attributes } = usePopper(referenceElement, popperElement, {
        // placement: "left-end",
        modifiers: [
        {
            name: "preventOverflow",
            options: {
            altBoundary: true,
            },
        },
        ],
    });
    let cancelTokenSource: CancelTokenSource | null = null;

    const performSearch = async (searchQuery: string) => {
        if(searchQuery) {
            setIsLoadingSearch(true);
    
            if (cancelTokenSource) {
                cancelTokenSource.cancel('Operation canceled by the user.');
            }
    
            cancelTokenSource = axios.CancelToken.source();
    
            try {
                const response = await axios({
                    url: "/search-member",
                    baseURL: API_BASE_URL,
                    method: "POST",
                    data: {
                        searchTerm: searchQuery
                    },
                    cancelToken: cancelTokenSource.token,
                });
    
                const responseFlag = response.data as TResponseFlag<ISearchResult[]>
                if(responseFlag.success) {
                    setResults(responseFlag.data as ISearchResult[] | null);
                } else throw responseFlag
            } catch (error: any) {
                if (axios.isCancel(error)) {
                    console.log('Request canceled:', error);
                } else {
                    console.log('Error:', error);
                }
            }
    
            setIsLoadingSearch(false);
        } else {
            isLoadingSearch && setIsLoadingSearch(false);
            if (cancelTokenSource) {
                cancelTokenSource.cancel('Operation canceled by the user.');
            }
            setResults(null)
        }
    };

    const debouncedSearch = debounce(performSearch, 300);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setSearchTerm(value);

        debouncedSearch(value);
    };

    return(
    <>
        <div className={className}>
            <span className="search-icon">
                <FontAwesomeIcon icon={["fas", "search"]} />
            </span>
            <input value={searchTerm} placeholder="Search for members" onChange={handleInputChange} onFocus={() => setSearchActive(true)} />
                {
                    isLoadingSearch && <ScaleLoader color="#36d7b7" height={"10px"} style={{marginRight: "5px", width: '60px'}}/>
                }
            <Button 
            onClick={() => {
                setSearchTerm("");
                isLoadingSearch && setIsLoadingSearch(false);
                if (cancelTokenSource) {
                    cancelTokenSource.cancel('Operation canceled by the user.');
                }
                setResults(null);
            }} label="" variant="hidden-bg-btn" iconButton icon={<FontAwesomeIcon icon={["fas", "times"]} />} />
            {
                searchActive? <div className="search-result-base" ref={setReferenceElement}></div> : ""
            }
        </div>
        {
            searchActive? 
            <Backdrop onClick={() => setSearchActive(false)}>
                <div 
                onClick={(e) => e.stopPropagation()}
                className="search-result-area"
                ref={setPopperElement}
                style={styles.popper}
                {...attributes.popper}>
                {
                    result == null && <h1>Type the name of the member to search...</h1>
                }
                {
                    result != null && result.length == 0 && <span className="no-result">
                        <span className="icon"><FontAwesomeIcon icon={["fas", "tired"]} /></span>
                        <h1>No result found!</h1>
                    </span>
                }
                {
                    result != null && result.length != 0 && result.map(item => (
                        <div className="result-item" key={item.memberUID}>
                            <Avatar src={item.avatar} alt={item.name} size="30px" />
                            <p className="name">{ item.name }</p>
                            <div className="btn-area">
                                <Button disabled={(() => {
                                    return attenders.filter(innerItem => innerItem.memberUID == item.memberUID).length? true : false
                                })()} label={attenders.filter(innerItem => innerItem.memberUID == item.memberUID).length? "Selected" : "Select"} variant="hidden-bg-btn" color="theme" 
                                onClick={() => {
                                    setSearchActive(false);
                                    onSelected && onSelected(item);
                                }} />
                            </div>
                        </div>
                    ))
                }
                </div> 
            </Backdrop> : ""
        }
    </>
    )
}

const SearchAttenders = styled(SearchAttendersFC)`
    position: relative;
    display: flex;
    align-items: center;
    flex: 0 1 400px;
    padding-right: 10px;
    height: 50px;
    background-color: ${({theme}) => theme.background.primary};
    border-radius: 5px;
    border: 1px solid ${({theme}) => theme.borderColor};
    margin-bottom: 5px;
    z-index: 1001;

    && > input,
    && > input:active,
    && > input:focus,
    && > input:hover {
        display: flex;
        flex: 1;
        border: 0;
        outline: 0;
        height: 100%;
        /* font-size: 20px; */
        padding: 0;
        background-color:  transparent;
        color:  ${({theme}) => theme.textColor.strong};
    }

    && > .search-icon {
        /* font-size: 20px; */
        margin: 0 20px;
        color: ${({theme}) => theme.textColor.strong}
    }

    && > .search-result-base {
        position: absolute;
        top: calc(100% + 5px);
        left: 0;
        display: flex;
        width: 100%;
        height: 0;
    }

`;

export default SearchAttenders;