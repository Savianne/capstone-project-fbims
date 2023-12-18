export default function getCurrentTime() {
    const currentTime = new Date();

    // Get the current hours, minutes, and seconds
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const seconds = currentTime.getSeconds();

    // Format the time with leading zeros (e.g., '09:05:02')
    const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    return formattedTime;
}