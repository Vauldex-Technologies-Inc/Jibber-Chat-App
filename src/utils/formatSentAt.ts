import {useDateFormatter} from "@/composables/useDateFormatter"

export const formatSentAt = (date: string) => {
  const dateToFormat = new Date(date);
  const currentDate = new Date().getTime();
  const timeDiff = currentDate - dateToFormat.getTime();
  const minutesDiff = Math.floor(timeDiff / (1000 * 60));
  const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

  const dateFormatter = useDateFormatter()

  if (timeDiff < 0) {
    return "";
  }

  if (daysDiff === 0) {
    if(hoursDiff === 0) {
      if (minutesDiff === 0) {
        return "Just now";
      } else if (minutesDiff === 1) {
        return "1 min";
      } else {
        return `${minutesDiff} mins`;
      }
    } else {
      return `${hoursDiff} hours`;
    }
  } else {
    return dateFormatter.format(date,{
        day: 'numeric',
        weekday: 'long',
    });
  }


}