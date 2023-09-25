import React from "react";
import { IStyledFC } from "../../IStyledFC";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UseRipple from '../Ripple/UseRipple';

interface IUsePagenation extends IStyledFC {
    totalPage: number,
    onChange: (value: number) => void,
    disabled?: boolean
}

const MakePagenation: React.FC<IUsePagenation> = ({className, totalPage, onChange}) => {
    
    const [currentPage, updateCurrentPage] = React.useState(1);
    const [midNumbers, updateMidNumbers] = React.useState<null | number[]>(null);

    function prevPage() {
        const newPage = currentPage - 1;
        if(newPage >= 1 && newPage <= totalPage) updateCurrentPage(newPage);
    }

    function nextPage() {
        const newPage = currentPage + 1;
        if(newPage >= 1 && newPage <= totalPage) updateCurrentPage(newPage);
    }

    React.useEffect(() => {
        // console.log(currentPage)
        if(currentPage > totalPage) {
            updateCurrentPage(totalPage);
        } else {
            if(totalPage >= 6 && midNumbers) {
                if(totalPage % 3 == 0 || (totalPage % 3 == 1 && currentPage < totalPage -1) || (totalPage % 3 == 2 && currentPage < totalPage -2)) {
                    if(currentPage % 3 == 1 && !(midNumbers[0] == currentPage) ) updateMidNumbers([currentPage, currentPage + 1, currentPage + 2]);
                    if(currentPage % 3 == 0 && !(midNumbers[2] == currentPage)) updateMidNumbers([currentPage - 2, currentPage - 1, currentPage]);
                }
            }
    
            onChange(currentPage);
        }

    }, [currentPage, totalPage]);

    React.useEffect(() => {
        if(totalPage >= 6) {
            if(currentPage % 3 == 0) updateMidNumbers([currentPage - 2, currentPage - 1, currentPage]);
            if(currentPage % 3 == 1) updateMidNumbers([currentPage, currentPage + 1, currentPage + 2]);
            if(currentPage % 3 == 2) updateMidNumbers([currentPage - 1, currentPage, currentPage + 1]);
        } 

        if(totalPage == 1) updateMidNumbers([1]);
        if(totalPage == 2) updateMidNumbers([1, 2]);
        if(totalPage == 3) updateMidNumbers([1, 2, 3]);
        if(totalPage == 4) updateMidNumbers([1, 2, 3, 4]);
        if(totalPage == 5) updateMidNumbers([1, 2, 3, 4, 5]);
    }, [totalPage]);

    return ( <div className={className}>
            <UseRipple>
                <span className={currentPage == 1? "btn btn-prev disabled" : "btn btn-prev"} onClick={prevPage}>
                    <FontAwesomeIcon icon={["fas", "angle-left"]} />
                </span>
            </UseRipple>
            {
               totalPage >= 6? <>
                    {
                        currentPage >= 4?  
                        <UseRipple>
                            <span className="btn prev-btn" onClick={(e) => updateCurrentPage(1)}>
                                1
                            </span>    
                        </UseRipple> : ''
                    }
                
                    {
                        currentPage >= 4? <>
                            <span className="btn hidden-pages">
                                <strong>...</strong>
                            </span>
                        
                        </> : ''
                    }

                    {
                        midNumbers? midNumbers.map((item, index) => {
                            return (
                                <UseRipple key={index}>
                                    <span className={item == currentPage? 'btn page-number current-page' : 'btn page-number'} onClick={(e) => updateCurrentPage(item)}>
                                        <strong>{item}</strong>
                                    </span>
                                </UseRipple>
                            )
                        }) : ''
                    }

                    {
                        (totalPage % 3 == 0 && currentPage <= totalPage - 3) ||
                        (totalPage % 3 == 1 && currentPage <= totalPage - 4) || 
                        (totalPage % 3 == 2 && currentPage <= totalPage - 5)? <>
                            <span className="btn hidden-pages">
                                <strong>...</strong>
                            </span>
                        </> : ''
                    }

                    {
                        (totalPage % 3 == 2 && currentPage > totalPage - 5)?  
                        <UseRipple>
                            <span className={currentPage == totalPage - 1? 'btn page-number current-page' : 'btn page-number'} onClick={(e) => updateCurrentPage(totalPage - 1)}>
                                {totalPage - 1}
                            </span>
                        </UseRipple> : ''
                    }

                    {
                        (totalPage % 3 == 0 && currentPage <= totalPage - 3) ||
                        (totalPage % 3 == 1) || (totalPage % 3 == 2)?  
                        <UseRipple>
                            <span className={currentPage == totalPage? 'btn page-number current-page' : 'btn page-number'} onClick={(e) => updateCurrentPage(totalPage)}>
                                {totalPage}
                            </span>
                        </UseRipple> : ''
                    }
               </> : <>
                    {
                        midNumbers? midNumbers.map((item, index) => {
                            return (
                                <UseRipple key={index}>
                                    <span className={index + 1 == currentPage? 'btn page-number current-page' : 'btn page-number'} onClick={(e) => updateCurrentPage(index + 1)}>
                                        <strong>{index + 1}</strong>
                                    </span>
                                </UseRipple>
                            )
                        }) : ''
                    }
               </> 
            }
            <UseRipple>
                <span className={currentPage == totalPage? "btn btn-next disabled" : "btn btn-next"} onClick={nextPage}>
                    <FontAwesomeIcon icon={["fas", "angle-right"]} />
                </span>
            </UseRipple>
        </div>
    )
}

export default MakePagenation;