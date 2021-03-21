/** @format */
// you can write to stdout for debugging purposes, e.g.
// console.log('this is a debug message');

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function leapYear(year) {
  return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
}

function getMonthDays(year, month) {
  switch (month) {
    case "January":
      return 31;
    case "February":
      return leapYear(year) ? 29 : 28;
    case "March":
      return 31;
    case "April":
      return 30;
    case "May":
      return 31;
    case "June":
      return 30;
    case "July":
      return 31;
    case "August":
      return 31;
    case "September":
      return 30;
    case "October":
      return 31;
    case "November":
      return 30;
    case "December":
      return 31;
  }
}

function getBeginDay(beginDay) {
  switch (beginDay) {
    case "Monday":
      return 1;
    case "Tuesday":
      return 7;
    case "Wednesday":
      return 6;
    case "Thursday":
      return 5;
    case "Friday":
      return 4;
    case "Saturday":
      return 3;
    case "Sunday":
      return 2;
  }
}

function getDays(year, beginMonth, endMonth) {
  const begin = months.indexOf(beginMonth);
  const end = months.indexOf(endMonth);

  let days = 0;

  for (let i = begin; i <= end; i++) {
    days += getMonthDays(year, months[i]);
  }

  return days;
}

function solution(Y, A, B, W) {
  // write your code in JavaScript (Node.js 8.9.4)

  const days = getDays(Y, A, B);

  const begin = getBeginDay(W);

  const total = days - begin;

  const weeks = Math.floor(total / 7);

  return weeks;
}

console.log(solution(2014, "April", "May", "Wednesday"));
//todo:y = year (num)
//todo:A = begin of month
//todo:B = end of month
//todo:W = day of week
