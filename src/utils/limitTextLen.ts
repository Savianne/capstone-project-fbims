
export function limitTextLen(text: string, min: number, max: number): {
    result: {
        validMin: boolean,
        validMax: boolean,
        valid: boolean
    }
} {
    const isMinValid: boolean = text.length >= min;
    const isMaxValid: boolean = text.length <= min;
    return {
        result: {
            validMin: isMinValid,
            validMax: isMaxValid,
            valid: isMinValid && isMaxValid
        }
    }
}

