import React from "react";
import styled from "styled-components";
import axios from "axios";
import { debounce } from "lodash";
import doRequest from "../../../API/doRequest";
import useFormControl from "../../../utils/hooks/useFormControl";
import useAddSnackBar from "../../reusables/SnackBar/useSnackBar";
import { API_BASE_URL } from "../../../API/BASE_URL";
import { TResponseFlag } from "../../../API/TResponseFlag";
import { IStyledFC } from "../../IStyledFC";
import { CancelTokenSource } from "axios";
import Input from "../../reusables/Inputs/Input";
import Select, {Option} from "../../reusables/Inputs/Select";
import Avatar from "../../reusables/Avatar";
import Button from "../../reusables/Buttons/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Scrollbar from "../../reusables/ScrollBar";
import ResizableContainer from "../../reusables/ResizableContainer";
import { ScaleLoader } from "react-spinners";
import { ICategory } from "./Categories";

interface ISearchResult {
    name: string,
    avatar: string,
    memberUID: string,
}

interface IAddCategoryForm extends IStyledFC {
    dispatch: (category: ICategory) => void
}

const FCAddCategoryForm: React.FC<IAddCategoryForm> = ({className, dispatch}) => {
    const addSnackbar = useAddSnackBar();
    const [attendanceType, setAttendanceType] = React.useState<"basic" | "detailed">("basic");
    const [attenders, setAttenders] = React.useState<'all' | 'select'>('all');
    const [submitReady, setSubmitReady] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [searchActive, setSearchActive] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [onSubmit, setOnSubmit] = React.useState(false);
    const [result, setResults] = React.useState<null | ISearchResult[]>(null)
    const [attendersList, setAttendersList] = React.useState<({ name: string, picture: string | null, uid: string})[]>([]);

    let cancelTokenSource: CancelTokenSource | null = null;

    const [form, formDispatcher] = useFormControl({
        title: {
            required: true,
            minValLen: 3,
            maxValLen: 25,
            errorText: 'Invalid Entry',
            validateAs: 'text',
        }
    });

    const performSearch = async (searchQuery: string) => {
        if(searchQuery) {
            setIsLoading(true);
    
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
    
            setIsLoading(false);
        } else {
            isLoading && setIsLoading(false);
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

    React.useEffect(() => {
        attenders == "all"? setSubmitReady(form.isReady) : setSubmitReady(form.isReady == true && attendersList.length > 0? true : false);
    }, [attenders, attendersList, form.isReady])
    return (
        <div className={className}>
            <div className="attendance-type-input-group">
                <div className="basic">
                    <Input type="checkbox" checked={attendanceType == "basic"} name="basic-attendance" placeholder="Basic Attendance (Present/Absent)" label="Basic Attendance (Present/Absent)" onValChange={(val) => {
                        const v = val as boolean;
                        if(v) setAttendanceType('basic');
                    }}/>
                </div>
                <div className="detailed">
                    <Input type="checkbox" checked={attendanceType == "detailed"} name="detailed-attendance" placeholder="Detailed Attendance (Time-in/Time-out)" label="Detailed Attendance (Time-in/Time-out)" onValChange={(val) => {
                        const v = val as boolean;
                        if(v) setAttendanceType('detailed')
                    }}/>
                </div>
            </div>
            <Input type="text" placeholder="Title" value={form.values.title as string} error={form.errors.title} onValChange={(e) => formDispatcher?.title(e)}/>
            <Select placeholder="Attenders" value={attenders} onValChange={(e) => setAttenders(e as typeof attenders)}>
                <Option value="all">All Members</Option>
                <Option value="select">Select Member</Option>
            </Select>
            {
                attenders == "select" && attendersList && <>
                <div className="input-area">
                    <span className="search-icon">
                        <FontAwesomeIcon icon={["fas", "search"]} />
                    </span>
                    <input autoFocus value={searchTerm} placeholder="Search for members" onChange={handleInputChange} onFocus={() => setSearchActive(true)} />
                        {
                            isLoading && <ScaleLoader color="#36d7b7" height={"10px"} style={{marginRight: "5px", width: '60px'}}/>
                        }
                    <Button 
                    onClick={() => {
                        setSearchTerm("");
                        isLoading && setIsLoading(false);
                        if (cancelTokenSource) {
                            cancelTokenSource.cancel('Operation canceled by the user.');
                        }
                        setResults(null);
                        setSearchActive(false)
                    }} label="" variant="hidden-bg-btn" iconButton icon={<FontAwesomeIcon icon={["fas", "times"]} />} />
                </div>
                {
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
                                            return attendersList.filter(innerItem => innerItem.uid == item.memberUID).length? true : false
                                        })()} label={attendersList.filter(innerItem => innerItem.uid == item.memberUID).length? "Selected" : "Select"} variant="hidden-bg-btn" color="theme" 
                                        onClick={() => {
                                            setAttendersList([...attendersList.filter(innerItem => innerItem.uid !== item.memberUID), {name: item.name, picture: item.avatar, uid: item.memberUID}])
                                        }} />
                                    </div>
                                </div>
                            ))
                        }
                    </div> : ""
                }
                <ResizableContainer minHeight={150}>
                    <Scrollbar scrollBarProps={{autoHide: true}}>
                    {
                        attendersList.length? <>
                        {
                            attendersList.map(attender => (
                                <Attender>
                                    <Avatar src={attender.picture} alt={attender.name} size="30px" />
                                    <p className="name">{ attender.name }</p>
                                    <div className="btn-area">
                                        <span className="btn-remove"
                                        onClick={() => {
                                            setAttendersList([...attendersList.filter(item => item.uid !== attender.uid)]);
                                        }}>
                                            <FontAwesomeIcon icon={["fas", "times"]} />
                                        </span>
                                    </div>
                                </Attender>
                            ))
                        }
                        </> : <p className="no-selected">0 selected</p>
                    }
                    </Scrollbar>
                </ResizableContainer>
                </>
            }
            <Button disabled={!submitReady} isLoading={onSubmit} label="Add Category" fullWidth color="primary" 
            onClick={() => {
                setOnSubmit(true)
                doRequest({
                    url: "/attendance/add-attendance-category",
                    method: "POST",
                    data: {
                        title: form.values.title,
                        type: attendanceType,
                        attender: attenders,
                        attenders: attendersList.map(item => item.uid)
                    }
                })
                .then(result => {
                    if(result.success) {
                        setOnSubmit(false);
                        dispatch({
                            title: form.values.title as string,
                            type: attendanceType,
                            attender: attenders,
                            uid: result.data as string
                        });
                        form.clear();
                        setAttendersList([]);
                        addSnackbar("Added new Category", "default", 5);
                    } else throw result.error
                })
                .catch(err => {
                    setOnSubmit(false);
                    addSnackbar("Failed to add new Category", "error", 5);
                })
            }}/>
        </div>
    )
}

