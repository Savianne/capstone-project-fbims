export type TResponseFlag<TD> = {
    success: boolean,
    error?: any,
    data?: TD
}