import React from "react";

interface IPaginationNumber {
    number: number;
    isCurrentPage: boolean;
}

interface IPagination {
    isPageStart: boolean;
    isPageEnd: boolean;
    pageNumbers: (null | IPaginationNumber)[]; 
    prevPage: () => void;
    nextPage: () => void;
    setPage: (page: number) => void;
}

const usePagination: (totalPage: number, onChange: (val:number) => void) => IPagination = (totalPage, onChange) => {
    const [pageNumbers, setPageNumbers] = React.useState<(null | IPaginationNumber)[]>([]);
    const [currentPage, setCurrentPage] = React.useState(1);

    React.useEffect(() => {
        if(totalPage == 1) setPageNumbers([{number: 1, isCurrentPage: currentPage === 1}]);
        if(totalPage == 2) setPageNumbers([{number: 1, isCurrentPage: currentPage === 1}, {number: 2, isCurrentPage: currentPage === 2}]);
        if(totalPage == 3) setPageNumbers([{number: 1, isCurrentPage: currentPage === 1}, {number: 2, isCurrentPage: currentPage === 2}, {number: 3, isCurrentPage: currentPage === 3}]);
        if(totalPage == 4) setPageNumbers([{number: 1, isCurrentPage: currentPage === 1}, {number: 2, isCurrentPage: currentPage === 2}, {number: 3, isCurrentPage: currentPage === 3}, {number: 4, isCurrentPage: currentPage === 4}]);
        if(totalPage == 5) setPageNumbers([{number: 1, isCurrentPage: currentPage === 1}, {number: 2, isCurrentPage: currentPage === 2}, {number: 3, isCurrentPage: currentPage === 3}, {number: 4, isCurrentPage: currentPage === 4}, {number: 5, isCurrentPage: currentPage === 5}]);
        if(totalPage >= 6 && totalPage < 9) {
            if(currentPage <= 3) {
                setPageNumbers([{number: 1, isCurrentPage: currentPage === 1}, {number: 2, isCurrentPage: currentPage === 2}, {number: 3, isCurrentPage: currentPage === 3}, null, {number: totalPage, isCurrentPage: currentPage === totalPage}]);
            } else {
                const pn: IPaginationNumber[] = [];
                for(let n = 4; n <= totalPage; n++) {
                    pn.push({number: n, isCurrentPage: currentPage === n})
                }

                setPageNumbers([{number: 1, isCurrentPage: false}, null, ...pn]);
            }
        }

        if(totalPage >= 9) {
            if(currentPage <= 3) {
                setPageNumbers([{number: 1, isCurrentPage: currentPage === 1}, {number: 2, isCurrentPage: currentPage === 2}, {number: 3, isCurrentPage: currentPage === 3}, null, {number: totalPage, isCurrentPage: false}]);
            }
            else if((totalPage % 3 === 0 && currentPage < totalPage - 2) || (totalPage % 3 === 1 && currentPage < totalPage - 3) || (totalPage % 3 === 2 && currentPage < totalPage - 4)) {
                let midNums: IPaginationNumber[] = [];
                switch(currentPage % 3) {
                    case 0:
                        midNums = [{number: currentPage - 2, isCurrentPage: false}, {number: currentPage - 1, isCurrentPage: false}, {number: currentPage, isCurrentPage: true}];
                    break;
                    case 1:
                        midNums = [{number: currentPage, isCurrentPage: true}, {number: currentPage + 1, isCurrentPage: false}, {number: currentPage + 2, isCurrentPage: false}];
                    break;
                    case 2:
                        midNums = [{number: currentPage - 1, isCurrentPage: false}, {number: currentPage, isCurrentPage: true}, {number: currentPage + 1, isCurrentPage: false}];
                };

                setPageNumbers([{number: 1, isCurrentPage: false}, null, ...midNums, null, {number: totalPage, isCurrentPage: false}]);
            } else {
                const pn: IPaginationNumber[] = [];
                let end = totalPage % 3 === 0? 3 : totalPage % 3 === 1? 4 : 5;
                for(let n = 1; n <= end; n++) {
                    pn.push({number: totalPage - (n - 1), isCurrentPage: currentPage === totalPage - (n - 1)})
                }

                setPageNumbers([{number: 1, isCurrentPage: false}, null, ...pn.sort(function(a, b){return a.number - b.number})]);
            }
        }
    }, [totalPage, currentPage]);

    React.useEffect(() => {
        onChange(currentPage);
    }, [currentPage])
    return {
        isPageEnd: currentPage === totalPage,
        isPageStart: currentPage === 1,
        pageNumbers: pageNumbers,
        prevPage: () => {
            if(currentPage > 1) setCurrentPage(currentPage - 1)
        },
        nextPage: () => {
            if(currentPage < totalPage) setCurrentPage(currentPage + 1)
        },
        setPage: (page:number) => {
            if(page > 0 && page <= totalPage) setCurrentPage(page);
        }
    }
};

export default usePagination;
