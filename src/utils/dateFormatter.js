export const dateFormatter = dateString => {
  const [datePart, timePart] = dateString.split('T');
  const [year, month, day] = datePart.split('-');
  const [hour, minute, second] = timePart.split(':');

  return `${hour}:${minute} ${day}.${month}.${year}`;
};
