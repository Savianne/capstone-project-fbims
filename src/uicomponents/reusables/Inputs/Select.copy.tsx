import styled from "styled-components";
import PropTypes from 'prop-types';
import React, { ReactChildren, ReactElement, useContext } from "react";
import { IStyledFC } from "../../IStyledFC";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// import { Scrollbars } from 'react-custom-scrollbars-2';

//Types 
import { TInputVal } from "../../../utils/hooks/useFormControl(old)";

//Reusables
import UseRipple from "../Ripple/UseRipple";
import Scrollbar from "../ScrollBar";

export const SelectContext = React.createContext<{selected: string | null, select?: (option: string) => void}>({
    selected: null,
});

export interface IFCSelect extends IStyledFC {
    // children: ReactElement[],
    children: any,
    placeholder: string,
    error?: string | null,
    disabled?: boolean,
    onValChange: (val: string) => void
}


const FCSelect: React.FC<IFCSelect> = ({className, children, placeholder, error, disabled, onValChange}) => {
    const selectRef = React.useRef<HTMLDivElement | null>(null);
    const [options, updateOptions] = React.useState<string[]>([]);
    const [selectedOptionIndex, updateSelectedOptionIndex] = React.useState<number | null>(null);
    const [onClickArea, setOnClickArea] = React.useState(false);
    const [compState, updateCompState] = React.useState('onBlur');
    const [selectedValue, updateSelectedValue] = React.useState<null | string>(null);
    const [childrenArray, setChildrenArray] = React.useState(React.Children.toArray(children));

    // const childrenArray = React.Children.toArray(children); // Support autofill.

    React.useEffect(() => {
        setChildrenArray(React.Children.toArray(children))
    }, [children]);

    React.useEffect(() => {
        if(!(selectedValue == null)) onValChange(selectedValue);
    }, [selectedValue]);

    React.useEffect(() => {
        selectRef.current?.setAttribute('state', compState);
    }, [compState]);

    React.useEffect(() => {
        // alert('option changed')
        if(options.length) {
            const selectedItems = childrenArray.filter(item => {
                const i = item as React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactPortal;
                return i.props.selected
            });

            const si = selectedItems[selectedItems.length - 1] as React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactPortal;
            if(selectedItems.length) updateSelectedOptionIndex(options.indexOf(si.props.value));
        }
    }, [options]);

    React.useEffect(() => {
        if(typeof selectedOptionIndex == 'number' && options.length) updateSelectedValue(options[selectedOptionIndex]);
        !(typeof selectedOptionIndex == 'number')? selectRef.current?.setAttribute('placeholder-state', 'vissible') : options[selectedOptionIndex] == ""? selectRef.current?.setAttribute('placeholder-state', 'vissible') : selectRef.current?.setAttribute('placeholder-state', 'hidden');
    }, [selectedOptionIndex, childrenArray]);

    React.useEffect(() => {
        function handleArrorKeyEvents(event: KeyboardEvent) {
            if(compState == 'onFocus') {
                event.preventDefault();
                switch (event.keyCode) {
                    case 38:
                        if(typeof selectedOptionIndex == 'number' && selectedOptionIndex > 0) updateSelectedOptionIndex(selectedOptionIndex - 1);
                        break;
                    case 40:
                        if(!(typeof selectedOptionIndex == 'number')) updateSelectedOptionIndex(0);
                        if(typeof selectedOptionIndex == 'number' && selectedOptionIndex < options.length - 1) updateSelectedOptionIndex(selectedOptionIndex + 1);
                        break;
                    case 13:
                        updateCompState('onBlur');
                }
            }
        }

        document.addEventListener('keydown', handleArrorKeyEvents);

        return function cleanup() {
            document.removeEventListener('keydown', handleArrorKeyEvents);
        }
    }, [selectedOptionIndex, compState]);

    React.useEffect(() => {
        const optionList = childrenArray.map(item => {
            const i = item as React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactPortal;
            return i.props.value
        });
        updateOptions(optionList);
    }, [childrenArray]);

    React.useEffect(() => {
        function clickAway() {
            if(compState == 'onFocus' && !(onClickArea)) {
                updateCompState('onBlur');
            }
        }

        window.addEventListener('click', clickAway);

        return function cleanUp() {
            window.removeEventListener('click', clickAway);
        }
        
    });

    return (
        <SelectContext.Provider value={{selected: typeof selectedOptionIndex == 'number'? options[selectedOptionIndex] : null, select: (option) => {
            setTimeout(() => {
                updateSelectedOptionIndex(options.indexOf(option));
                updateCompState('onBlur');
                setOnClickArea(false);
            }, 400);
        }}}>
            <div className={className} 
            ref={selectRef} 
            onClick={() => updateCompState('onFocus')}
            onMouseEnter={() => {
                setOnClickArea(true);
            }}
            onMouseLeave={() => {
                setOnClickArea(false);
            }}>
                <span className="placeholder">{ placeholder }</span>
                <span className="arrow-icon"><FontAwesomeIcon icon={["fas", "caret-down"]} /></span>
                {/* {
                    typeof selectedOptionIndex == 'number' && options.length? <span className="value">{ options[selectedOptionIndex] }</span> : ''
                } */}
                 {
                    selectedValue? <span className="value">{ selectedValue }</span> : ''
                }
                    <div className="options-container">
                        <Scrollbar>
                            { children }
                        </Scrollbar>
                    </div> 
                {
                    error? <>
                        <p className="error-text">
                            {
                                error
                            }
                        </p>
                    </> : ''
                }
            </div>
        </SelectContext.Provider>
    )
}

