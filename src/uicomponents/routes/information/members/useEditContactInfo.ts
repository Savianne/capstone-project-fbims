import React from "react";
import doRequest from "../../../../API/doRequest";
import * as Yup from 'yup';
import { debounce } from 'lodash';
import areObjectsMatching from "../../../../utils/helpers/areObjectMatching";

const validatePHNumber: Yup.TestFunction<Yup.Maybe<string | undefined>, Yup.AnyObject> = function (
    value: Yup.Maybe<string | undefined>,
    context: Yup.TestContext<Yup.AnyObject>
  ) {
    const { path, createError } = context;
  
    // Your custom validation logic goes here
    if (!value) {
      return true; // Allow empty string or null
    }
  
    const cleanedPhoneNumber = value.replace(/-/g, "");
    const phoneNumberRegex = /^(09)\d{9}$/;

    const isValid = phoneNumberRegex.test(cleanedPhoneNumber);
    if (isValid) {
      return true;
    } else {
      return createError({ path, message: 'Validation failed.' });
    }
};

const isValidPHAreaCode = (areaCode: string): boolean => {
    const validAreaCodes = [
      "02", "032", "033", "034", "035", "036", "038", "042", "043", "044", 
      "045", "046", "047", "048", "049", "052", "053", "054", "055", "056", 
      "062", "063", "064", "072", "075", "076", "077", "078", "082", "083", 
      "084", "085", "086", "088", "089", "092", "094", "095", "096", "097", 
      "098", "099"
    ];
    return validAreaCodes.includes(areaCode);
};

const validatePHTelNumber: Yup.TestFunction<Yup.Maybe<string | undefined>, Yup.AnyObject> = function (
    value: Yup.Maybe<string | undefined>,
    context: Yup.TestContext<Yup.AnyObject>
) {
    const { path, createError } = context;

    // Your custom validation logic goes here
    if (!value) {
        return true; // Allow empty string or null
    }


    const cleanedTelephoneNumber = value.replace(/\D/g, "");
    const caption =
        "Telephone Number must be in a valid format e.g: XXXX-XXXX or (XX) XXXX-XXXX or (XXX) XXXX-XXXX";

    if (cleanedTelephoneNumber.length === 8) {
        return true;
    }

    if (cleanedTelephoneNumber.length === 10 || cleanedTelephoneNumber.length === 11) {
        const areaCodeLength = cleanedTelephoneNumber.length === 10 ? 2 : 3;
        const areaCode = cleanedTelephoneNumber.substring(0, areaCodeLength);
        const localExchangeCode = cleanedTelephoneNumber.substring(areaCodeLength, areaCodeLength + 4);

        const isValidAreaCode = isValidPHAreaCode(areaCode);
        const isValidLocalExchangeCode = /^[0-9]{4}$/.test(localExchangeCode);

        const isValid = isValidAreaCode && isValidLocalExchangeCode;
        if (isValid) {
            return true;
        } else {
            return createError({ path, message: isValidLocalExchangeCode? "Invalid Area Code. " : "Invalid Local Exchange Code. " });
        }
    }
};

interface IContactInfo {
    email: string | null,
    cpNumber: string | null,
    telephoneNumber: string | null,
}

const validationSchema = Yup.object().shape({
    email: Yup.string().nullable().notRequired().email('Invalid email'),
    cpNumber: Yup.string().nullable().notRequired().test('personalPHCPNumber', 'Invalid Philippine phone number', validatePHNumber),
    telephoneNumber: Yup.string().nullable().notRequired().test('personalPHTelNumber', 'Invalid Philippine Tel number', validatePHTelNumber),
});

function useUpdateContactInfo(label: 'personal' | 'home') {
    const [baseData, setBaseData] = React.useState<IContactInfo | null>(null);
    const [editData, setEditData] = React.useState<IContactInfo | null>(null);
    const [errors, setErrors] = React.useState<{ [K in keyof IContactInfo]?: string }>({});
    const [onUpdate, setOnUpdate] = React.useState(false);
    const [onUPdateSuccess, setOnUpdateSuccess] = React.useState(false);
    const [onUpdateError, setOnUpdateError] = React.useState<null | string>(null)

    React.useEffect(() => {
        baseData && setEditData(baseData);
    }, [baseData]);

    React.useEffect(() => {
        editData && debounce(async () => {
            try {
                await validationSchema.validate(editData, { abortEarly: false });
                setErrors({});
            } catch (error: any) {
                if (error instanceof Yup.ValidationError) {
                    const validationErrors: { [K in keyof typeof editData]?: string } = {}; // Define the type of validationErrors
                    error.inner.forEach((err) => {
                        if (err.path) {
                            validationErrors[err.path as keyof typeof validationErrors] = err.message;
                        }
                    });
    
                    setErrors(validationErrors);
                }
            }
        }, 300)();
    }, [editData]);

    return {
        setBaseData: (data: IContactInfo) => {
            setBaseData(data);
        },
        errors,
        input: editData? Object.keys(editData).reduce((acc, key) => {
            acc[key as keyof typeof editData] = (value: string) => {
              setEditData({...editData, [key]: value})
            };
            return acc;
          }, {} as Record<keyof typeof editData, (value: string) => void>) : null,
        values: editData,
        revertChange: baseData && editData? () => {
            setEditData(baseData);
            onUpdateError && setOnUpdateError(null)
         } : undefined,
        isModified: baseData && editData? !areObjectsMatching({
            email: baseData.email == ""? null : baseData.email,
            cpNumber: baseData.cpNumber == ""? null : baseData.cpNumber,
            telephoneNumber: baseData.telephoneNumber == ""? null : baseData.telephoneNumber
        }, {
            email: editData.email == ""? null : editData.email,
            cpNumber: editData.cpNumber == ""? null : editData.cpNumber,
            telephoneNumber: editData.telephoneNumber == ""? null : editData.telephoneNumber
        }) : undefined,
        isUpdating: onUpdate,
        isUpdateSuccess: onUPdateSuccess,
        isUpdateError: onUpdateError? true : false,
        updateError: onUpdateError,
        submitUpdate: (baseData && editData && !areObjectsMatching({
            email: baseData.email == ""? null : baseData.email,
            cpNumber: baseData.cpNumber == ""? null : baseData.cpNumber,
            telephoneNumber: baseData.telephoneNumber == ""? null : baseData.telephoneNumber
        }, {
            email: editData.email == ""? null : editData.email,
            cpNumber: editData.cpNumber == ""? null : editData.cpNumber,
            telephoneNumber: editData.telephoneNumber == ""? null : editData.telephoneNumber
        })) && (errors && Object.values(errors).length < 1)? 
        (memberUID: string, onSuccess?: () => void) => {
            setOnUpdate(true);
            doRequest({
                url: `/update-member-data/contact/${memberUID}`,
                method: "PATCH",
                data: {
                    label,
                    ...editData
                }
            })
            .then(response => {
                setOnUpdate(false);
                if(response.success) {
                    onUpdateError && setOnUpdateError(null);
                    setBaseData(editData);
                    setOnUpdateSuccess(true);
                    onSuccess && onSuccess();
                } else throw response.error;
            })
            .catch(err => {
                setOnUpdate(false);
                onUPdateSuccess && setOnUpdateSuccess(false);
                setOnUpdateError(err);
            })
        } : null
    }
}


export default useUpdateContactInfo;