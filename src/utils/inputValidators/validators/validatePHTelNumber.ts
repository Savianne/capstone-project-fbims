import { TValidatorFunction } from "../../hooks/useFormControl";

const validatePHTelephone: TValidatorFunction = (param) => {
  const val = param as string;
  const cleanedTelephoneNumber = val.replace(/\D/g, "");
  const caption =
    "Telephone Number must be in a valid format e.g: XXXX-XXXX or (XX) XXXX-XXXX or (XXX) XXXX-XXXX";

  if (cleanedTelephoneNumber.length === 8) {
    return { caption, passed: true };
  }

  if (cleanedTelephoneNumber.length === 10 || cleanedTelephoneNumber.length === 11) {
    const areaCodeLength = cleanedTelephoneNumber.length === 10 ? 2 : 3;
    const areaCode = cleanedTelephoneNumber.substring(0, areaCodeLength);
    const localExchangeCode = cleanedTelephoneNumber.substring(areaCodeLength, areaCodeLength + 4);

    const isValidAreaCode = isValidPHAreaCode(areaCode);
    const isValidLocalExchangeCode = /^[0-9]{4}$/.test(localExchangeCode);

    const areaCodeCaption = isValidAreaCode ? "Invalid Area Code. " : "Invalid Area Code. ";
    const localExchangeCaption = isValidLocalExchangeCode ? "" : "Invalid Local Exchange Code. ";

    const isValid = isValidAreaCode && isValidLocalExchangeCode;
    return { caption: areaCodeCaption + localExchangeCaption, passed: isValid };
  }

  return { caption: caption, passed: false };
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

export default validatePHTelephone;
