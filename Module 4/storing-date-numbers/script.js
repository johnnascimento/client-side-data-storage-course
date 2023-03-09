window.onload = function () {
  // ----- Storing and Using Numbers -----
  // ----- Integer Numbers -----

  sessionStorage.setItem('int number', 25);

  var intNumber = parseInt(sessionStorage.getItem('int number'));
  console.log(intNumber + 15);

  // ----- Decimal Numbers -----
  sessionStorage.setItem('decimal number', 25.5555556);

  var decimalNumber = parseFloat(sessionStorage.getItem('decimal number'));
  console.log(decimalNumber + 5);

  // ----- Storing and Using Date Objects -----

  var now = new Date();

  sessionStorage.setItem('current date object', now.toUTCString());

  var currentDate = new Date(sessionStorage.getItem('current date object'));

  console.log(currentDate);

  currentDate.setTime(currentDate.getTime() + 24 * 60 * 60 * 1000);
  console.log(currentDate);
};