interface IFCOption extends IStyledFC {
    value: string,
    selected?: boolean,
    callBackFC?: () => void
}

const FCOption: React.FC<IFCOption> = ({value, className, children, selected, callBackFC}) => {
    const optionRef = React.useRef<HTMLSpanElement | null>(null)
    const parentSelectContext = useContext(SelectContext);
    const [isPending, startTransition] = React.useTransition();

    React.useEffect(() => {
        const selectedVal = parentSelectContext.selected;
        optionRef.current?.setAttribute('selected', selectedVal == value? 'true' : 'false');
    }, [parentSelectContext]);

    return (
        <span className={className} ref={optionRef} onClick={(e) => {
            if(parentSelectContext.select) parentSelectContext.select(value);
            startTransition(() => {
                if(callBackFC) callBackFC();
            })

        }}>
            <OptionLabel>{children}</OptionLabel>
        </span>
    )
}

const OptionLabel = styled(UseRipple)`
    display: flex;
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    /* font-size: 10px; */
    height: 100%;
    padding: 0 10px;
    align-items: center;
`;

export const Option = styled(FCOption)`
    
`;

const Select = styled(FCSelect)`
    position: relative;
    display: flex;
    flex: 1;
    height: 20px;
    align-items: center;
    border: 0;
    border-bottom: ${(prop) => prop.error? `1px solid ${prop.theme.staticColor.delete}` : '1px solid #d2d2d2'};
    font-size: 15px;
    color: ${({theme}) => theme.textColor.strong};
    padding: 7px 3px;
    background: transparent;
    transition: border-color 0.2s;
    /* background-color: ${({theme}) => theme.mode == 'dark'? '#f9f9f90a' : '#f9f9f9'}; */
    
    & .options-container {
       display: flex;
       flex-wrap: wrap;
       width: calc(100% - 2px);
       position: absolute;
       top: 105%;
       left: 0;
       overflow-x: auto;
       overflow-y: ${(props) => React.Children.toArray(props.children).length > 10? 'auto' : 'hidden' };
       background-color: ${({theme}) => theme.background.primary};
       color: ${({theme}) => theme.textColor.strong};
       z-index: 1000;
       height: calc(30px * ${(props) => React.Children.toArray(props.children).length});
       max-height: calc(30px * 10);
       transition: height 0.1s linear, opacity 0.3s linear, top 0.3s linear, box-shadow 0.1s linear;
       border: 1px solid ${({theme}) => theme.borderColor};
       box-shadow: rgb(0 0 0 / 20%) 0px 5px 5px -3px, rgb(0 0 0 / 14%) 0px 8px 10px 1px, rgb(0 0 0 / 12%) 0px 3px 14px 2px;
    }

    & .arrow-icon {
        position: absolute;
        right: 10px;
    }

    &[state='onFocus'] .arrow-icon {
        transform: rotate(180deg);
    }

    &[state='onBlur'] .options-container {
        top: 95%;
        height: 0;
        opacity: 0;
        overflow-y: hidden;
        box-shadow: none;
        padding: 0;
    }


    &[placeholder-state='vissible'] .placeholder {
        font-size: 15px;
        cursor: text;
        top: 5px;
        left: 5px;
        z-index: 0;
    }

    & .placeholder,
    &[state='onFocus'] .placeholder {
        position: absolute;
        top: -18px;
        left: 0;
        display: block;
        transition: 0.2s;
        font-size: 12px;
        /* color: #9b9b9b; */
        color: ${(prop) => prop.error? `${prop.theme.staticColor.delete}` :'#9b9b9b'}
    }

    &[state='onFocus'] .placeholder {
        /* color: ${({theme}) => theme.staticColor.primary}; */
        color: ${(prop) => prop.error? `${prop.theme.staticColor.delete}` : `${prop.theme.staticColor.primary}`}
    }

    &[state='onFocus'] {
        border-bottom: 2px solid ${({theme}) => theme.staticColor.primary};
        border-bottom: ${(prop) => prop.error? `2px solid ${prop.theme.staticColor.delete}` : `2px solid ${prop.theme.staticColor.primary}`}
    }

    & .options-container ${Option} {
        display: flex;
        flex: 0 1 100%;
        height: 30px;
        transition: background-color 0.2s linear;
        background-color: transparent;
    }

    & .options-container ${Option}[selected='true'],
    & .options-container ${Option}[selected='true']:hover {
        background-color: ${({theme}) => theme.background.light};
    }

    & .options-container ${Option}:hover {
        background-color: #e4eff742;
    }

    & .error-text {
        position: absolute;
        top: calc(100% + 1px);
        font-size: 11px;
        color: ${({theme}) => theme.staticColor.delete}
    }
`;

export default Select;