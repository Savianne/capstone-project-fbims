import styled, { css } from "styled-components";
import { createPortal } from "react-dom";
import React, { ReactChildren, ReactElement, useContext } from "react";
import { IStyledFC } from "../../IStyledFC";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { usePopper } from "react-popper";

// import { Scrollbars } from 'react-custom-scrollbars-2';

//Types
import { TInputVal } from "../../../utils/hooks/useFormControl(old)";
import { IFormErrorFieldValues } from "../../../utils/hooks/useFormControl(old)";

//Reusables
import UseRipple from "../Ripple/UseRipple";
import Scrollbar from "../ScrollBar";
import InputErrorToltip from "./InputErrorToltip";

export const SelectContext = React.createContext<{
  selected: string | null;
  select?: (option: string) => void;
}>({
  selected: null,
});

export interface IFCSelect extends IStyledFC {
  // children: ReactElement[],
  children: any;
  viewOnly?: boolean;
  placeholder: string;
  value?: string;
  error?: IFormErrorFieldValues | string | null;
  disabled?: boolean;
  onValChange: (val: string) => void;
}

const FCSelect: React.FC<IFCSelect> = ({
  className,
  children,
  value,
  placeholder,
  error,
  disabled,
  onValChange,
}) => {
  const selectRef = React.useRef<HTMLDivElement | null>(null);
  const [controlled, setControlled] = React.useState(value !== undefined? true : false)
  const [options, updateOptions] = React.useState<{[key: string]: {label: string, index: number, selected: boolean}}>({});
  const [compState, updateCompState] = React.useState("onBlur");
  const [selectedValue, updateSelectedValue] = React.useState<string>(
    ""
  );
  const [valueInOptions, setValueInOptions] = React.useState(false);

  const [referenceElement, setReferenceElement] =
    React.useState<null | HTMLSpanElement>(null);
  const [popperElement, setPopperElement] =
    React.useState<null | HTMLDivElement>(null);

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


  React.useEffect(() => {
    disabled
      ? selectRef.current?.setAttribute("disabled", "true")
      : selectRef.current?.setAttribute("disabled", "false");
  }, [disabled]);

  React.useEffect(() => {
    const childrenArray = React.Children.toArray(children);
    const optionList: { [key: string]: {label: string, index: number, selected: boolean} } = childrenArray.reduce(
      (P, C, I) => {
        const i = C as
          | React.ReactElement<any, string | React.JSXElementConstructor<any>>
          | React.ReactPortal;
        return {
          ...P,
          ...{ [i.props.value as string]: {label: i.props.children as string, index: I, selected: i.props.selected? true : false}},
        };
      },
      {}
    );
    updateOptions(optionList)
  }, [children]);

  React.useEffect(() => {
    if(controlled) {
      value == null || value == ""
      ? selectRef.current?.setAttribute("placeholder-state", "vissible")
      : selectRef.current?.setAttribute("placeholder-state", "hidden");
    } else {
      onValChange(selectedValue);
      selectedValue == null || selectedValue == ""
        ? selectRef.current?.setAttribute("placeholder-state", "vissible")
        : selectRef.current?.setAttribute("placeholder-state", "hidden");
    }
  }, [selectedValue, value]);

  React.useEffect(() => {
    selectRef.current?.setAttribute("state", compState);
  }, [compState]);

  React.useEffect(() => {
    function handleArrorKeyEvents(event: KeyboardEvent) {
      if (compState == "onFocus") {
        const selectedOptionIndex = controlled? (value !== null? options[value as string].index : null) : (selectedValue !== null ? options[selectedValue as string].index : null);
        event.preventDefault();
        switch (event.keyCode) {
          case 38:
            if (
              typeof selectedOptionIndex == "number" &&
              selectedOptionIndex > 0
            ) {
              console.log(Object.entries(options).filter((option) => option[1].index == selectedOptionIndex - 1)[0][0])
              controlled? onValChange(Object.entries(options).filter((option) => option[1].index == selectedOptionIndex - 1)[0][0]) : updateSelectedValue(Object.entries(options).filter((option) => option[1].index == selectedOptionIndex - 1)[0][0]);
            } 
            break;
          case 40:
            if (!(typeof selectedOptionIndex == "number"))
              controlled? onValChange(Object.keys(options)[0]) : updateSelectedValue(Object.keys(options)[0]);
            if (
              typeof selectedOptionIndex == "number" &&
              selectedOptionIndex < Object.keys(options).length - 1
            )
              controlled? onValChange(Object.entries(options).filter((option) => option[1].index == selectedOptionIndex + 1)[0][0]) : updateSelectedValue(Object.entries(options).filter((option) => option[1].index == selectedOptionIndex + 1)[0][0]);
            break;
          case 13:
            updateCompState("onBlur");
        }
      }
    }
    document.addEventListener("keydown", handleArrorKeyEvents);

    return function cleanup() {
      document.removeEventListener("keydown", handleArrorKeyEvents);
    };
  }, [compState, selectedValue, value, options]);

  React.useEffect(() => {
    controlled? setValueInOptions(Object.keys(options).includes(value as string)) : setValueInOptions(Object.keys(options).includes(selectedValue))
  }, [options, selectedValue, value]);

  // React.useEffect(() => {
  //   if(controlled) onValChange(value as string);
  // }, [])
  return (
    <SelectContext.Provider
      value={{
        selected: controlled? value as string : selectedValue,
        select: (option) => {
          setTimeout(() => {
            controlled? onValChange(option) : updateSelectedValue(option);
            updateCompState("onBlur");
          }, 400);
        },
      }}
    >
      <div
        className={className}
        ref={selectRef}
        onClick={(e) => {
          if (!disabled) updateCompState("onFocus");
        }}
      >
        <span className="placeholder">{placeholder}</span>
        <span className="arrow-icon">
          <FontAwesomeIcon icon={["fas", "caret-down"]} />
        </span>
        {compState == "onFocus" && (
          <span
            className="options-container-ref"
            ref={setReferenceElement}
          ></span>
        )}

        {
          controlled? <>
            { options && value && Object.keys(options).includes(value) && <span className="value">{options[value as string].label}</span> }
          </> : <>
            { options && selectedValue && Object.keys(options).includes(selectedValue) && <span className="value">{options[selectedValue].label}</span> }
          </>
        }
        
        {compState == "onFocus" && (
          <SelectBackdrop
            modalWidth={`${selectRef.current?.clientWidth}px`}
            onClick={(e) => {
              e.stopPropagation();
              updateCompState("onBlur");
            }}
          >
            <div
              className="options-container"
              onClick={(e) => e.stopPropagation()}
              id="modal"
              ref={setPopperElement}
              style={styles.popper}
              {...attributes.popper}
            >
              <Scrollbar>{children}</Scrollbar>
            </div>
          </SelectBackdrop>
        )}

        {/* {
          error && typeof error !== 'string' && <span className="error-toltip">
            <InputErrorToltip error={error} />
          </span>
        } */
        }
        {
          error && typeof error !== 'string' && <p className="error-text">{error.errorText}</p>
        }
        {
          error && typeof error == 'string' && <p className="error-text">{error}</p>
        }
        
      </div>
    </SelectContext.Provider>
  );
};

