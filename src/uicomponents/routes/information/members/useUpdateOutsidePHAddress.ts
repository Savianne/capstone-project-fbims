import React from "react";
import doRequest from "../../../../API/doRequest";
import useFormControl from "../../../../utils/hooks/useFormControl";

function useUpdateOutsidePHAddress(label: 'permanent' | 'current') {
    const [onUpdate, setOnUpdate] = React.useState(false);
    const [onUPdateSuccess, setOnUpdateSuccess] = React.useState(false);
    const [onUpdateError, setOnUpdateError] = React.useState<null | string>(null)

    const [outsidePHAddressForm, outsidePHAddressFormValues, outsidePHAddressFormValueDispatchers] = useFormControl({
        address: {
            required: true,
            errorText: 'Invalid Entry',
            validateAs: 'text',
            minValLen: 5,
        },
    });

    return {
        errors: outsidePHAddressForm.errors,
        input: {
            address: (input: string | null) => outsidePHAddressFormValueDispatchers({...outsidePHAddressFormValues, address: input}),

        }, 
        values: outsidePHAddressFormValues,
        isUpdating: onUpdate,
        isUpdateSuccess: false,
        isUpdateError: onUpdateError? true : false,
        updateError: onUpdateError,
        isReady: outsidePHAddressForm.isReady,
        submitUpdate: (outsidePHAddressForm.isReady)?
            (memberUID: string, onSuccess: (value: string) => void) => {
                setOnUpdate(true);
                doRequest({
                    url: `/update-member-data/address/${memberUID}`,
                    method: "PATCH",
                    data: {
                        label,
                        addressType: 'outside',
                        address: (outsidePHAddressFormValues.address as string).trim()
                    }
                })
                .then(response => {
                    setOnUpdate(false);
                    if(response.success) {
                        onUpdateError && setOnUpdateError(null);
                        setOnUpdateSuccess(true);
                        onSuccess(outsidePHAddressFormValues.address as string);
                        outsidePHAddressForm.clear();
                    } else throw response.error;
                })
                .catch(err => {
                    setOnUpdate(false);
                    onUPdateSuccess && setOnUpdateSuccess(false);
                    setOnUpdateError(err);
                })
            } 
        : null
    }
}

export default useUpdateOutsidePHAddress;