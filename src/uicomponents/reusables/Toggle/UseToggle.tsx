import styled from "styled-components";
import React from "react";

interface UseToggleProps {
    className?: string,
    initialState?: string,
    name: string,
    on: (name: string) => void,
    off: (name: string) => void,
    children: JSX.Element | string,
}

const UseToggle: React.FC<UseToggleProps> = ({className, name, children, on, off, initialState = 'init'}) => {
    const ref = React.useRef<HTMLDivElement>(null);
    const [state, updateState] = React.useState(initialState);

    React.useEffect(() => {
        function handleStateUpdate(this: HTMLDivElement, e: MouseEvent) {
            state == 'on'? updateState('off') : updateState('on')
        }

        ref.current?.addEventListener('click', handleStateUpdate)

        return(() => {
            ref.current?.removeEventListener('click', handleStateUpdate);
        })

    });

    React.useEffect(() => {
        ref.current?.setAttribute('state', state);
        state !== 'init' && state == 'on'? on(name) : off(name);
    }, [state]);
    return (
        <div className={className} ref={ref}>{children}</div>
    )
}

export default UseToggle;