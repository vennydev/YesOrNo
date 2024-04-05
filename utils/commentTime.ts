export function commentTime(createTimestamp: number) {
  let remainingTime;
  const currentTime = Date.now();
  const oneHourMs = 60*60*1000;
  const oneDayMs = 24*60*60*1000;
  const diff = currentTime - createTimestamp;

  if(diff <  oneHourMs){
    remainingTime = Math.floor(diff / (60*1000));
    if(remainingTime === 0 ){
      return `지금`
    }
    return `${remainingTime}분 전`
  }else if(diff <  oneDayMs){
    remainingTime = Math.floor(diff / (60*60*1000));
    return `${remainingTime}시간 전`
  }else if(diff >  oneDayMs){
    const date = new Date(createTimestamp);
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDay();
    const addZeroOnDate = (number: number) => {
      if(number < 10){
        return `0${number}`
      }
      return number
    } 
    return `${String(y).slice(2)}.${addZeroOnDate(m)}.${addZeroOnDate(d)}`
  }
}