import React from "react";
import styled from "styled-components";
import axios, {CancelTokenSource} from "axios";
import { debounce } from "lodash";
import { ScaleLoader } from "react-spinners";
import { API_BASE_URL } from "../../../../API/BASE_URL";
import { TResponseFlag } from "../../../../API/TResponseFlag";
import { IStyledFC } from "../../../IStyledFC";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../../../reusables/Buttons/Button";
import Avatar from "../../../reusables/Avatar";

interface IAttendersTabContent extends IStyledFC {
    attender: "all" | "select",
    attenders: ({ name: string, picture: string | null, memberUID: string})[],
    onRemoved: (uid:string) => void,
    onAdded: (attender: { name: string, picture: string | null, uid: string}) => void
}

interface ISearchResult {
    name: string,
    avatar: string,
    memberUID: string,
}

const AttendersTabContentFC: React.FC<IAttendersTabContent> = ({className, attender, attenders, onRemoved, onAdded}) => {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [searchActive, setSearchActive] = React.useState(false);
    const [isLoadingSearch, setIsLoadingSearch] = React.useState(false);
    const [result, setResults] = React.useState<null | ISearchResult[]>(null);

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
        <div className={className}>
            {
                attender == "select"? <>
                    <div className="search-toolbar">
                        <div className="input-area">
                            <span className="search-icon">
                                <FontAwesomeIcon icon={["fas", "search"]} />
                            </span>
                            <input autoFocus value={searchTerm} placeholder="Search for members" onChange={handleInputChange} onFocus={() => setSearchActive(true)} />
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
                                setSearchActive(false)
                            }} label="" variant="hidden-bg-btn" iconButton icon={<FontAwesomeIcon icon={["fas", "times"]} />} />
                        </div>
                    </div>
                    {/* {
                        searchActive? 
                        <div className="result-area">
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
                                    <div className="result-item">
                                        <Avatar src={item.avatar} alt={item.name} size="30px" />
                                        <p className="name">{ item.name }</p>
                                        <div className="btn-area">
                                            <Button disabled={(() => {
                                                return attenders.filter(innerItem => innerItem.memberUID == item.memberUID).length? true : false
                                            })()} label={attenders.filter(innerItem => innerItem.memberUID == item.memberUID).length? "Selected" : "Select"} variant="hidden-bg-btn" color="theme" 
                                            onClick={() => {
                                                // setAttenders([...attendersList.filter(innerItem => innerItem.uid !== item.memberUID), {name: item.name, picture: item.avatar, uid: item.memberUID}])
                                            }} />
                                        </div>
                                    </div>
                                ))
                            }
                        </div> : ""
                    } */}
                    <div className="attenders-grid">
                        {
                            attenders.map(attender => <AttenderCard key={attender.memberUID} {...attender} />)
                        }
                    </div>
                </> : <>
                
                </>
            }
        </div>
    )
};

interface IAttenderCard extends IStyledFC {
   name: string, 
   picture: string | null, 
   memberUID: string,
}

const AttenderCardFC: React.FC<IAttenderCard> = ({className, name, picture, memberUID}) => {

    return(
        <div className={className}>
            <Avatar src={picture} alt={name} size="60px"/>
            <strong className="attender-name">{name}</strong>
            <Button label="Remove" icon={<FontAwesomeIcon icon={['fas', 'times']}/>} color="theme" variant="hidden-bg-btn"/>
        </div>
    )
}

const AttenderCard = styled(AttenderCardFC)`
    display: flex;
    flex-wrap: wrap;
    flex: 0 0 140px;
    padding: 20px 5px;
    height: 160px;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    background-color: ${({theme}) => theme.background.primary};

    && > .attender-name {
        display: flex;
        flex: 0 1 100%;
        justify-content: center;
        text-align: center;
        font-size: 13px;
        font-weight: 600;
        margin: 5px 0;
        color: ${({theme}) => theme.textColor.strong};
    }
`

const AttendersTabContent = styled(AttendersTabContentFC)`
    display: flex;
    flex-wrap: wrap;
    flex: 0 1 100%;

    && > .search-toolbar {
        display: flex;
        flex: 0 1 100%;

        .input-area {
            display: flex;
            align-items: center;
            flex: 0 1 400px;
            padding-right: 10px;
            height: 50px;
            background-color: ${({theme}) => theme.background.primary};
            border-radius: 5px;
            border: 1px solid ${({theme}) => theme.borderColor};
            margin-bottom: 5px;

            input,
            input:active,
            input:focus,
            input:hover {
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

            .search-icon {
                /* font-size: 20px; */
                margin: 0 20px;
                color: ${({theme}) => theme.textColor.strong}
            }
        }
    }

    && > .result-area {
        display: flex;
        flex-wrap: wrap;
        flex: 0 1 100%;
        height: fit-content;
        /* max-height: calc(100vh - 35vh); */
        margin-top: 10px;
        /* padding-bottom: 15px; */
        /* border-left: 5px solid #cecfcfa1; */
        margin-bottom: 15px;

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
            /* background-color: ${({theme}) => theme.background.light}; */

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

    && .attenders-grid {
        flex: 1.5;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        grid-gap: 10px;
        padding: 20px 0;
    }

`

export default AttendersTabContent;