interface IFCOption extends IStyledFC {
  value: string;
  selected?: boolean;
  // callBackFC?: () => void
}

const FCOption: React.FC<IFCOption> = ({
  value,
  className,
  children,
  selected,
}) => {
  const optionRef = React.useRef<HTMLSpanElement | null>(null);
  const parentSelectContext = useContext(SelectContext);

  React.useEffect(() => {
    const selectedVal = parentSelectContext.selected;
    optionRef.current?.setAttribute(
      "selected",
      selectedVal == value ? "true" : "false"
    );
  }, [parentSelectContext.selected]);

//   React.useEffect(() => {
//     if (selected && parentSelectContext.select)
//       parentSelectContext.select(value);
//   }, [selected]);
  return (
    <span
      className={className}
      ref={optionRef}
      onClick={(e) => {
        if (parentSelectContext.select) parentSelectContext.select(value);
      }}
    >
      <OptionLabel>
        <p>{children}</p>
      </OptionLabel>
    </span>
  );
};

const OptionLabel = styled(UseRipple)`
  display: flex;
  flex: 0 1 100%;
  /* font-size: 10px; */
  height: 100%;
  padding: 0 10px;
  align-items: center;
  cursor: pointer;
  min-width: 0;
  & p {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;

export const Option = styled(FCOption)``;

const SelectBackdrop = styled.div<{ modalWidth: string }>`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  width: 100%;
  height: 100%;
  background-color: transparent;
  z-index: 10000;

  #modal {
    width: ${(prop) => prop.modalWidth};
  }
