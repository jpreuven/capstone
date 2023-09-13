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
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function randomRGBs(number) {
  const backgroundList = [
    "rgba(255, 99, 132, 0.2)",
    "rgba(54, 162, 235, 0.2)",
    "rgba(255, 206, 86, 0.2)",
    "rgba(75, 192, 192, 0.2)",
    "rgba(153, 102, 255, 0.2)",
    "rgba(20, 152, 55, 0.2)",
    "rgba(255, 159, 64, 0.2)",
  ];
  const borderList = [
    "rgba(255, 99, 132, 1)",
    "rgba(54, 162, 235, 1)",
    "rgba(255, 206, 86, 1)",
    "rgba(75, 192, 192, 1)",
    "rgba(153, 102, 255, 1)",
    "rgba(20, 152, 55, 1)",
    "rgba(255, 159, 64, 1)",
  ];
  for (let i = 0; i < number - 7; i++) {
    const rgb1 = getRandomInt(255);
    const rgb2 = getRandomInt(255);
    const rgb3 = getRandomInt(255);
    const rgbBackground = `rgba(${rgb1}, ${rgb2}, ${rgb3}, 0.2)`;
    const rgbBorder = `rgba(${rgb1}, ${rgb2}, ${rgb3}, 1)`;

    backgroundList.push(rgbBackground);
    borderList.push(rgbBorder);
  }
  return [backgroundList, borderList];
}

export { convertDate };
export { convertPhoneNumber };
export { randomRGBs };
export { getRandomInt };
