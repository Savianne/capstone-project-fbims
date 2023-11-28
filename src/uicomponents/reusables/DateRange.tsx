import React from 'react';
import styled, { css } from 'styled-components';
import { usePopper } from 'react-popper';
import { IStyledFC } from '../IStyledFC';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IDateCell } from "../../utils/calendar6x7/useCalendar42";

//Reusables import 
import Button from "./Buttons/Button";
import Revealer from './Revealer';
import Devider from './devider';
import UseRipple from "./Ripple/UseRipple";
import TimePicker from './TimePicker';
import Input from './Inputs/Input';
import Select, { Option} from './Inputs/Select';
//Hooks 
import useCalendar42 from "../../utils/calendar6x7/useCalendar42";
import useDateToggle from "../../utils/calendar6x7/useDateToggle";

//Helpers
import { getFollowingDatesOfEventAsString } from "../../utils/calendar6x7/useEventChip";
import compareYMD from "../../utils/calendar6x7/compareYMD";
import YMDtoMS from "../../utils/calendar6x7/YMD-to-ms";

interface ISelectedCellIndicator {
    col: number;
    isIndicatorStart: boolean;
    isIndicatorEnd: boolean;
}

interface IFCSelectedCellIndicator extends IStyledFC {
    selectedIndicator: ISelectedCellIndicator
}

const FCSelectedCellIndicator: React.FC<IFCSelectedCellIndicator> = ({className}) => {

    return (
        <div className={className}>
            {/* <UseRipple /> */}
        </div>
    )
}

const SelectedCellIndicator = styled(FCSelectedCellIndicator)`
    display: flex;
    flex-shrink: 0;
    background-color: ${({theme}) => theme.mode == "dark"? "#d1edff57" : "#d1edff"};
    height: 80%;
    width: ${(props) => 100 * props.selectedIndicator.col}%;

    border-radius: ${(props) => {
        return props.selectedIndicator.isIndicatorStart && props.selectedIndicator.isIndicatorEnd? "10px" : 
        props.selectedIndicator.isIndicatorStart == false && props.selectedIndicator.isIndicatorEnd? "0 10px 10px 0" : 
        props.selectedIndicator.isIndicatorStart && props.selectedIndicator.isIndicatorEnd == false? "10px 0 0 10px" : 0
    }};

    ${(props) => (
       props.selectedIndicator.col == 1 && props.selectedIndicator.isIndicatorStart && props.selectedIndicator.isIndicatorEnd && css`
            height: 30px;
            width: 30px;
            border-radius: 50%;
        `)
    }

    ${(props) => (
        props.selectedIndicator.col == 1 && props.selectedIndicator.isIndicatorStart && props.selectedIndicator.isIndicatorEnd && css`
            margin-left: auto;
            margin-right: auto;
        `)
    }


`;

interface IDateRangePickerCell extends IStyledFC {
    cellSize: number;
    dateCell: IDateCell;
    selectedCellIndicator?: ISelectedCellIndicator;
    onHover: (d: IDateCell) => void;
    onClick: (d: IDateCell) => void;
}

const FCDateRangePickerCell: React.FC<IDateRangePickerCell> = ({className, cellSize, dateCell, selectedCellIndicator, onClick, onHover}) => {
    return (
        <div className={className}
        onMouseEnter={(e) => onHover(dateCell)}
        onClick={(e) => onClick(dateCell)}>
            <UseRipple>
                <p className='cell-date-text'>{dateCell.date.getDate()}</p>
            </UseRipple>
            <div className="selected-cell-indicator-container">
                {selectedCellIndicator && <SelectedCellIndicator selectedIndicator={selectedCellIndicator} />}
            </div>
        </div>
    )
}

