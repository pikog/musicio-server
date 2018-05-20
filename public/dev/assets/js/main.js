// Toggle room choice
const radio = document.querySelectorAll(".joinForm [type='radio']")
const auto = document.querySelector(".joinForm #auto")
const optional = document.querySelector(".joinForm .optional")
if (radio && auto && optional) {
  const checkSignup = () => {
    auto.checked ? optional.classList.remove("active") : optional.classList.add("active")
  }
  for (let i = 0; i < radio.length; i++) {
    radio[i].addEventListener("change", checkSignup)
  }
  checkSignup()
}

const game = new MusicIO(".musicIOApp")
