import React from "react";
import * as Yup from 'yup';
import { debounce } from 'lodash';

interface IBasicInfo {
    gender: string,
    date_of_birth: string,
    marital_status: string,
    first_name: string,
    middle_name: string,
    surname: string,
    ext_name: null | string,
}

const validationSchema = Yup.object().shape({
    first_name: Yup.string().required(),
    middle_name: Yup.string().required(),
    surname: Yup.string().required(),
    ext_name: Yup.string().nullable().notRequired(),
    dateOfBirth: Yup.date()
    .min(new Date('1903-01-01'), 'Date must be after or equal to 1903-01-01')
    .max(new Date(), 'Date must be before or equal to today'),
    gender: Yup.string().oneOf(["male", "female"]).required(),
    marital_status: Yup.string().oneOf([ "single", "married", "widowed", "divorced", "separated"]).required(),
});

function useUpdateBasicInfo(data: IBasicInfo): {
    input: {
        [K in keyof IBasicInfo]: (i: string) => void
    },
    errors: {
        [K in keyof IBasicInfo]?: string
    },
    revertChange: () => void,
    isModified: boolean;
    dubmitable: boolean,
    isUpdating: boolean,
    isUpdateSuccess: boolean,
    isUpdateError: boolean
} {
    const [baseData, setBaseData] = React.useState({...data});
    const [editFormData, setEditFormData] = React.useState({...baseData});
    const [errors, setErrors] = React.useState<{ [K in keyof typeof editFormData]?: string }>({});

    const validateForm = debounce(async () => {
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
    }, 300);


    React.useEffect(() => {
        validateForm();
    }, [editFormData]);

    const input = Object.keys(data).reduce((acc, key) => {
        acc[key as keyof IBasicInfo] = (value: string) => {
          setEditFormData((prevData) => ({
            ...prevData,
            [key]: value,
          }));
        };
        return acc;
      }, {} as Record<keyof IBasicInfo, (value: string) => void>);

    return {
        input,
        errors,
        revertChange: () => alert("revert"),
        isModified,
        dubmitable: false,
        isUpdating: false,
        isUpdateSuccess: false,
        isUpdateError: false
    }
}

export default useUpdateBasicInfo;