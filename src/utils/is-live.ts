export const fLive = (startDate: string, endDate: string) => {
 const currentDate = new Date().toISOString();

 if (startDate <= currentDate && endDate >= currentDate) {
  return 'Live';
 }

  if (startDate > currentDate) {
    return 'Upcoming';
  }

 return '';
};