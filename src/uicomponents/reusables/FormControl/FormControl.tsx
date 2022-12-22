import styled from "styled-components";
import React from "react";
import { IStyledFC } from "../../IStyledFC";
import { SelectContext } from "../Inputs/Select";

// Types
import { IFCInput } from '../Inputs/Input';
import { IFCSelect } from '../Inputs/Select';

type TInputConfig = {
    maxCharLen?: number,
    minCharLen?: number,
    type?: 'text' | 'password' | 'email' | 'number',  
    required?: boolean,
    name: string,
    input: React.FC<IFCInput> | React.FC<IFCSelect>
}

interface IFCFormControl extends IStyledFC {
    method: string,
    endpoint: string, 
    fields: TInputConfig[]
}

export const FormControlContext = React.createContext({
    name: ''
});

const FCFormControl: React.FC<IFCFormControl> = ({className, method, children, fields, endpoint}) => {

    const [fieldList, updateFieldList] = React.useState();

    return (
        <FormControlContext.Provider value={{name: 'he'}}>
            <form className={className}>
                { children }
            </form>
        </FormControlContext.Provider>
    )
}

const FormControl = styled(FCFormControl)``;

export default FormControl;