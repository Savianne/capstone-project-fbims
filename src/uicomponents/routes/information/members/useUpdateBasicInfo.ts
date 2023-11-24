import React from "react";
import * as Yup from 'yup';
import { debounce } from 'lodash';
import areObjectsMatching from "../../../../utils/helpers/areObjectMatching";
import doRequest from "../../../../API/doRequest";

interface IBasicData {
    gender: string,
    date_of_birth: string,
    marital_status: string,
    first_name: string,
    middle_name: string,
    surname: string,
    ext_name: null | string,
}

const validationSchema = Yup.object().shape({
    first_name: Yup.string().trim().required(),
    middle_name: Yup.string().trim().required(),
    surname: Yup.string().trim().required(),
    ext_name: Yup.string().nullable().notRequired(),
    dateOfBirth: Yup.date()
    .min(new Date('1903-01-01'), 'Date must be after or equal to 1903-01-01')
    .max(new Date(), 'Date must be before or equal to today'),
    gender: Yup.string().oneOf(["male", "female"]).required(),
    marital_status: Yup.string().oneOf([ "single", "married", "widowed", "divorced", "separated"]).required(),
});

function useUpdateBasicInfo() {
    const [baseData, setBaseData] = React.useState<IBasicData | null>(null);
    const [editFormData, setEditFormData] = React.useState<IBasicData | null>(null);
    const [errors, setErrors] = React.useState<{ [K in keyof IBasicData]?: string }>({});
    const [onUpdate, setOnUpdate] = React.useState(false);
    const [onUPdateSuccess, setOnUpdateSuccess] = React.useState(false);
    const [onUpdateError, setOnUpdateError] = React.useState<null | string>(null)

    React.useEffect(() => {
        editFormData && debounce(async () => {
            try {
                await validationSchema.validate(editFormData, { abortEarly: false });
                setErrors({});
            } catch (error: any) {
                if (error instanceof Yup.ValidationError) {
                    const validationErrors: { [K in keyof typeof editFormData]?: string } = {}; // Define the type of validationErrors
                    error.inner.forEach((err) => {
                        if (err.path) {
                            validationErrors[err.path as keyof typeof validationErrors] = err.message;
                        }
                    });
    
                    setErrors(validationErrors);
                }
            }
        }, 300)();
    }, [editFormData]);

    React.useEffect(() => {
        baseData && setEditFormData(baseData);
    }, [baseData]);

        return {
            setBaseData: (data: IBasicData) => setBaseData(data),
            input: editFormData? Object.keys(editFormData).reduce((acc, key) => {
                acc[key as keyof typeof editFormData] = (value: string) => {
                  setEditFormData({...editFormData, [key]: value})
                };
                return acc;
              }, {} as Record<keyof typeof editFormData, (value: string) => void>) : null,
            values: editFormData,
            errors,
            revertChange: baseData && editFormData? () => setEditFormData(baseData) : undefined,
            isModified: baseData && editFormData? !areObjectsMatching({...baseData, ext_name: baseData.ext_name == ""? null : baseData.ext_name}, {...editFormData, ext_name: editFormData.ext_name == ""? null : editFormData.ext_name}) : undefined,
            isUpdating: onUpdate,
            isUpdateSuccess: onUPdateSuccess,
            isUpdateError: onUpdateError? true : false,
            updateError: onUpdateError,
            submitUpdate: (baseData && editFormData && !areObjectsMatching(baseData, {...editFormData, ext_name: editFormData.ext_name == ""? null : editFormData.ext_name})) && (errors && Object.values(errors).length < 1)? 
                (memberUID: string, onSuccess?: () => void) => {
                    setOnUpdate(true);
                    doRequest({
                        url: `/update-member-data/basic-info/${memberUID}`,
                        method: "PATCH",
                        data: {
                            gender: editFormData.gender,
                            date_of_birth: editFormData.date_of_birth,
                            marital_status: editFormData.marital_status,
                            first_name: (editFormData.first_name as string).trim(),
                            middle_name: (editFormData.middle_name as string).trim(),
                            surname: (editFormData.surname as string).trim(),
                            ext_name: editFormData.ext_name,
                        }
                    })
                    .then(response => {
                        setOnUpdate(false);
                        if(response.success) {
                            onUpdateError && setOnUpdateError(null);
                            setBaseData(editFormData);
                            setOnUpdateSuccess(true);
                            onSuccess && onSuccess();
                        } else throw response.error;
                    })
                    .catch(err => {
                        setOnUpdate(false);
                        onUPdateSuccess && setOnUpdateSuccess(false);
                        setOnUpdateError(err);
                    })
                } 
            : null,
        }
}

export default useUpdateBasicInfo;