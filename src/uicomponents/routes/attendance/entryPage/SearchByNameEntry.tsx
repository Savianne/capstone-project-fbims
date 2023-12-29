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
import doRequest from "../../../../API/doRequest";
import getCurrentTime from "../../../../utils/helpers/getCurrentTime";
import useAddSnackBar from "../../../reusables/SnackBar/useSnackBar";
import useConfirmModal from "../../../reusables/ConfirmModal/useConfirmModal";
import ConfirmModal from "../../../reusables/ConfirmModal/ConfirmModal";
import { string } from "yup";
import DataDisplayChip from "../../../reusables/DataDisplayChip";
import TimePicker from "../../../reusables/DateRangePicker/TimePicker";

interface ISearchResult {
    name: string,
    avatar: string,
    memberUID: string,
}

interface ISearchAttenders extends IStyledFC {
    presents: string[];
    entryUID: string;
    attendanceType: "basic" | "detailed";
    attender: "all" | "select";
    entryType?: 'time-in' | "time-out";
    categoryUID: string;
    session: number;
    attenders?: ({ name: string, picture: string | null, memberUID: string})[],
}


const Backdrop = styled.div<{inputWidth: string}>`
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
        width: ${(props) => props.inputWidth};
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
    }
`

const SearchAttenderByNameFC: React.FC<ISearchAttenders> = ({className, presents, entryUID, attendanceType, attender, attenders, session, entryType, categoryUID}) => {
    const addSnackBar = useAddSnackBar();
    const {modal: warningModal, confirm: confirmWarningModal} = useConfirmModal();
    const [searchTerm, setSearchTerm] = React.useState('');
    const [searchActive, setSearchActive] = React.useState(false);
    const [isLoadingSearch, setIsLoadingSearch] = React.useState(false);
    const [result, setResults] = React.useState<null | ISearchResult[]>(null);
    const [warning, setWarning] = React.useState<null | string>(null);
    const [referenceElement, setReferenceElement] = React.useState<null | HTMLDivElement>(null);
    const [popperElement, setPopperElement] = React.useState<null | HTMLDivElement>(null);
    const elementRef = React.useRef<HTMLDivElement | null>(null);
    const [inputWidth, setInputWidth] = React.useState(300);
    const [selectedAttender, setSelectedAttender] = React.useState<null | ISearchResult>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [time, setTime] = React.useState('');

    const { styles, attributes } = usePopper(referenceElement, popperElement, {
        // placement: "left-end",
        modifiers: [
            {
                name: 'preventOverflow',
                options: {
                  tether: false, // true by default
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

    const performLocalSearch = async (searchQuery: string) => {
        if(attenders && searchQuery) {
            const result = attenders.filter(attender => attender.name.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1);
            setResults(result.map(attender => ({...attender, avatar: attender.picture})) as ISearchResult[]);
        } else if(attenders && searchQuery == "") {
            setResults(attenders.map(attender => ({...attender, avatar: attender.picture})) as ISearchResult[]);
        }
    };

    const debouncedSearch = debounce(performSearch, 300);
    const debouncedLocalSearch = debounce(performLocalSearch, 300);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setSearchTerm(value);

        attender == "all"? debouncedSearch(value) : debouncedLocalSearch(value);
    };

    React.useEffect(() => {
        // Create a new ResizeObserver
        const observer = new ResizeObserver(entries => {
          // Loop through the ResizeObserverEntry objects
          for (let entry of entries) {
            // Log the new dimensions of the observed element
            setInputWidth(entry.contentRect.width);
          }
        });
    
        // Start observing the element
        if (elementRef.current) {
          observer.observe(elementRef.current);
        }
    
        // Clean up function to stop observing the element
        return () => {
          observer.disconnect();
        };

    }, []);

    React.useEffect(() => {
        if(attender == "select" && attenders) setResults(attenders.map(attender => ({...attender, avatar: attender.picture})) as ISearchResult[]);
    }, [attenders, attender]);

    React.useEffect(() => {
        if(warning) {
            switch(warning.toUpperCase()) {
                case "HAS PENDING TIME-OUT":
                    confirmWarningModal("Pending Time-Out", "The attendee has a pending time-out. Please wait for the previous action to complete before attempting to time in again.", () => {setWarning(null)}, () => {setWarning(null)});
                    break;
                case "EXIST IN OTHER SESSION":
                    confirmWarningModal("Exist in other session", "The attendee already exists in another session. Each attendee can only be associated with one session every entry.", () => {setWarning(null)}, () => {setWarning(null)});
                    break;
            }
        }
    }, [warning])
    return(
    <div className={className}>
        <ConfirmModal context={warningModal} variant={"warning"} />
        {
            attendanceType == "detailed" && selectedAttender?
            <div className="selected-attendee">
                <Avatar size="120px" src={selectedAttender.avatar} alt={selectedAttender.name} />
                <h5>{selectedAttender.name}</h5>
                <TimePicker value={time} onChange={(time) => setTime(time)}/><br />
                <div className="btn-container">
                    {
                        entryType == "time-in"?
                        <Button isLoading={isLoading} disabled={presents.includes(selectedAttender.memberUID)} label="Time-in" color="primary" 
                        onClick={() => {
                            setIsLoading(true);
                            doRequest({
                                method: "POST",
                                url: "/attendance/add-time-in",
                                data: {
                                    attender,
                                    entryUID,
                                    memberUID: selectedAttender.memberUID,
                                    session,
                                    categoryUID,
                                    timeIn: time
                                }
                            })
                            .then(result => {
                                setSelectedAttender(null);
                                setSearchActive(false);
                                setSearchTerm("");
                            })
                            .catch(err => {
                                if(typeof err == "string") {
                                    switch(err.toUpperCase()) {
                                        case "HAS PENDING TIME-OUT":
                                            confirmWarningModal("Pending Time-Out", "The attendee has a pending time-out. Please wait for the previous action to complete before attempting to time in again.", () => {setWarning(null)}, () => {setWarning(null)});
                                            break;
                                        case "EXIST IN OTHER SESSION":
                                            confirmWarningModal("Exist in other session", "The attendee already exists in another session. Each attendee can only be associated with one session every entry.", () => {setWarning(null)}, () => {setWarning(null)});
                                            break;
                                    }
                                } else addSnackBar('Error occured, please try again!', "error", 5);
                            })
                            .finally(() => setIsLoading(false))    
                        }}/> :
                        <Button isLoading={isLoading} disabled={!(presents.includes(selectedAttender.memberUID))} label="Time-out" color="primary" 
                        onClick={() => {
                            setIsLoading(true);
                            doRequest({
                                method: "POST",
                                url: "/attendance/add-time-out",
                                data: {
                                    attender,
                                    entryUID,
                                    memberUID: selectedAttender.memberUID,
                                    session,
                                    categoryUID,
                                    timeOut: time
                                }
                            })
                            .then(result => {
                                setSelectedAttender(null);
                                setSearchActive(false);
                                setSearchTerm("");
                            })
                            .catch(err => {
                                alert(err.error)
                            })
                            .finally(() => setIsLoading(false))    
                        }}/>
                    }
                </div>
            </div> : 
            <div className="search-input" ref={elementRef}>
                <span className="search-icon">
                    <FontAwesomeIcon icon={["fas", "search"]} />
                </span>
                <input value={searchTerm} placeholder="Search Attenders by name" onChange={handleInputChange} onFocus={() => setSearchActive(true)} />
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
                    attender == "select"? setResults(attenders?.map(attender => ({...attender, avatar: attender.picture})) as ISearchResult[]) : setResults(null);
                }} label="" variant="hidden-bg-btn" iconButton icon={<FontAwesomeIcon icon={["fas", "times"]} />} />
                {
                    searchActive? <div className="search-result-base" ref={setReferenceElement}></div> : ""
                }
                {
                    searchActive? 
                    <Backdrop onClick={() => setSearchActive(false)} inputWidth={`${inputWidth + 10}px`}>
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
                                <SearchResultItem 
                                dispatchwarning={(code) => setWarning(code)} 
                                categoryUID={categoryUID} 
                                key={item.memberUID} 
                                session={session} 
                                attender={attender} 
                                result={item} 
                                entryUID={entryUID} 
                                attendanceType={attendanceType} 
                                isPresent={entryType == "time-in"? presents.includes(item.memberUID) : !(presents.includes(item.memberUID))} 
                                selectResult={(res) => {
                                    setSelectedAttender(res);
                                    setTime(getCurrentTime());
                                }}/>
                            ))
                        }
                        </div> 
                    </Backdrop> : ""
                }
            </div>
        }
    </div>
    )
}

