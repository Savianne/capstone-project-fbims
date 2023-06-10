import React from 'react';
import styled, { css } from 'styled-components';
import { IStyledFC } from '../../IStyledFC';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IDateCell } from "../../../utils/calendar6x7/useCalendar42";

//Reusables import 
import Button from "../Buttons/Button";
import Revealer from '../Revealer';
import Devider from '../devider';
import UseRipple from "../Ripple/UseRipple";
import TimePicker from './TimePicker';
import Input from '../Inputs/Input';
import Select, { Option} from '../Inputs/Select';
//Hooks 
import useCalendar42 from "../../../utils/calendar6x7/useCalendar42";
import useDateToggle from "../../../utils/calendar6x7/useDateToggle";

//Helpers
import { getFollowingDatesOfEventAsString } from "../../../utils/calendar6x7/useEventChip";
import compareYMD from "../../../utils/calendar6x7/compareYMD";
import YMDtoMS from "../../../utils/calendar6x7/YMD-to-ms";

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

interface IDateRangePicker extends IStyledFC {
   initDate: Date;
   onValChange: (val: { from: Date; to: Date}) => void
}

const FCDateRangePicker: React.FC<IDateRangePicker> = ({className, initDate, onValChange}) => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "Octover", "November", "December"];
    // const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const elementRef = React.useRef<HTMLDivElement | null>(null);
    const [cellSize, updateCellSize] = React.useState<number | null>(null);
    const [onViewDate, dateToggles] = useDateToggle(initDate);
    const [calendarDates, updateCalendarDate] = useCalendar42(onViewDate);
    const [onSelectDate, updateOnSelectDate] = React.useState<{from: Date, to: Date}>({from: onViewDate, to: onViewDate});
    const [selectedDate, updateSelectedDate] = React.useState<{from: Date, to: Date}>({from: onViewDate, to: onViewDate})
    const [selector, updateSelector] = React.useState<"from" | "to" | "none">('none');
    const [allDay, setAllDay] = React.useState(false);

    const selectedCellHarness = React.useMemo(() => {
        const eventDatesKeyRows = getFollowingDatesOfEventAsString(selectedDate.from, selectedDate.to, selectedDate.to); 
        return eventDatesKeyRows.reduce((P, C) => {
            const obj: Record<string, ISelectedCellIndicator> = {
                [C[0]]: {
                    col: C.length,
                    isIndicatorStart: compareYMD(new Date(C[0]), selectedDate.from).isSame,
                    isIndicatorEnd: compareYMD(new Date(C[C.length - 1]), selectedDate.to).isSame,
                }
            }
            return {...P, ...obj }
        }, {} as Record<string, ISelectedCellIndicator>);

    }, [selectedDate]);

    const onSelectedCellHarness = React.useMemo(() => {

    }, [onSelectDate]);

    React.useEffect(() => {
        onValChange(selectedDate)
    }, [selectedDate]);
    
    React.useEffect(() => {
        console.log(selectedCellHarness)
    }, [selectedCellHarness])

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
    return (
        <div className={className} ref={elementRef}>
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
                                                    <DateRangePickerCell 
                                                    cellSize={cellSize} 
                                                    dateCell={dateCell} 
                                                    selectedCellIndicator={selectedCellHarness[`${dateCell.date.getFullYear()}-${dateCell.date.getMonth() + 1}-${dateCell.date.getDate()}`]} 
                                                    onHover={(d) => {
                                                        if(selector == "from") {
                                                            if(YMDtoMS(d.date) > YMDtoMS(selectedDate.to)) {
                                                                updateSelectedDate({to: selectedDate.to, from: selectedDate.to});
                                                            } else {
                                                                updateSelectedDate({...selectedDate, from: d.date});
                                                            }
                                                        } 
                                                        else if(selector == "to") {
                                                            if(YMDtoMS(d.date) < YMDtoMS(selectedDate.from)) {
                                                                updateSelectedDate({to: selectedDate.from, from: selectedDate.from});
                                                            } else {
                                                                updateSelectedDate({...selectedDate, to: d.date});
                                                            }
                                                            
                                                        }
                                                    }} 
                                                    onClick={(d) => {
                                                        if(selector == "from") {
                                                            if(YMDtoMS(d.date) <= YMDtoMS(selectedDate.to)) {
                                                                updateSelectedDate({...selectedDate, from: d.date});
                                                                updateSelector("none");
                                                            } 
                                                            else {
                                                                updateSelectedDate({to: d.date, from: d.date});
                                                                updateSelector("none");
                                                            }
                                                        } 
                                                        else if(selector == "to") {
                                                            if(YMDtoMS(d.date) >= YMDtoMS(selectedDate.from)) {
                                                                updateSelectedDate({...selectedDate, to: d.date});
                                                                updateSelector("none")
                                                            } 
                                                            else {
                                                                updateSelectedDate({to: d.date, from: d.date});
                                                                updateSelector("none");
                                                            }
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
                    <div className="selector-group-container">
                        <div className="selector-group">
                            <span className={selector == "from"? "active-selector selector" : "selector"}>
                                <Button 
                                label={`${days[selectedDate.from.getDay()]}, ${months[selectedDate.from.getMonth()]} ${selectedDate.from.getDate()}`} 
                                variant="hidden-bg-btn" 
                                color="theme" 
                                onClick={(e) => selector == "from"? updateSelector('none') : updateSelector('from')} />
                            </span>
                            <Revealer reveal={!allDay} maxHeight='140px'>
                                <TimePicker onChange={(d) => console.log(d)} value='00:00'/>
                            </Revealer>
                        </div>
                        <i className="arrow">
                            <FontAwesomeIcon icon={["fas", "arrow-right"]} />
                        </i>
                        <div className="selector-group">
                            <span className={selector == "to"? "active-selector selector" : "selector"}>
                                <Button 
                                label={`${days[selectedDate.to.getDay()]}, ${months[selectedDate.to.getMonth()]} ${selectedDate.to.getDate()}`} 
                                variant="hidden-bg-btn" 
                                color="theme" 
                                onClick={(e) => selector == "to"? updateSelector('none') : updateSelector('to')} />
                            </span>
                            <Revealer reveal={!allDay} maxHeight='140px'>
                                <TimePicker onChange={(d) => console.log(d)} value='00:00'/>
                            </Revealer>
                        </div>
                    </div>
                    <Input 
                    type="checkbox" 
                    placeholder="All day" 
                    label="All day" 
                    onValChange={
                        (val) => {
                            const v = val as boolean;
                            setAllDay(v);
                        }
                    }/>
                </>
            }
        </div>
    )
}

const DateRangePicker = styled(FCDateRangePicker)`
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

    .selector-group-container {
        align-items: center;
        margin-top: 10px;
        /* justify-content: center; */
    }

    .selector-group-container .selector-group {
        flex: 1;
        flex-wrap: wrap;
        justify-content: center;
    }

    ${Devider} {
        flex: 0 1 100%;
    }

    .selector-group-container .arrow {
        margin: 0 10px;
        font-size: 10px;
        color: ${({theme}) => theme.textColor.strong};
    }

    .selector-group-container .selector-group .selector {
        display: flex;
        flex: 0 1 100%;
        font-size: 11px;
        font-weight: 600;
        justify-content: center;
        border-bottom: 1px solid ${({theme}) => 'transparent'};
    }

    .selector-group-container .selector-group .selector ${Button} {
        flex: 1;
        background-color: ${({theme}) => theme.background.lighter};
    }

    .selector-group-container .selector-group ${TimePicker} {
        font-size: 15px;
        margin-top: 5px;
        /* flex: 0 1 fit-content; */
    }

    .selector-group-container .selector-group .active-selector {
        border-bottom: 1px solid ${({theme}) => theme.staticColor.primary};
    }


    ${Input} {
        padding: 5px 0 0;
    }
`

export default DateRangePicker;