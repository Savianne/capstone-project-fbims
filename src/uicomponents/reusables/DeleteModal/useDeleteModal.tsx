import React, { useContext } from "react";
import { TConfirmDeleteFunction } from "./DeleteModalContext";
import { DeleteModalContextProvider } from "./DeleteModalContext";

function useDeleteModal() {
    const deleteModalContext = useContext(DeleteModalContextProvider);

    return deleteModalContext?.renderDeleteModal as (itemName: string, successMessage: string, confirmBtnAction: () =>  Promise<{success: boolean}>) => void
}

export default useDeleteModal;