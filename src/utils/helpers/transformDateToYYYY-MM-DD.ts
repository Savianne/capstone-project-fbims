function transformDateToYYYYMMDD(dateString: string): string {
    const date = new Date(dateString);
  
    const paddedMonth = (date.getMonth() + 1) < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    const paddedDay = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  
    return `${date.getFullYear()}-${paddedMonth}-${paddedDay}`;
  }
  
  export default transformDateToYYYYMMDD;
  