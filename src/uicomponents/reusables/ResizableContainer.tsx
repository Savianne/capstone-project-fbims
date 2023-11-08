import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { IStyledFC } from '../IStyledFC';

interface IResizableContainer extends IStyledFC {
    minHeight?: number,
}

const FCResizableContainer: React.FC<IResizableContainer> = ({className, children, minHeight}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseMoveElRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);

  const [isResizing, setIsResizing] = useState(false);
  const [resizeHeight, setResizeHeight] = React.useState<number | undefined>(undefined);

  React.useEffect(() => {
    if(resizeHeight !== undefined) {
        if(minHeight && resizeHeight > minHeight) {
            if (containerRef.current) {
                containerRef.current.style.height = `${resizeHeight}px`;
            }
        } else if(resizeHeight > 10) {
            if (containerRef.current) {
                containerRef.current.style.height = `${resizeHeight}px`;
            }
        }
    }
  }, [resizeHeight]);

  React.useEffect(() => {
    function handleMouseMove(this: HTMLElement, e: MouseEvent) {
        e.stopPropagation();
        const y = containerRef.current?.getBoundingClientRect();
        const curY = e.clientY;
        const h = y !== undefined ? curY - y.top : undefined;
        setResizeHeight(h);
    };

    function handleMouseUp(this: HTMLElement, e: MouseEvent) {
        setIsResizing(false);
    }

    if(isResizing) {
        mouseMoveElRef.current?.addEventListener('mousemove', handleMouseMove);
        mouseMoveElRef.current?.addEventListener('mouseup', handleMouseUp);

        return () => {
            mouseMoveElRef.current?.removeEventListener('mousemove', handleMouseMove);
            mouseMoveElRef.current?.removeEventListener('mouseup', handleMouseUp);
        };
    }
  }, [isResizing])
  return (
    <div className={className} ref={containerRef}>
        { children }
        {
            isResizing && <div className="mouse-move-ele" ref={mouseMoveElRef}></div>
        }
        <div className='handle' ref={handleRef} 
        onMouseDown={() => setIsResizing(true)}>
        </div>
        <svg 
        xmlns="http://www.w3.org/2000/svg" 
        id="svgicon"  
        viewBox="0 0 1024 1024" 
        version="1.1"
        onMouseDown={() => setIsResizing(true)}>
            <path d="M938.666667 938.666667 853.333333 938.666667 853.333333 853.333333 938.666667 853.333333 938.666667 938.666667M938.666667 768 853.333333 768 853.333333 682.666667 938.666667 682.666667 938.666667 768M768 938.666667 682.666667 938.666667 682.666667 853.333333 768 853.333333 768 938.666667M768 768 682.666667 768 682.666667 682.666667 768 682.666667 768 768M597.333333 938.666667 512 938.666667 512 853.333333 597.333333 853.333333 597.333333 938.666667M938.666667 597.333333 853.333333 597.333333 853.333333 512 938.666667 512 938.666667 597.333333Z"/>
        </svg>
    </div>
  );
};

const ResizableContainer = styled(FCResizableContainer)`
    position: relative;
    width: 100px;
    padding: 5px;
    border: 1px solid ${({theme}) => theme.borderColor};
    height: ${(props) => props.minHeight? `${props.minHeight}px` : 'fit-content'};
    /* transition: height 100ms; */

    .handle {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 5px;
        overflow: visible;
        cursor: row-resize;
        color: ${({theme}) => theme.textColor.light};

    }

    #svgicon {
        position:  absolute;
        bottom: 5px;
        right: 5px;
        width: 20px;
        height: 20px;
        font-size: 20px;
        cursor: ns-resize;
        fill: ${({theme}) => theme.textColor.light};
    }

    .mouse-move-ele {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 10000;
        width: 100%;
        height: 100vh;
        cursor: row-resize;
        background-color: transparent;
    }
`;

export default ResizableContainer;
