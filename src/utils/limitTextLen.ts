
export function limitTextLen(text: string, min?: number, max?: number): {
    result: {
        validMin: boolean | null,
        validMax: boolean | null, 
    }
} {
    const isMinValid: boolean | null = min? text.length >= min : null;
    const isMaxValid: boolean | null = max? text.length <= max : null;
    return {
        result: {
            validMin: isMinValid,
            validMax: isMaxValid,
        }
    }
}

