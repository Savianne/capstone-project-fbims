import React from 'react';
import styled from 'styled-components';
import { IStyledFC } from '../../IStyledFC';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IDateCell } from "../../../utils/calendar6x7/useCalendar42";

//Reusables import 
import Button from "../Buttons/Button";
import UseRipple from "../Ripple/UseRipple";

interface IDateRangePickerCell extends IStyledFC {
    cellSize: number;
    dateCell: IDateCell;
}

const FCDateRangePickerCell: React.FC<IDateRangePickerCell> = ({className, cellSize, dateCell}) => {

    return (
        <div className={className}>
            <UseRipple>
                {dateCell.date.getDate()}
            </UseRipple>
        </div>
    )
}

const DateRangePickerCell = styled(FCDateRangePickerCell)`
    position: relative;
    display: flex;
    flex: 1;
    height: ${(props) => `${(0.8 * props.cellSize)}px`};
    justify-content: center;
    overflow: visible;
    font-size: 10px;
    color: ${(props) => props.dateCell.isPadding? props.theme.textColor.disabled : props.theme.textColor.strong};

    ${UseRipple} {
        display: flex;
        width: 100%;
        height: 100%;
        justify-content: center;
        /* border-radius: 50%; */
    }

    :hover {
        /* border-left: 1px solid ${({theme}) => theme.borderColor};
        border-top: 1px solid ${({theme}) => theme.borderColor}; */
        -webkit-box-shadow: 6px 6px 7px -3px rgba(10,10,10,0.08);
        -moz-box-shadow: 6px 6px 7px -3px rgba(10,10,10,0.08);
        box-shadow: 6px 6px 7px -3px rgba(10,10,10,0.08);
    }
`;

interface IDateRangePicker extends IStyledFC {
    dates: IDateCell[];
}

const FCDateRangePicker: React.FC<IDateRangePicker> = ({className, dates}) => {
    const elementRef = React.useRef<HTMLDivElement | null>(null);
    const [cellSize, updateCellSize] = React.useState<number | null>(null);
    
    
    const [rows, updateRows] = React.useState<[
        typeof dates, 
        typeof dates, 
        typeof dates, 
        typeof dates, 
        typeof dates, 
        typeof dates
    ] | null>(null);

    React.useEffect(() => {
        if(dates) {
            const newRows: [
                typeof dates, 
                typeof dates, 
                typeof dates, 
                typeof dates, 
                typeof dates, 
                typeof dates
            ] = [[], [], [], [], [], []];
    
            dates.forEach((item, index) => {
                index >= 0 && index <= 6 ? newRows[0].push(item) : 
                index >= 7 && index <= 13? newRows[1].push(item) :
                index >= 14 && index <= 20? newRows[2].push(item) :
                index >= 21 && index <= 27? newRows[3].push(item) : 
                index >= 28 && index <= 34? newRows[4].push(item) : 
                newRows[5].push(item);
            });
    
            updateRows(newRows);
        }

    }, [dates]);

    React.useEffect(() => {
        // Create a new ResizeObserver
        const observer = new ResizeObserver(entries => {
          // Loop through the ResizeObserverEntry objects
          for (let entry of entries) {
            // Log the new dimensions of the observed element
            updateCellSize((entry.contentRect.width / 7) - 1);
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
    return (
        <div className={className} ref={elementRef}>
            {
                cellSize && <>
                    <div className="tool-bar">
                        <strong className='date-text'>Aug 2023</strong>
                        <span className="date-toggle-group">
                            <Button 
                            icon={<FontAwesomeIcon icon={["fas", "angle-left"]} />} 
                            label="Toggle Prev Date" 
                            variant="hidden-bg-btn" 
                            color="theme" 
                            iconButton 
                            /* onClick={(e) => toggleType == "month"? dateToggles.togglePrevMonth() : dateToggles.togglePrevDate()} */
                            />
                            <Button 
                            icon={<FontAwesomeIcon 
                            icon={["fas", "angle-right"]} />} 
                            label="Toggle Next Date" 
                            variant="hidden-bg-btn" 
                            color="theme" 
                            iconButton 
                            /* onClick={(e) => toggleType == "month"? dateToggles.toggleNextMonth() : dateToggles.toggleNextDate()}  */
                            />
                        </span>
                    </div>
                    <div className="calendar-days-row">
                        {/* <Devider $orientation="vertical" $variant="center" /> */}
                        <span className="collumn-head">{cellSize >= 85? "SUNDAY" : "SUN"}</span>
                        {/* <Devider $orientation="vertical" $variant="center" /> */}
                        <span className="collumn-head">{cellSize >= 85? "MONDAY" : "MON"}</span>
                        {/* <Devider $orientation="vertical" $variant="center" /> */}
                        <span className="collumn-head">{cellSize >= 85? "TUESDAY" : "TUE"}</span>
                        {/* <Devider $orientation="vertical" $variant="center" /> */}
                        <span className="collumn-head">{cellSize >= 85? "WEDNESDAY" : "WED"}</span>
                        {/* <Devider $orientation="vertical" $variant="center" /> */}
                        <span className="collumn-head">{cellSize >= 85? "THURSDAY" : "THU"}</span>
                        {/* <Devider $orientation="vertical" $variant="center" /> */}
                        <span className="collumn-head">{cellSize >= 85? "FRIDAY" : "FRI"}</span>
                        {/* <Devider $orientation="vertical" $variant="center" /> */}
                        <span className="collumn-head">{cellSize >= 85? "SATURDAY" : "SAT"}</span>
                        {/* <Devider $orientation="vertical" $variant="center" /> */}
                    </div>
                    {
                        rows && rows.map((item, index) => {
                            return (
                                <div className="calendar-row">
                                    {
                                        item.map(dateCell => {
                                            // const h = harness[`${item.date.getFullYear()}-${item.date.getMonth()}-${item.date.getDate()}`]
                                            return (
                                                <div className="calendar-cell-row">
                                                    <DateRangePickerCell cellSize={cellSize} dateCell={dateCell} />
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            )
                        })
                    }
                    <div className="selector-group">
                    
                    </div>
                </>
            }
        </div>
    )
}

const DateRangePicker = styled(FCDateRangePicker)`
    display: flex;
    flex: 0 1 280px;
    height: fit-content;
    flex-wrap: wrap;

    .tool-bar,
    .tool-bar > .date-toggle-group,
    .calendar-row,
    .calendar-days-row,
    .calendar-cell-row,
    .selector-group {
        display: flex;
        flex: 0 1 100%;
    }

    .tool-bar .date-text {
        font-size: 13px;
        margin-left: 10px;
        font-weight: 600;
        color: ${({theme}) => theme.textColor.strong}
    }

    .tool-bar > .date-toggle-group {
        flex: 0 1 fit-content;
        margin-left: auto;
    }

    .tool-bar > .date-toggle-group ${Button} {
        border-radius: 50%;
        font-size: 11px;
        overflow: hidden;
    }

    .calendar-row {
        height: fit-content;
    }

    .calendar-days-row {
        height: 25px;
        font-weight: 600;
    }


    .calendar-days-row .collumn-head {
        display: flex;
        flex: 1;
        height: 100%;
        align-items: center;
        justify-content: center;
        /* font-weight: bold; */
        color: ${({theme}) => theme.textColor.strong};
        font-size: 10px;
    }

    .calendar-cell-row {
        height: 100%;
    }

    .selector-group {
        background-color: pink;
        height: 50px;
    }
`

export default DateRangePicker;