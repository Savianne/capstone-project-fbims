import { Scrollbars } from 'react-custom-scrollbars-2';
import React from 'react';
import { IStyledFC } from '../IStyledFC';
import styled from 'styled-components';

interface IScrollbarTrack extends IStyledFC {
    scrollbarProps: any
}

const ScrollbarTrack: React.FC<IScrollbarTrack> = (props) => {
    return <div className={props.className} {...props.scrollbarProps} />
}

const StyledScrollbarTrack = styled(ScrollbarTrack)`
    color: pink;
`;

interface IScrollBar extends IStyledFC {
    scrollBarProps?: any
}

const Scrollbar: React.FC<IScrollBar> = (props) => {
    return (
        <Scrollbars
        {
            ...props.scrollBarProps
        }
        // renderTrackHorizontal={props => <div {...props} className="render-track-horizontal" /> }
        // renderTrackVertical={props => <div {...props} className="render-track-vertical" /> }
        // renderThumbHorizontal={props => <div {...props} className="render-thumb-horizontal" /> }
        // renderThumbVertical={props => <div {...props} className="render-thumb-vertical" /> }
        // renderView={props => <div {...props} className="view"/>}
        >
            {props.children}
        </Scrollbars>
    );
} 


export default Scrollbar;

