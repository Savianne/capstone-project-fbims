export function validateEmail(inputText: string): {isValidEmail: boolean} {
    let mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if(inputText.match(mailformat)) {
        return {
            isValidEmail: true,
        };
    } else {
        return {
            isValidEmail: false,
        };
    }
}

