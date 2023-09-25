import React from "react";
import styled from "styled-components";
import { IStyledFC } from "../IStyledFC";

interface ITabs extends IStyledFC {
    value: string;
    onChange: (val:string) => void;
}

const TabsContext = React.createContext<{value: string, setValue: (value: string) => void} | undefined>(undefined);

const SimpleTabsFC: React.FC<ITabs> = ({className, value, onChange, children}) => {
    const [tab, setTab] = React.useState(value);
    // React.useEffect(() => {
    //     const childrenArray = React.Children.toArray(children);
    //     setTab((childrenArray[0] as React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactPortal).props.value);
    // }, [children]);
    React.useEffect(() => {
        onChange(tab)
    }, [tab])
    return (
        <TabsContext.Provider value={{value: tab, setValue: (value:string) => setTab(value)}}>
            <div className={className}>
                {
                    children
                }
            </div>
        </TabsContext.Provider>
    )
};

interface ITab extends IStyledFC {
    value: string,
    label: string
}

const TabFC:React.FC<ITab> = ({className, value, label}) => {
    const tabsContext = React.useContext(TabsContext);
    const tabRef = React.useRef<null | HTMLDivElement>(null);

    React.useEffect(() => {
        (value === tabsContext?.value)? tabRef.current?.setAttribute('active', "true") : tabRef.current?.setAttribute('active', "false");
    }, [tabsContext?.value]);
    return(
        <div className={className} ref={tabRef} onClick={() => {
            tabsContext?.setValue(value);
        }}>
            {
                label
            }
        </div>
    )
}

export const Tab = styled(TabFC)`
    display: inline-flex;
    padding: 5px 10px;
    color: ${({theme}) => theme.textColor.light};
    cursor:  pointer;
    font-size: 13px;
    font-weight: 500;
    transition: background-color 300ms ease-in-out, color 300ms ease-in-out;

    &&:hover {
        background-color: ${({theme}) => theme.background.light};
    }

    &&[active=true] {
        color: ${({theme}) => theme.staticColor.primary};
        cursor: default;
        &&:hover {
            background-color: transparent;
        }
    }
    
`;

const SimpleTab = styled(SimpleTabsFC)`
    display: flex;
    flex: 1;
    height: fit-content;
    padding: 5px 0;
    border-bottom: 1px solid ${({theme}) => theme.borderColor};
    margin-bottom: 15px;
`;

export default SimpleTab;