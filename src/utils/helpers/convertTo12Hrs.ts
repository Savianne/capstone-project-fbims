function convertTo12HourFormat(time24:string) {
    // Check if the input is a valid 24-hour time format
    const regex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
    if (!regex.test(time24)) {
        return "Invalid time format";
    }

    // Split the hours, minutes, and seconds
    const [hours, minutes, seconds] = time24.split(':');

    // Convert hours to 12-hour format
    let hours12 = parseInt(hours, 10);
    const ampm = hours12 >= 12 ? 'PM' : 'AM';

    // Handle midnight (12:00:00) and noon (12:00:00)
    hours12 = hours12 % 12 || 12;

    // Format the result with leading zeros
    const formattedHours = hours12.toString().padStart(2, '0');
    const formattedMinutes = minutes.padStart(2, '0');
    const formattedSeconds = seconds.padStart(2, '0');

    const time12 = `${formattedHours}:${formattedMinutes}:${formattedSeconds} ${ampm}`;

    return time12;
}

export default convertTo12HourFormat;