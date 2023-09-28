import React from "react";
import doRequest from "../../../../API/doRequest";
import useFormControl from "../../../../utils/hooks/useFormControl";

function useUpdateLocalAddressInfo(label: 'permanent' | 'current') {
    const [onUpdate, setOnUpdate] = React.useState(false);
    const [onUPdateSuccess, setOnUpdateSuccess] = React.useState(false);
    const [onUpdateError, setOnUpdateError] = React.useState<null | string>(null)

    const [localAddressForm, localAddressFormValueDispatchers] = useFormControl({
        region: {
            required: true,
            errorText: 'Invalid Entry',
            validateAs: 'select'
        },
        province: {
            required: true,
            errorText: 'Invalid Entry',
            validateAs: 'select'
        },
        cityOrMunicipality: {
            required: true,
            errorText: 'Invalid Entry',
            validateAs: 'select'
        },
        barangay: {
            required: true,
            errorText: 'Invalid Entry',
            validateAs: 'select'
        }
    });

    return {
        errors: localAddressForm.errors,
        input: {
            region: (input: string | null) => localAddressFormValueDispatchers?.region(input),
            province: (input: string | null) => localAddressFormValueDispatchers?.province(input),
            munCity: (input: string | null) => localAddressFormValueDispatchers?.cityOrMunicipality(input),
            barangay: (input: string | null) => localAddressFormValueDispatchers?.barangay(input)
        }, 
        values: localAddressForm.values,
        isUpdating: onUpdate,
        isUpdateSuccess: false,
        isUpdateError: onUpdateError? true : false,
        updateError: onUpdateError,
        isReady: localAddressForm.isReady,
        submitUpdate: (localAddressForm.isReady)?
            (memberUID: string, onSuccess: (data: 
                {
                    region: unknown;
                    province: unknown;
                    cityOrMunicipality: unknown;
                    barangay: unknown;
                }) => void) => {
                setOnUpdate(true);
                doRequest({
                    url: `/update-member-data/address/${memberUID}`,
                    method: "PATCH",
                    data: {
                        label,
                        addressType: 'local',
                        address: localAddressForm.values
                    }
                })
                .then(response => {
                    if(response.success) {
                        onUpdateError && setOnUpdateError(null);
                        setOnUpdateSuccess(true);
                        localAddressForm.values && onSuccess({
                            region: localAddressForm.values.region,
                            province: localAddressForm.values.province,
                            cityOrMunicipality: localAddressForm.values.cityOrMunicipality,
                            barangay: localAddressForm.values.barangay
                        });
                        localAddressForm.clear();
                        setOnUpdate(false);
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

export default useUpdateLocalAddressInfo;