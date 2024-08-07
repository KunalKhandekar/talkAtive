import moment from "moment";

export const formatDate = (date) => {
  const formattedTime = moment(date).fromNow(true);
  const conciseTime = formattedTime
    .replace(" minutes", "m")
    .replace(" minute", "m")
    .replace(" hours", "h")
    .replace("an hour", "1h")
    .replace(" hour", "h")
    .replace(" days", "d")
    .replace(" day", "d")
    .replace(" seconds", "s")
    .replace(" second", "s");

  return `${conciseTime} ago`;
};