const DateRangePickerCell = styled(FCDateRangePickerCell)`
    position: relative;
    display: flex;
    flex: 1;
    height: ${(props) => `${(0.8 * props.cellSize)}px`};
    overflow: visible;
    font-size: 10px;
    color: ${(props) => props.dateCell.isPadding? props.theme.textColor.light : props.theme.textColor.strong};
    font-weight: ${(props) => props.dateCell.isPadding? 400 : 600};
    cursor: pointer;

    ${UseRipple} {
        position: relative;
        display: flex;
        width: 100%;
        height: 100%;
        justify-content: center;
        align-items: center;
        /* border-radius: 50%; */
    }

    ${UseRipple} .cell-date-text {
        z-index: 2;
    }

    :hover {
        -webkit-box-shadow: 6px 6px 7px -3px rgba(10,10,10,0.08);
        -moz-box-shadow: 6px 6px 7px -3px rgba(10,10,10,0.08);
        box-shadow: 6px 6px 7px -3px rgba(10,10,10,0.08);
    }

    .selected-cell-indicator-container {
        position: absolute;
        display: flex;
        height: 100%;
        width: 100%;
        align-items: center;
        overflow-x: visible;
    }
`;

const Backdrop = styled.div`
    && {
        width: 100%;
        height: 100vh;
        position: fixed;
        top: 0;
        left: 0;
        background-color: transparent;
        z-index: 1000;
    }
`
interface IDateRangeSelect extends IStyledFC {
   value: {from: Date, to: Date} | null;
   onValChange: (val: { from: Date; to: Date} | null) => void;
}

