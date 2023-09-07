function convertDate(date) {
  const inputDate = new Date(date);

  const day = inputDate.getDate().toString().padStart(2, "0");
  const month = (inputDate.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-based
  const year = inputDate.getFullYear().toString();
  return month + "/" + day + "/" + year;
}

function convertPhoneNumber(number) {
  const string_number = number.toString();
  return `(${string_number.slice(0, 3)}) ${string_number.slice(
    3,
    6
  )}-${string_number.slice(6)}`;
}

export { convertDate };
export { convertPhoneNumber };
