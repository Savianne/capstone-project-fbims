import React, { useState } from "react";
import axios, { CancelTokenSource } from "axios";
import styled from "styled-components";
import ScaleLoader from "react-spinners/ScaleLoader";
import { IStyledFC } from "../IStyledFC";
import SearchStyled from "./Search";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../reusables/Buttons/Button";
import Devider from "../reusables/devider";
import Avatar from "../reusables/Avatar";
import useAddSnackBar from "../reusables/SnackBar/useSnackBar";
import { AVATAR_BASE_URL, API_BASE_URL } from "../../API/BASE_URL";
import { TResponseFlag } from "../../API/TResponseFlag";
import { debounce } from 'lodash';

import doRequest from "../../API/doRequest";

interface ISearchResult {
    name: string,
    avatar: string,
    memberUID: string,
    isMember: null | string
}

interface IAddMinistryMemberSearchComp extends IStyledFC {
    close: () => void,
    ministryUID: string
} 

const AddMinistryMemberSearchComp: React.FC<IAddMinistryMemberSearchComp> = ({close, ministryUID}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResults] = React.useState<null | ISearchResult[]>(null)

    let cancelTokenSource: CancelTokenSource | null = null;

    const performSearch = async (searchQuery: string) => {
        if(searchQuery) {
            setIsLoading(true);
    
            if (cancelTokenSource) {
                cancelTokenSource.cancel('Operation canceled by the user.');
            }
    
            cancelTokenSource = axios.CancelToken.source();
    
            try {
                const response = await axios({
                    url: "/find-member",
                    baseURL: API_BASE_URL,
                    method: "POST",
                    data: {
                        ministryUID: ministryUID,
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

    return (
        <SearchStyled onClick={() => {
            close()
        }}>
            <div className="search-modal" onClick={(e) => e.stopPropagation()}>
                <div className="input-area">
                    <span className="search-icon">
                        <FontAwesomeIcon icon={["fas", "search"]} />
                    </span>
                    <input autoFocus value={searchTerm} placeholder="Search for members" onChange={handleInputChange} />
                    {
                        isLoading && <ScaleLoader color="#36d7b7" height={"10px"} style={{marginRight: "5px", width: '60px'}}/>
                    }
                    {
                        searchTerm !== ""? 
                        <Button 
                        onClick={() => {
                            setSearchTerm("");
                            isLoading && setIsLoading(false);
                            if (cancelTokenSource) {
                                cancelTokenSource.cancel('Operation canceled by the user.');
                            }
                            setResults(null);
                        }} label="" variant="hidden-bg-btn" iconButton icon={<FontAwesomeIcon icon={["fas", "times"]} />} /> : ""
                    }
                    
                    <Devider $variant="center" $orientation="vertical" $flexItem $css="margin-left: 10px;margin-right: 10px;height: 60%"/>
                    <Button onClick={() => close()} label="Cancel" variant="hidden-bg-btn" />
                </div>
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
                        result != null && result.length != 0 && result.map(item => <SearchResultItem key={item.memberUID} item={item} ministryUID={ministryUID} onAddSuccess={() => {
                            const newList = result.map(i => {
                                return i.memberUID == item.memberUID? {...i, isMember: ministryUID} as ISearchResult : i;
                            });

                            setResults(newList);
                        }} />)
                    }

                </div>
            </div>
        </SearchStyled>
    )
}


const SearchResultItem: React.FC<{item: ISearchResult, ministryUID: string, onAddSuccess: () => void}> = ({item, ministryUID, onAddSuccess}) => {
    const addSnackBar = useAddSnackBar();
    const [isLoading, setIsLoading] = React.useState(false);
    const [isError, setIsError] = React.useState(false);
    
    return (
        <div key={item.memberUID} className="result-item">
            <Avatar src={item.avatar} alt={item.name} size="30px" />
            <p className="name">{ item.name }</p>
            <div className="btn-area">
                <Button isLoading={isLoading} label="Add to Ministry" disabled={!!item.isMember} iconButton icon={<FontAwesomeIcon icon={["fas", item.isMember? "check" : "plus"]} />} 
                onClick={() => {
                    setIsLoading(true);
                    doRequest<null>({
                        url: "/add-member-to-ministry",
                        method: "POST",
                        data: {
                            ministryUID: ministryUID,
                            memberUID: item.memberUID
                        }
                    })
                    .then(response => {
                        if(response.success) {
                            setIsLoading(false);
                            onAddSuccess();
                            isError && setIsError(false);
                            addSnackBar("Successfully added new member to ministry", "success", 5);
                        } else throw response
                    })
                    .catch(err => {
                        setIsLoading(false);
                        setIsError(false);
                        addSnackBar("Failed to add new member to ministry", "error", 5);
                        console.log(err)
                    })
                }}/>
            </div>
        </div>
    )
}

export default AddMinistryMemberSearchComp; 