import React, { ReactNode, createContext, useContext } from 'react';

interface IDeleteModal {
   
};

type TConfirmDeleteFunctionReturnPromise = Promise<{success: boolean}>;

export type TConfirmDeleteFunction = () => TConfirmDeleteFunctionReturnPromise;

interface IDeleteModalContext {
    modalState: "close" | "active" | "open" | "remove" | "inactive";
    itemName: string;
    successMessage: string;
    closeDeleteModal: () => void;
    renderDeleteModal: (itemName: string, successMessage: string, confirmBtnAction: TConfirmDeleteFunction) => void,
    confirmBtnAction: TConfirmDeleteFunction | null
}

export const DeleteModalContextProvider = createContext<IDeleteModalContext | undefined>(undefined);

const DeleteModalContext:React.FC<{children: ReactNode}> = ({children}) => {

    const [deleteModalState, updateDeleteModalState] = React.useState<"close" | "active" | "open" | "remove" | "inactive">("inactive");
    const [confirmBtnFunction, setConfirmBtnFunction] = React.useState<null |TConfirmDeleteFunction>(null);
    const [itemName, setItemName] = React.useState("");
    const [successMessage, setSuccessMessage] = React.useState("");

    React.useEffect(() => {
        if(deleteModalState == "close") {
            setTimeout(() => {
                updateDeleteModalState("inactive");
                setConfirmBtnFunction(null);
                setItemName("");
            }, 100);
        }

        if(deleteModalState == "active") {
            setTimeout(() => {
                updateDeleteModalState("open");
            }, 10);
        }
    }, [deleteModalState]);

    return (
        <DeleteModalContextProvider.Provider value={{
            modalState: deleteModalState,
            itemName: itemName,
            successMessage: successMessage,
            confirmBtnAction: confirmBtnFunction,
            closeDeleteModal: () => updateDeleteModalState("close"),
            renderDeleteModal: (itemName, successMessage, confirmBtnAction) => {
                setItemName(itemName);
                setSuccessMessage(successMessage);
                setConfirmBtnFunction(() => confirmBtnAction);
                updateDeleteModalState("active");
            }
        }}>
            { children }
        </DeleteModalContextProvider.Provider>
    )
}

export default DeleteModalContext;