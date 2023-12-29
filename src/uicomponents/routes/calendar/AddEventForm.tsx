import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IStyledFC } from "../../IStyledFC";
import { Scrollbars } from 'react-custom-scrollbars-2';

//Reusable imports
import Button from "../../reusables/Buttons/Button";
import Input from "../../reusables/Inputs/Input";
import Select, { Option } from "../../reusables/Inputs/Select";
import Devider from "../../reusables/devider";
import Revealer from "../../reusables/Revealer";
import RadioInput from "../../reusables/Inputs/RadioInput";

import DateRangePicker from "../../reusables/DateRangePicker/DateRangePicker";

//Global State improrts
import { useAppDispatch, useAppSelector } from "../../../global-state/hooks";
import { closeForm, openForm, removeForm } from "../../../global-state/action-creators/createEventFormSlice";

interface IAddEventForm extends IStyledFC {

}

const FCAddEventForm: React.FC<IAddEventForm> = ({className}) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const [selectedDate, updateSelectedDate] = React.useState<null | {from: Date; to: Date}>(null);
    const dispatch = useAppDispatch();
    const formState = useAppSelector(state => state.addEventFormReducer.state);
    const [repeatingPattern, updateReapingPattern] = React.useState("null");

    React.useEffect(() => {
        if(formState == 'close') {
            setTimeout(() => {
                dispatch(removeForm());
            }, 180);
        }
        if(formState == 'ondisplay') {
            setTimeout(() => {
                dispatch(openForm());
            }, 10)
        }
    }, [formState]);

    return ( 
        <div className={className} 
        onClick={(e) => {
            dispatch(closeForm());
        }}>
            <FormContent state={formState}
            onClick={(e) => e.stopPropagation()}>
                <img src="/assets/images/Calendar-Events.png"/>
                <div className="form-header">
                    <Button 
                    label="close" 
                    icon={<FontAwesomeIcon icon={["fas", "times"]} />} 
                    variant="hidden-bg-btn"
                    onClick={(e) => dispatch(closeForm())} 
                    iconButton />
                </div>
                <h1>Create Event</h1>
                <Scrollbars 
                autoHide 
                autoHeight
                autoHeightMin={0}
                autoHeightMax={"80vh"}>
                    <div className="form-body">
                        <span className="input-area">
                            <Input placeholder="Add Title" type="text" onValChange={(e) => console.log(e)} autoFocus/>
                        </span>
                        <DateRangePicker initDate={new Date} onValChange={(val) => updateSelectedDate(val)}/>
                        <Revealer reveal={selectedDate != null}>
                            {
                                selectedDate? <>
                                    <span className="input-area repeat-input-area">
                                        <Select placeholder="Reapeat" onValChange={(e) => updateReapingPattern(e)}>
                                            <Option value="null">Does not Reapeat</Option>
                                            <Option value="d">Daily</Option>
                                            <Option value="w">Weekly</Option>
                                            <Option value="y">Monthly</Option>
                                            <Option value="y">Yearly</Option>
                                        </Select>
                                    </span>
                                    <Revealer reveal={repeatingPattern !== "null"} maxHeight="300px">
                                        {
                                            repeatingPattern == "d"? <p className="info-text">Event will Reccur every day</p> :
                                            repeatingPattern == "w"? <p className="info-text">Event will Reccur Weekly every {days[selectedDate.from.getDay()]}</p> : ''
                                        }
                                        
                                        <div className="repeat-ends-data-entry-area">
                                            <h2>Ends</h2>
                                            <div className="repeat-ends-data-entry-category">
                                                <RadioInput label="Never" name="end-category" value="never" />
                                            </div>
                                            <div className="repeat-ends-data-entry-category">
                                                <RadioInput label="On" name="end-category" value="on" />
                                            </div>
                                            <div className="repeat-ends-data-entry-category">
                                                <RadioInput label="After" name="end-category" value="after" />
                                            </div>
                                        </div>
                                    </Revealer>
                                </> : ''
                            }
                        </Revealer>
                        {/* <div className="some-content"></div> */}
                    </div>
                </Scrollbars>
            </FormContent>
        </div>
    )
}

const AddEventForm = styled(FCAddEventForm)`
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100vh;
    background-color: transparent;
    z-index: 5000;
    left: 0;
    top: 0;
`;

const FormContent = styled.div<{state: string}>`
    position: relative;
    flex-wrap: wrap;
    max-width: ${(props) => props.state == "open"? '800px' : '150px'};
    min-width: 300px;
    max-height: 0;
    max-height: ${(props) => props.state == "open"? '1000px' : 0};
    opacity: ${(props) => props.state == "open"? '1' : "0.40"};
    border-radius: 5px;
    border: 1px solid ${({theme}) => theme.borderColor};
    background-color: ${({theme}) => theme.background.primary};
    box-shadow: ${(props) => props.state == "open"? '17px 20px 61px 21px rgb(0 0 0 / 25%)' : 'none'};
    overflow: hidden;
    padding-bottom: 10px;
    transition: max-height 200ms, max-width 100ms, opacity 100ms, box-shadow 100ms;

    img {
        position: absolute;
        width: 120%;
        opacity: 0.05;
        top: -5%;
        left: -20%;
    }

    h1 {
        padding: 0 25px;
        flex: 0 1 100%;
        font-size: 30px;
        font-weight: 600;
        color: ${({theme}) => theme.textColor.strong};
        z-index: 1;
    }

    .form-header {
        display: flex;
        flex: 0 1 100%;
        height: fit-content;
        padding: 5px;
        /* border-bottom: 0.5px solid ${({theme}) => theme.borderColor}; */
        background-color: ${({theme}) => theme.background.lighter};
        z-index: 1;
    }

    .form-header ${Button} {
        margin-left: auto;
    }

    .form-body {
        display: flex;
        flex-wrap: wrap;
        flex: 0 1 100%;
        height: fit-content;
        padding: 10px 25px;
    }

    .form-body .input-area {
        flex: 0 1 100%;
        margin: 15px 0;
        font-size: 30px;
    }

    .form-body ${Revealer} .repeat-input-area {
        margin-top: 35px;
    }

    .form-body .some-content {
        flex: 0 1 100%;
        height: 500px;
    }

    .form-body ${Revealer} ${Revealer} .repeat-ends-data-entry-area {
        display: flex;
        flex: 0 1 100%;
        flex-wrap: wrap;
        margin-top: 10px;
    }

    .form-body ${Revealer} ${Revealer} .info-text,
    .form-body ${Revealer} ${Revealer} .repeat-ends-data-entry-area h2,
    .form-body ${Revealer} ${Revealer} .repeat-ends-data-entry-area .repeat-ends-data-entry-category  {
        font-size: 15px;
        color: ${({theme}) => theme.textColor.strong};
        flex: 0 1 100%;
    }

    .form-body ${Revealer} ${Revealer} .info-text {
        padding: 7px 10px;
        font-size: 12px;
        border-left: 2px solid ${({theme}) => theme.staticColor.edit};
        background-color: ${({theme}) => theme.background.lighter};
    }

    .form-body ${Revealer} ${Revealer} .repeat-ends-data-entry-area .repeat-ends-data-entry-category {
        /* background-color: gray; */
        margin-left: 2px 2px 2px 0;
    }
`
export default AddEventForm;