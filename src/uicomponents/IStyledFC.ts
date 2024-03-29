import { ReactElement, ReactNode } from "react";

export interface IStyledFC {
    className?: string,
    children?: React.ReactChild | React.ReactChild[] | ReactNode,
}