interface ISearResultItem extends IStyledFC {
    result: ISearchResult;
    entryUID: string;
    categoryUID: string;
    attender: "all" | "select",
    attendanceType: "basic" | "detailed",
    isPresent?: boolean;
    session: number,
    dispatchwarning: (code: string) => void;
    selectResult: (result: ISearchResult) => void
}

const SearchResultItemFC: React.FC<ISearResultItem> = ({className, result, entryUID, attendanceType, attender, isPresent, session, selectResult, categoryUID, dispatchwarning}) => {
    const addSnackBar = useAddSnackBar();
    const [isLoading, setIsLoading] = React.useState(false);
    const [isSelected, setIsSelected] = React.useState(false);
    
    return(
        <div className={isPresent? `${className} selected` : className}>
            <Avatar src={result.avatar} alt={result.name} size="30px" />
            <p className="name">{ result.name }</p>
            {
                attendanceType == "basic"?  
                <Button isLoading={isLoading} disabled={isPresent || isSelected} label="Present" variant="hidden-bg-btn" color="primary" 
                onClick={() => {
                    setIsLoading(true);
                    doRequest({
                        method: "POST",
                        url: "/attendance/add-present",
                        data: {
                            attender,
                            entryUID,
                            memberUID: result.memberUID,
                            session,
                            categoryUID
                        }
                    })
                    .then(result => {
                        setIsSelected(true);
                    })
                    .catch(err => {
                        addSnackBar('Error occured, please try again!', "error", 5);
                    })
                    .finally(() => setIsLoading(false))
                }}/> : <>
                    <Button 
                    isLoading={isLoading} 
                    disabled={isPresent || isSelected} 
                    label="Select" 
                    variant="hidden-bg-btn" 
                    color="primary"
                    onClick={() => {
                        selectResult(result);
                    }} />
                    {
                        // entryType == "time-in"? 
                        // <Button isLoading={isLoading} disabled={isPresent || isSelected} label="Time-in" variant="hidden-bg-btn" color="primary" 
                        // onClick={() => {
                        //     setIsLoading(true);
                        //     doRequest({
                        //         method: "POST",
                        //         url: "/attendance/add-time-in",
                        //         data: {
                        //             attender,
                        //             entryUID,
                        //             memberUID: result.memberUID,
                        //             session,
                        //             categoryUID,
                        //             timeIn: getCurrentTime()
                        //         }
                        //     })
                        //     .then(result => {
                        //         setIsSelected(true);
                        //     })
                        //     .catch(err => {
                        //         if(typeof err == "string") {
                        //             dispatchwarning(err)
                        //         } else addSnackBar('Error occured, please try again!', "error", 5);
                        //     })
                        //     .finally(() => setIsLoading(false))    
                        // }}/> :
                        // <Button isLoading={isLoading} disabled={isPresent || isSelected} label="Time-out" variant="hidden-bg-btn" color="primary" 
                        // onClick={() => {
                        //     setIsLoading(true);
                        //     doRequest({
                        //         method: "POST",
                        //         url: "/attendance/add-time-out",
                        //         data: {
                        //             attender,
                        //             entryUID,
                        //             memberUID: result.memberUID,
                        //             session,
                        //             categoryUID,
                        //             timeOut: getCurrentTime()
                        //         }
                        //     })
                        //     .then(result => {
                        //         setIsSelected(true);
                        //     })
                        //     .catch(err => {
                        //         alert(err.error)
                        //     })
                        //     .finally(() => setIsLoading(false))    
                        // }}/>
                    }
                </>
            }
        </div>
    )
}