const Attender = styled.div`
    display: flex;
    height: fit-content;
    flex: 0 1 100%;
    padding: 5px;
    align-items: center;
    margin: 1px 5px;
    background-color: ${({theme}) => theme.background.light};

    ${Avatar} {
        margin-right: 8px;
    }

    .name {
        flex: 1;
        font-size: 12px;
        color: ${({theme}) => theme.textColor.strong};
    }

    .btn-area {
        display: flex;
        width: fit-content;
        margin-left: auto;
        border-radius: 50%;
        cursor: pointer;
        
        :hover {
            transition: background-color 300ms linear;
            background-color: ${({theme}) => theme.background.light};
        }

        .btn-remove {
            display: flex;
            width: 25px;
            height: 25px;
            align-items: center;
            justify-content: center;
            color: ${({theme}) => theme.textColor.light};
            font-size: 12px;
        }
    }
`;

const AddCategoryForm = styled(FCAddCategoryForm)`
    display: flex;
    flex-wrap: wrap;
    flex: 1;
    padding: 15px;
    border-radius: 5px;
    /* border: 1px solid ${({theme}) => theme.borderColor}; */
    height: fit-content;
    background-color: ${({theme}) => theme.background.lighter};

    && .input-area {
        display: flex;
        align-items: center;
        flex: 0 1 100%;
        padding-right: 10px;
        height: 50px;
        /* background-color: ${({theme}) => theme.background.light}; */
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

    && .result-area {
        display: flex;
        flex-wrap: wrap;
        flex: 0 1 100%;
        height: fit-content;
        max-height: CALC(100vh - 35vh);
        margin-top: 10px;
        /* padding-bottom: 15px; */
        overflow-x: auto;
        border-left: 5px solid #cecfcfa1;
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
            }
        }
    }

    && ${ResizableContainer} {
        display: flex;
        flex: 0 1 100%;

        .no-selected {
            color: ${({theme}) => theme.textColor.light}
        }
    }

    strong {
        flex: 0 1 100%;
        font-size: 13px;
        font-weight: bold;
    }

    .attendance-type-input-group {
        display: flex;
        flex: 0 1 100%;
        flex-wrap: wrap;
        gap: 5px;

        .basic, .detailed {
            display: flex;
            flex: 1;
            min-width: 200px;
            border-radius: 5px;
            /* justify-content: center; */
            align-items: center;
            background-color: #3f51b559;
            color: white;
        }

        .detailed {
            background-color: #00968869;
        }

        ~${Input}, ~${Select} {
            margin: 25px 0;
            flex: 0 1 100%;
        }
    }

    ${Button} {
        margin-top: 10px;
    }
`

export default AddCategoryForm;