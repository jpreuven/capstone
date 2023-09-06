function convertDate(date) {
  const inputDate = new Date(date);

  const day = inputDate.getDate().toString().padStart(2, "0");
  const month = (inputDate.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-based
  const year = inputDate.getFullYear().toString();
  return month + "/" + day + "/" + year;
}

export { convertDate };
