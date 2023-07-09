var days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
var unit = "C";
var tempVar = "temp_c";
var feelVar = "feelslike_c";
var windVar = "wind_kph";
var windUnit = "Kmph";
var dailyForecastMax = "maxtemp_c";
var dailyForecastMin = "mintemp_c";
const hourlyArray = [];
const dailyContent = document.querySelector(".daily-content");
const hourlyContent = document.querySelector(".hourly-content");
const btnContainer = document.querySelector(".bottombtns");
const sliderbtnContainer = document.querySelector(".sliderbtnContainer");
const btns = document.querySelectorAll(".btn");
const bottom = document.querySelector(".bottom");
const desc = document.querySelector(".weather-desc");
const placeInfo = document.querySelector(".place-info");
const dateInfo = document.querySelector(".date-info");
const temp = document.querySelector(".temp");
const toggleButton = document.querySelector(".toggle-button");
const time = document.querySelector(".time");
const body = document.querySelector("body");
const search = document.querySelector(".search");
const feel = document.querySelector(".feel");
const humidity = document.querySelector(".Humidity");
const rain = document.querySelector(".rain");
const wind = document.querySelector(".wind");
const input = document.createElement("input");
input.classList.add("inputBar");
input.setAttribute("type", "text");
input.setAttribute("value", "Brampton");
search.appendChild(input);
const button = document.createElement("button");
button.classList.add("searchbutton");
button.setAttribute("type", "submit");
//button.innerHTML = "Search";
search.appendChild(button);
button.addEventListener("click", getData);
window.onload = getData;
const toggle = document.querySelector(".toggle");
toggle.classList.add("toggleButton");

function tConvert(time) {
  // Check correct time format and split into components
  time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [
    time,
  ];

  if (time.length > 1) {
    // If time format correct
    time = time.slice(1); // Remove full string match value
    time[5] = +time[0] < 12 ? "AM" : "PM"; // Set AM/PM
    time[0] = +time[0] % 12 || 12; // Adjust hours
  }
  return time.join(""); // return adjusted time or original string
}

const bottombuttons = (e) => {
  if (e.target == undefined) {
    e.target = e.childNodes[3];
  }
  btns.forEach((btn) => {
    btn.classList.remove("focused");
  });
  e.target.classList.add("focused");
  sliderbtnContainer.replaceChildren("");
  if (e.target.innerHTML == "Daily") {
    hourlyContent.classList.add("hide");
    dailyContent.classList.remove("hide");
    hourlyContent.replaceChildren("");
  } else {
    dailyContent.classList.add("hide");
    hourlyContent.classList.remove("hide");
    if (hourlyContent.childNodes.length < 2) {
      for (i = 0; i < 8; i++) {
        hourlyContent.appendChild(hourlyArray[i]);
      }
    }
    for (i = 0; i < 3; i++) {
      const sliderButton = document.createElement("button");
      sliderbtnContainer.appendChild(sliderButton);
      sliderButton.classList.add("dot");
      sliderButton.setAttribute("value", i);
      if (i == 0) {
        sliderButton.classList.add("selected");
      }
    }
    const dotButtons = document.querySelectorAll(".dot");
    dotButtons.forEach((dotButton) => {
      dotButton.addEventListener("click", (e) => {
        dotButtons.forEach((dotButton) => {
          dotButton.classList.remove("selected");
        });
        hourlyContent.replaceChildren("");
        e.target.classList.add("selected");
        if (e.target.value == 0) {
          for (i = 0; i < 8; i++) {
            hourlyContent.appendChild(hourlyArray[i]);
          }
        } else if (e.target.value == 1) {
          for (i = 8; i < 16; i++) {
            hourlyContent.appendChild(hourlyArray[i]);
          }
        } else {
          for (i = 16; i < 24; i++) {
            hourlyContent.appendChild(hourlyArray[i]);
          }
        }
      });
    });
  }
};

