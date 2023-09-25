import React from "react";
import styled, { css } from "styled-components";
import { IStyledFC } from "../../IStyledFC";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UseRipple from '../Ripple/UseRipple';
import usePagination from "./usePagination";

interface IUsePagenation extends IStyledFC {
    totalPage: number,
    onChange: (value: number) => void,
    disabled?: boolean
}

const PaginationFC: React.FC<IUsePagenation> = ({className, totalPage, onChange}) => {
    const {
        isPageEnd,
        isPageStart,
        pageNumbers,
        setPage,
        prevPage,
        nextPage
    } = usePagination(totalPage, (page) => onChange(page));
    
    return ( <div className={className}>
            <UseRipple>
                <span className={isPageStart? "btn btn-prev disabled" : "btn btn-prev"} onClick={prevPage}>
                    <FontAwesomeIcon icon={["fas", "angle-left"]} />
                </span>
            </UseRipple>
            {
                pageNumbers.map((page, index) => {
                    return <>
                        {
                            page? 
                            <UseRipple key={index}>
                                <span className={page.isCurrentPage? 'btn page-number current-page' : 'btn page-number'} onClick={(e) => setPage(page.number)}>
                                    <strong>{page.number}</strong>
                                </span>
                            </UseRipple> : 
                            <span className="btn hidden-pages">
                                <strong>...</strong>
                            </span>
                        }
                    </>
                })
            }
            <UseRipple>
                <span className={isPageEnd? "btn btn-next disabled" : "btn btn-next"} onClick={nextPage}>
                    <FontAwesomeIcon icon={["fas", "angle-right"]} />
                </span>
            </UseRipple>
        </div>
    )
}

const Pagination = styled(PaginationFC)`
    display: flex;
    align-items: center;
    justify-content: center;
    column-gap: 5px;
    height: 30px;
    padding: 5px;
    width: fit-content;
    border: 1px solid ${({theme}) => theme.borderColor};
    border-radius: 3px;

    opacity: ${(props) => props.disabled? 0.5 : 1};
    ${(props) => props.disabled && css`cursor: wait;`}

    & .btn {
        display: flex;
        width: 25px;
        height: 25px;
        align-items: center;
        justify-content: center;
        /* border: 1px solid ${({theme}) => theme.borderColor}; */
        color: ${({theme}) => theme.textColor.strong};
        font-size: 13px;
        cursor: pointer;
        transition: background-color 300ms;
    }

    & .btn-prev, & .btn-next {
        background-color: ${({theme}) => theme.background.light};
        border-radius: 2px;
    } 

    & .disabled {
        /* background-color: ${({theme}) => theme.staticColor.disabled}; */
        opacity: 0.40;
        cursor: not-allowed;
    }

    & .current-page {
        border-radius: 2px;
        background-color: ${({theme}) => theme.staticColor.primary};
        color: white;
    }    

    ${(props) => props.disabled && css`pointer-events: none;`}
`;

export default Pagination;