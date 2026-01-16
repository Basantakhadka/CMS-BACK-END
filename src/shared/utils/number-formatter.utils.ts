export function convertNumberToDecimalPlace(value:number, decimalPlace:number) {
    const formattedValue = value.toFixed(decimalPlace);
    return parseFloat(formattedValue);
}

export function formatNumber(number: number, pattern) {
    const parts = pattern.split('.');
    const integerPattern = parts[0];
    const decimalPattern = parts[1] || '';

    const [integerPart, decimalPart] = number.toFixed(decimalPattern.length).split('.');

    let formattedNumber = '';

    let integerIndex = integerPart.length - 1;
    let patternIndex = integerPattern.length - 1;

    while (patternIndex >= 0) {
        const currentPatternChar = integerPattern[patternIndex];

        if (currentPatternChar === '#' || currentPatternChar === '0') {
            if (integerIndex >= 0) {
                formattedNumber = integerPart[integerIndex] + formattedNumber;
                integerIndex--;
            } else {
                formattedNumber = currentPatternChar + formattedNumber;
            }
        } else {
            formattedNumber = currentPatternChar + formattedNumber;
        }

        patternIndex--;
    }

    if (decimalPattern.length > 0) {
        formattedNumber += '.' + decimalPart;
    }

    const firstNumberIndex = formattedNumber.search(/\d/); // Find index of first number
    formattedNumber = formattedNumber.substring(firstNumberIndex); // Remove characters before the first number

    return formattedNumber;
}