const FCDateRangeSelect: React.FC<IDateRangeSelect> = ({className, value, onValChange}) => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "Octover", "November", "December"];
    // const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const elementRef = React.useRef<HTMLDivElement | null>(null);
    const [cellSize, updateCellSize] = React.useState<number | null>(null);
    const [onViewDate, dateToggles] = useDateToggle(value? value.from : new Date());
    const [calendarDates, updateCalendarDate] = useCalendar42(onViewDate);
    // const [selectedDate, updateSelectedDate] = React.useState<{from: Date, to: Date}>({from: onViewDate, to: onViewDate})
    const [selector, updateSelector] = React.useState<"from" | "to" | "none">('none');
    const [onFocust, setOnFocust] = React.useState(false);
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

    const selectedCellHarness = React.useMemo(() => {
        if(value) {
            const eventDatesKeyRows = getFollowingDatesOfEventAsString(value.from, value.to, value.to); 
            return eventDatesKeyRows.reduce((P, C) => {
                const obj: Record<string, ISelectedCellIndicator> = {
                    [C[0]]: {
                        col: C.length,
                        isIndicatorStart: compareYMD(new Date(C[0]), value.from).isSame,
                        isIndicatorEnd: compareYMD(new Date(C[C.length - 1]), value.to).isSame,
                    }
                }
                return {...P, ...obj }
            }, {} as Record<string, ISelectedCellIndicator>);
        }
    }, [value]);

    // React.useEffect(() => {
    //     onValChange(selectedDate)
    // }, [selectedDate]);

    const [rows, updateRows] = React.useState<[
        IDateCell[], 
        IDateCell[], 
        IDateCell[], 
        IDateCell[], 
        IDateCell[], 
        IDateCell[]
    ] | null>(null);

    React.useEffect(() => {
        if(calendarDates) {
            const newRows: [
                IDateCell[], 
                IDateCell[], 
                IDateCell[], 
                IDateCell[], 
                IDateCell[], 
                IDateCell[]
            ] = [[], [], [], [], [], []];
    
            calendarDates.forEach((item, index) => {
                index >= 0 && index <= 6 ? newRows[0].push(item) : 
                index >= 7 && index <= 13? newRows[1].push(item) :
                index >= 14 && index <= 20? newRows[2].push(item) :
                index >= 21 && index <= 27? newRows[3].push(item) : 
                index >= 28 && index <= 34? newRows[4].push(item) : 
                newRows[5].push(item);
            });
    
            updateRows(newRows);
        }

    }, [calendarDates]);

    React.useEffect(() => {
        updateCalendarDate(onViewDate);
    }, [onViewDate]);

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

      React.useEffect(() => {
        if(onFocust) {
            updateSelector("from");
        } else updateSelector("none")
      }, [onFocust])
    return (
    <>
        <div className={className} ref={elementRef}>
            <span className="calendar-icon">
                <FontAwesomeIcon icon={['fas', 'calendar-alt']} />
            </span>
            <div className="selected-dates">
                <span className={selector == "from"? "from-date active-selector" : "from-date"} 
                onClick={() => {
                    updateSelector("from");
                    setOnFocust(true);
                }}>
                    {
                        value? value.from.toDateString() : "--------------------"
                    }
                </span>
                -
                <span className={selector == "to"? "to-date active-selector" : "to-date"} 
                onClick={() => {
                    updateSelector("to");
                    setOnFocust(true);
                }}>
                    {
                        value? value.to.toDateString() : "--------------------"
                    }
                </span>
            </div>
            {
                value !== null? <span className="clear-value-btn" onClick={() => onValChange(null)}>
                    <FontAwesomeIcon icon={["fas", "times"]} />
                </span> : ""
            }
            <span className="angle-arror-toggle" onClick={() => setOnFocust(true)}>
                <Button iconButton icon={<FontAwesomeIcon icon={["fas", "angle-down"]} />} label='select' variant='hidden-bg-btn' onClick={() => setOnFocust(true)}/>
            </span>
            {
                onFocust? <div className="selector-container" ref={setReferenceElement}></div> : ""
            }
            {
                onFocust?
                <div 
                className='picker' 
                ref={setPopperElement}
                style={styles.popper}
                {...attributes.popper}>
                    {
                        cellSize && <>
                            <div className="tool-bar">
                                <strong className='date-text'>{months[onViewDate.getMonth()]} {onViewDate.getFullYear()}</strong>
                                <span className="date-toggle-group">
                                    <Button 
                                    icon={<FontAwesomeIcon icon={["fas", "angle-left"]} />} 
                                    label="Toggle Prev Date" 
                                    variant="hidden-bg-btn" 
                                    color="theme" 
                                    iconButton 
                                    onClick={(e) => dateToggles.togglePrevMonth()} 
                                    />
                                    <Button 
                                    icon={<FontAwesomeIcon icon={["fas", "angle-right"]} />} 
                                    label="Toggle Next Date" 
                                    variant="hidden-bg-btn" 
                                    color="theme" 
                                    iconButton 
                                    onClick={(e) => dateToggles.toggleNextMonth()} 
                                    />
                                </span>
                            </div>
                            <div className="calendar-days-row">
                                <span className="collumn-head">{cellSize >= 85? "SUNDAY" : "SUN"}</span>
                                <span className="collumn-head">{cellSize >= 85? "MONDAY" : "MON"}</span>
                                <span className="collumn-head">{cellSize >= 85? "TUESDAY" : "TUE"}</span>
                                <span className="collumn-head">{cellSize >= 85? "WEDNESDAY" : "WED"}</span>
                                <span className="collumn-head">{cellSize >= 85? "THURSDAY" : "THU"}</span>
                                <span className="collumn-head">{cellSize >= 85? "FRIDAY" : "FRI"}</span>
                                <span className="collumn-head">{cellSize >= 85? "SATURDAY" : "SAT"}</span>
                            </div>
                            {
                                rows && rows.map((item, index) => {
                                    return (
                                        <div className="calendar-row" key={index}>
                                            {
                                                item.map(dateCell => {
                                                    return (
                                                        <div className="calendar-cell-row" key={dateCell.date.getTime()}>
                                                            <DateRangePickerCell 
                                                            cellSize={cellSize} 
                                                            dateCell={dateCell} 
                                                            selectedCellIndicator={selectedCellHarness? selectedCellHarness[`${dateCell.date.getFullYear()}-${dateCell.date.getMonth() + 1}-${dateCell.date.getDate()}`] : undefined} 
                                                            onHover={(d) => {
                                                                if(value) {
                                                                    if(selector == "from") {
                                                                        if(YMDtoMS(d.date) > YMDtoMS(value.to)) {
                                                                            onValChange({to: value.to, from: value.to});
                                                                        } else {
                                                                            onValChange({...value, from: d.date});
                                                                        }
                                                                    } 
                                                                    else if(selector == "to") {
                                                                        if(YMDtoMS(d.date) < YMDtoMS(value.from)) {
                                                                            onValChange({to: value.from, from: value.from});
                                                                        } else {
                                                                            onValChange({...value, to: d.date});
                                                                        }
                                                                    }
                                                                }
                                                            }} 
                                                            onClick={(d) => {
                                                                if(value) {
                                                                    if(selector == "from") {
                                                                        if(YMDtoMS(d.date) <= YMDtoMS(value.to)) {
                                                                            onValChange({...value, from: d.date});
                                                                            updateSelector("none");
                                                                        } 
                                                                        else {
                                                                            onValChange({to: d.date, from: d.date});
                                                                            updateSelector("none");
                                                                        }
                                                                    } 
                                                                    else if(selector == "to") {
                                                                        if(YMDtoMS(d.date) >= YMDtoMS(value.from)) {
                                                                            onValChange({...value, to: d.date});
                                                                            updateSelector("none")
                                                                        } 
                                                                        else {
                                                                            onValChange({to: d.date, from: d.date});
                                                                            updateSelector("none");
                                                                        }
                                                                    }
                                                                } else {
                                                                    onValChange({to: d.date, from: d.date});
                                                                    updateSelector("none");
                                                                }
                                                            }} />
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    )
                                })
                            }
                            
                        </>
                    }
                </div> : ""
            }
        </div>
        {
            onFocust? <Backdrop onClick={() => setOnFocust(false)} /> : ""
        }
    </>
    )
}

const DateRangeSelect = styled(FCDateRangeSelect)`
    && {
        position: relative;
        display: flex;
        flex: 0 1 280px;
        height: 45px;
        padding: 0 10px;
        align-items: center;
        border: 1px solid ${({theme}) => theme.borderColor};
        border-radius: 4px;
        background-color: ${({theme}) => theme.background.primary};
        color: ${({theme}) => theme.textColor.strong};
        z-index: 1005;
    }

    && > .clear-value-btn {
        font-size: 12px;
        padding: 0 10px;
        width: fit-content;
        height: fit-content;
        cursor: pointer;
    }

    && > .selector-container {
        display: flex;
        position: absolute;
        width: 100%;
        height: 0;
        left: 0;
        top: calc(100% + 5px);
    }
    
    && > .calendar-icon {
        width: fit-content;
        height: fit-content;
        font-size: 18px;
        color: ${({theme}) => theme.textColor.light};
        margin-right: 10px;
    }

    && > .angle-arror-toggle {
        flex: 0 0 fit-content;
        height: fit-content;
    }

    && > .selected-dates {
        display: flex;
        flex: 1;
        align-items: center;
        justify-content: center;
    }

    && > .selected-dates > .from-date, && > .selected-dates > .to-date {
        font-size: 11px;
        padding: 0 5px;
        border-radius: 16px;
        cursor: pointer;
        
        :hover {
            transition: background-color 300ms;
            background-color: ${({theme}) => theme.background.lighter};
        }
    }

    && > .selected-dates > .from-date {
        margin-right: 5px;
    }

    && > .selected-dates > .to-date {
        margin-left: 5px;
    }

    && > .selected-dates > .active-selector {
        text-decoration: underline;
    }

    && > .picker {
        display: flex;
        flex: 0 1 100%;
        height: fit-content;
        flex-wrap: wrap;
        padding: 10px;
       /* From https://css.glass */
        background: rgba(255, 255, 255, 0.10);
        border-radius: 4px;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(7.6px);
        -webkit-backdrop-filter: blur(7.6px);
        z-index: 1001;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.25);
        /* box-shadow: 17px 20px 61px 21px rgb(0 0 0 / 25%); */
        /* border: 1px solid rgba(255, 255, 255, 0.3); */
    
        .tool-bar,
        .tool-bar > .date-toggle-group,
        .calendar-row,
        .calendar-days-row,
        .calendar-cell-row,
        .selector-group-container,
        .selector-group-container .selector-group {
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
    }
`

export default DateRangeSelect;