const unitSwitch = (e) => {
  if (e.target.innerHTML == "Celsius") {
    e.target.innerHTML = "Fahrenheit";
    unit = "F";
    tempVar = "temp_f";
    feelVar = "feelslike_f";
    windVar = "wind_mph";
    windUnit = "Mph";
    dailyForecastMax = "maxtemp_f";
    dailyForecastMin = "mintemp_f";
  } else {
    e.target.innerHTML = "Celsius";
    unit = "C";
    tempVar = "temp_c";
    feelVar = "feelslike_c";
    windVar = "wind_kph";
    windUnit = "Kmph";
    dailyForecastMax = "maxtemp_c";
    dailyForecastMin = "mintemp_c";
  }
  getData();
  if (sliderbtnContainer.childNodes.length > 1) {
    bottombuttons(btnContainer);
  }
};

toggle.addEventListener("click", unitSwitch);

async function getData() {
  const current = () => {
    time.replaceChildren("");
    dailyContent.replaceChildren("");
    hourlyContent.replaceChildren("");
    while (hourlyArray.length > 0) {
      hourlyArray.pop();
    }
    desc.innerHTML = forecastResult.current.condition.text;
    placeInfo.innerHTML = forecastResult.location.name;
    dateInfo.innerHTML = forecastResult.location.localtime;
    temp.innerHTML = `${forecastResult.current[tempVar]}° ${unit}`;
    const img = document.createElement("img");
    img.src = `http:${forecastResult.current.condition.icon}`;
    time.appendChild(img);
    feel.innerHTML = `${forecastResult.current[feelVar]}° ${unit}`;
    humidity.innerHTML = `${forecastResult.current.humidity} %`;
    rain.innerHTML = `${forecastResult.current.precip_mm} %`;
    wind.innerHTML = `${forecastResult.current[windVar]} ${windUnit}`;

    //function to display weekly forecast
    for (i = 1; i < 7; i++) {
      const div = document.createElement("div");
      const divOne = document.createElement("div");
      const divTwo = document.createElement("div");
      const divThree = document.createElement("div");
      const divFour = document.createElement("div");
      divOne.innerHTML =
        days[new Date(forecastResult.forecast.forecastday[i].date).getDay()];
      divOne.classList.add("divOne");
      divTwo.innerHTML = `${forecastResult.forecast.forecastday[i].day[dailyForecastMax]}° ${unit}`;
      divTwo.classList.add("divTwo");
      divThree.innerHTML = `${forecastResult.forecast.forecastday[i].day[dailyForecastMin]}° ${unit}`;
      const bottomImg = document.createElement("img");
      bottomImg.src = `http:${forecastResult.forecast.forecastday[i].day.condition.icon}`;
      divFour.appendChild(bottomImg);
      div.appendChild(divOne);
      div.appendChild(divTwo);
      div.appendChild(divThree);
      div.appendChild(divFour);
      dailyContent.appendChild(div);
    }

    //function to display hourly forecast
    for (i = 0; i < 24; i++) {
      var [date, timee] =
        forecastResult.forecast.forecastday[0].hour[i].time.split(" ");
      const div = document.createElement("div");
      const divOne = document.createElement("div");
      const divTwo = document.createElement("div");
      const divThree = document.createElement("div");
      divOne.innerHTML = tConvert(timee);
      divTwo.innerHTML = `${forecastResult.forecast.forecastday[0].hour[i][tempVar]}° ${unit}`;
      const hourlyImg = document.createElement("img");
      hourlyImg.src = `http:${forecastResult.forecast.forecastday[0].hour[i].condition.icon}`;
      divThree.appendChild(hourlyImg);
      div.appendChild(divOne);
      div.appendChild(divTwo);
      div.appendChild(divThree);
      div.classList.add("hourly-container");
      hourlyArray.push(div);
      if (i < 8) {
        hourlyContent.appendChild(div);
      }
    }
  };

  const eachHourTemp = () => {
    for (let i = 0; i < 24; i++) {
      console.log(`Hour= ${i}`);
      console.log(forecastResult.forecast.forecastday[0].hour[i].temp_c);
    }
  };
  const eachDay = () => {
    for (let i = 0; i < 8; i++) {
      console.log(`Day= ${i}`);
      console.log(forecastResult.forecast.forecastday[i].day.avgtemp_c);
    }
  };

  const forecast = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=34d2807485f14917a97231800232104&q=${input.value}&days=8`
  );
  const forecastResult = await forecast.json();
  console.log(forecastResult);

  current();
  eachHourTemp();
  eachDay();
}

btns.forEach((btn) => {
  btn.addEventListener("click", bottombuttons);
});
