import React from 'react';
import styled from 'styled-components';
import { IStyledFC } from '../IStyledFC';

interface IBackdrop extends IStyledFC {
    blurBg?: boolean;
}

const FCBackdrop: React.FC<IBackdrop> = ({className}) => {

    return (
        <div className={className}>
            
        </div>
    )
}

export default FCBackdrop;