`;

const Select = styled(FCSelect)`
    position: relative;
    display: flex;
    flex: 1;
    min-width: 0;
    height: 20px;
    align-items: center;
    border: 0;
    border-bottom: ${(prop) =>
      prop.error
        ? `1px solid ${prop.theme.staticColor.delete}`
        : "1px solid #d2d2d2"};
    font-size: 15px;
    color: ${({ theme }) => theme.textColor.strong};
    padding: 7px 3px;
    background: transparent;
    transition: border-color 0.2s;

    
    & .value {
        flex: 0 1 100%;
        min-width: 0;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .options-container-ref {
        width: 100%;
        height: 0;
        position: absolute;
        top: calc(100% + 5px);
        left: 0;
    }

    & ${SelectBackdrop} .options-container {
        display: flex;
        flex: 1;
        flex-wrap: wrap;
        /* width: calc(100% - 2px); */
        /* width: 400px; */
        min-width: 0;
        overflow-x: hidden;
        overflow-y: ${(props) =>
          React.Children.toArray(props.children).length > 10
            ? "auto"
            : "hidden"};
        background-color: ${({ theme }) => theme.background.primary};
        color: ${({ theme }) => theme.textColor.strong};
        z-index: 1000;
        transition: height 0.1s linear, opacity 0.3s linear, top 0.3s linear, box-shadow 0.1s linear;
        border: 1px solid ${({ theme }) => theme.borderColor};
        box-shadow: rgb(0 0 0 / 20%) 0px 5px 5px -3px, rgb(0 0 0 / 14%) 0px 8px 10px 1px, rgb(0 0 0 / 12%) 0px 3px 14px 2px;
    }

    & .arrow-icon {
        position: absolute;
        right: 10px;
    }

    &[disabled='true'] {
        border-color: ${({ theme }) => theme.textColor.disabled};
        color: ${({ theme }) => theme.textColor.disabled};
        cursor: not-allowed;
        opacity: 0.7;
    }

    &[disabled='true'] .placeholder {
        color: ${({ theme }) => theme.textColor.disabled};
        opacity: 0.7;
    }

    ${(props) =>
      props.disabled &&
      css`
        opacity: 0.5;
        cursor: not-allowed;
      `};

    &[state='onFocus'] .arrow-icon {
        transform: rotate(180deg);
    }

    &[state='onBlur'] ${SelectBackdrop} .options-container {
        top: 95%;
        height: 0;
        opacity: 0;
        overflow-y: hidden;
        box-shadow: none;
        padding: 0;
    }

    &[state='onFocus'] ${SelectBackdrop} .options-container {
        height: calc(30px * ${(props) =>
          React.Children.toArray(props.children).length});
        max-height: calc(30px * 10);
    }

    & .placeholder,
    &[placeholder-state='vissible'] .placeholder {
        font-size: 15px;
        cursor: text;
        top: 5px;
        left: 5px;
        z-index: 0;
        color: ${(prop) =>
          prop.error ? `${prop.theme.staticColor.delete}` : "#9b9b9b"}
    }

    &[state='onFocus'] .placeholder,
    &[placeholder-state='hidden'] .placeholder {
        position: absolute;
        top: -18px;
        left: 0;
        display: block;
        transition: 0.2s;
        font-size: 12px;
        /* color: #9b9b9b; */
        color: ${(prop) =>
          prop.error ? `${prop.theme.staticColor.delete}` : "#9b9b9b"}
    }
    &[state='onFocus'] .placeholder {
        /* color: ${({ theme }) => theme.staticColor.primary}; */
        color: ${(prop) =>
          prop.error
            ? `${prop.theme.staticColor.delete}`
            : `${prop.theme.staticColor.primary}`}
    }
    &[state='onFocus'] {
        border-bottom: 2px solid ${({ theme }) => theme.staticColor.primary};
        border-bottom: ${(prop) =>
          prop.error
            ? `2px solid ${prop.theme.staticColor.delete}`
            : `2px solid ${prop.theme.staticColor.primary}`}
    }

    & ${SelectBackdrop} .options-container ${Option} {
        display: flex;
        flex: 0 1 100%;
        height: 30px;
        min-width: 0;
        transition: background-color 0.2s linear;
        background-color: transparent;
    }

    & ${SelectBackdrop} .options-container ${Option}[selected='true'],
    & ${SelectBackdrop} .options-container ${Option}[selected='true']:hover {
        background-color: ${({ theme }) => theme.background.light};
    }
    & ${SelectBackdrop} .options-container ${Option}:hover {
        background-color: #e4eff742;
    }
    & .error-text {
        position: absolute;
        top: calc(100% + 1px);
        font-size: 11px;
        color: ${({ theme }) => theme.staticColor.delete}
    }

    ${(props) =>
      props.viewOnly
        ? css`
            border-color: #d2d2d2;
            color: ${({ theme }) => theme.textColor.strong};
            cursor: not-allowed;
            pointer-events: none;
          `
        : ""}
    /* & .error-toltip {
        position: absolute;
        top: calc(100% + 1px);
        width: 100%;
        font-size: 11px;
        color: ${({ theme }) => theme.staticColor.delete};
        z-index: 100;
    } */
`;

export default Select;
