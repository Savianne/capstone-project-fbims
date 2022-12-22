import styled from "styled-components";
import React, { ReactElement, useContext } from "react";
import { IStyledFC } from "../../IStyledFC";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


export const SelectContext = React.createContext<{selected: string | null, select?: (option: string) => void}>({
    selected: null,
});

export interface IFCSelect extends IStyledFC {
    children: ReactElement[],
    placeholder: string,
}

const FCSelect: React.FC<IFCSelect> = ({className, children, placeholder}) => {
    const selectRef = React.useRef<HTMLDivElement | null>(null);
    const [options, updateOptions] = React.useState<string[]>([]);
    const [selectedOptionIndex, updateSelectedOptionIndex] = React.useState<number | null>(null);
    const [onClickArea, setOnClickArea] = React.useState(false);
    const [compState, updateCompState] = React.useState('onBlur');

    React.useEffect(() => {
        selectRef.current?.setAttribute('state', compState);
    }, [compState]);

    React.useEffect(() => {
        if(options.length) {
            const selectedItems = children.filter(item => item.props.selected);
            if(selectedItems.length) updateSelectedOptionIndex(options.indexOf(selectedItems[selectedItems.length - 1].props.value));
        }
    }, [options]);

    React.useEffect(() => {
        // console.log(selectedOptionIndex)
        !(typeof selectedOptionIndex == 'number')? selectRef.current?.setAttribute('placeholder-state', 'vissible') : options[selectedOptionIndex] == ""? selectRef.current?.setAttribute('placeholder-state', 'vissible') : selectRef.current?.setAttribute('placeholder-state', 'hidden');
    }, [selectedOptionIndex]);

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
        const optionList = children.map(item => item.props.value);
        updateOptions(optionList);
    }, []);

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
        
    })
    return (
        <SelectContext.Provider value={{selected: typeof selectedOptionIndex == 'number'? options[selectedOptionIndex] : null, select: (option) => updateSelectedOptionIndex(options.indexOf(option))}}>
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
                {
                    typeof selectedOptionIndex == 'number' && options.length? <span className="value">{ options[selectedOptionIndex] }</span> : ''
                }
                
                <div className="options-container">
                    { children }
                </div> 
            </div>
        </SelectContext.Provider>
    )
}

interface IFCOption extends IStyledFC {
    value: string,
    selected?: boolean
}

const FCOption: React.FC<IFCOption> = ({value, className, children, selected}) => {
    const optionRef = React.useRef<HTMLSpanElement | null>(null)
    const parentSelectContext = useContext(SelectContext);

    React.useEffect(() => {
        const selectedVal = parentSelectContext.selected;
        optionRef.current?.setAttribute('selected', selectedVal == value? 'true' : 'false');
    }, [parentSelectContext]);

        React.useEffect(() => {
        
        }, []);
    return (
        <span className={className} ref={optionRef} onClick={(e) => {
            if(parentSelectContext.select) parentSelectContext.select(value);
        }}>
            { children }
        </span>
    )
}


export const Option = styled(FCOption)`

`;

const Select = styled(FCSelect)`
    position: relative;
    display: flex;
    flex: 1;
    height: 20px;
    align-items: center;
    border: 0;
    border-bottom: 1px solid #d2d2d2;
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
       overflow: hidden;
       background-color: ${({theme}) => theme.background.primary};
       color: ${({theme}) => theme.textColor.strong};
       z-index: 1000;
       height: calc(30px * ${(props) => props.children.length});
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
        color: #9b9b9b;
        
    }

    &[state='onFocus'] .placeholder {
        color: ${({theme}) => theme.staticColor.primary};
    }

    &[state='onFocus'] {
        border-bottom: 2px solid ${({theme}) => theme.staticColor.primary};
    }

    & .options-container ${Option} {
        display: flex;
        align-items: center;
        flex: 0 1 100%;
        height: 30px;
        padding: 0 10px;
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
`;

export default Select;