const SearchResultItem = styled(SearchResultItemFC)`
    && {
        display: flex;
        height: fit-content;
        flex: 0 1 100%;
        padding: 5px;
        align-items: center;
        margin: 1px 5px;
        transition: background-color 400ms linear;

        ${Avatar} {
            margin-right: 8px;
        }

        .name {
            flex: 1;
            font-size: 12px;
            color: ${({theme}) => theme.textColor.strong};
        }
    }

    .selected {
        opacity: 0.6;
        
        :hover {
            background-color: transparent;
            cursor: default;
        }
    }
`;

const SearchAttenderByName = styled(SearchAttenderByNameFC)`
    display: flex;
    flex: 0 1 100%;
    height: fit-content;

    && > .selected-attendee {
        display: flex;
        flex: 0 1 100%;
        height: fit-content;
        justify-content: center;
        flex-wrap: wrap;
        border-radius: 5px;
        background-color: ${({theme}) => theme.background.lighter};
        padding: 20px 10px;

        h5 {
            flex: 0 1 100%;
            margin: 5px 5px 10px 5px;
            font-weight: 600;
            color: ${({theme}) => theme.textColor.strong};
            text-align: center;
        }

        ${TimePicker} {
            flex: 0 1 300px;
        }

        .btn-container {
            display: flex;
            flex: 0 1 100%;
            margin-top: 10px;
            justify-content: center;
        }
    }

    && > .search-input {
        position: relative;
        display: flex;
        align-items: center;
        flex: 0 1 100%;
        padding-right: 10px;
        height: 50px;
        background-color: ${({theme}) => theme.background.primary};
        border-radius: 5px;
        border: 1px solid ${({theme}) => theme.borderColor};
        margin-bottom: 5px;
        z-index: 1001;
    
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
        
        .search-result-base {
            position: absolute;
            top: calc(100% + 5px);
            left: 0;
            display: flex;
            width: 100%;
            height: 0;
        }
    }
    
`;

export default SearchAttenderByName;