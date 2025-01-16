import { html, render } from "lit-html";
window.addEventListener("keypress", hidenOption);
let hiden = [];
const addPlayer = document.querySelector(".add-name");
const closeModalForm = document.getElementById("cancel");
const setAdditionalValueBtn = document.getElementById("set-additional-value");
const addNewPlayer = document.getElementById("add-new-player");
addNewPlayer.addEventListener("click", addNew);
setAdditionalValueBtn.addEventListener("click", setAdditionalValue);
let test = JSON.parse(localStorage.getItem("data")) || [];
let givenCashBack = JSON.parse(localStorage.getItem("given")) || [];
const root = document.querySelector(".table-of-clients");
addPlayer.addEventListener("click", setModalForm);
closeModalForm.addEventListener(
  "click",
  () => (document.querySelector(".table-modal").style.display = "none")
);
function setModalForm(e) {
  document.querySelector(".table-modal").style.display = "block";
}
function tableClicks(e) {
  if (!e.target.tagName === "BUTTON") return;
  let id = e.target.parentNode.parentNode.id;
  if (e.target.classList.contains("add")) {
    setnewValue(id);
  } else if (e.target.classList.contains("delete")) {
    daleteCashback(id);
  }
}

function setForm() {
  console.log(test);
  let result = setFormTempalte(test);
  render(result, root);
}

const setFormTempalte = (arr) => html`
  <table @click=${tableClicks}>
    <caption>
      Daily Cashbacks
    </caption>
    <thead>
      <tr>
        <th>Име на клиент</th>
        <th>Cashback</th>
        <th>Деиствия</th>
      </tr>
    </thead>
    <tbody>
      ${arr.map((item, index) =>
        setTableRow(Object.keys(item)[0], Object.values(item), index)
      )}
    </tbody>
  </table>
`;

const setTableRow = (name, cashback, index) => html`
  <tr id=${index}>
    <td>${name}</td>
    <td>${cashback}</td>
    <td>
      <button class="actions add">Добави Cashack</button>
      <button class="actions delete">Дай $$$ Cashack</button>
    </td>
  </tr>
`;

function setnewValue(id) {
  let form = document.querySelector(".set-new-cashback");
  form.style.display = "block";
  let selectedPlayer = test[id];
  let playerName = document.getElementById("player-name");
  playerName.value = Object.keys(selectedPlayer)[0];
  setAdditionalValueBtn.dataset.id = id;
}
function setAdditionalValue(e) {
  e.preventDefault();
  let form = document.querySelector(".set-new-cashback");
  let additionalValue = Number(document.getElementById("new-value").value);
  let playerName = document.getElementById("player-name").value;
  let id = setAdditionalValueBtn.dataset.id;
  test[id][playerName] += additionalValue;
  localStorage.setItem("data", JSON.stringify(test));
  document.getElementById("new-value").value = "";
  document.getElementById("player-name").value = "";
  form.style.display = "none";
  setForm();
}
function daleteCashback(id) {
  let isTrue = confirm("Найстина ли искате да дадете cashback?");
  if (!isTrue) return;
  let curentTime = getCurrentDateTime();
  let giventCash =
    "Име " +
    Object.keys(test[id]) +
    " cashback " +
    Object.values(test[id]) +
    ` ${curentTime}`;

  givenCashBack.push(giventCash);
  localStorage.setItem("given", JSON.stringify(givenCashBack));
  test.splice(id, 1);
  localStorage.setItem("data", JSON.stringify(test));
  setForm();
}

function addNew(e) {
  e.preventDefault();
  let form = e.target.parentNode;
  let name = form.name.value;
  let surName = form[1].value;
  let lastName = form[2].value;
  let cashback = Number(form[3].value);
  let key = `${name} ${surName} ${lastName}`;
  test.push({ [key]: cashback });
  document.querySelector(".table-modal").style.display = "none";
  form[0].value = "";
  form[1].value = "";
  form[2].value = "";
  form[3].value = "";
  localStorage.setItem("data", JSON.stringify(test));
  setForm();
}

function getCurrentDateTime() {
  const now = new Date();

  // Extract day, month, year, hours, minutes, and seconds
  const day = String(now.getDate()).padStart(2, "0"); // Add leading zero if needed
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  // Format the date and time
  const formattedDateTime = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;

  return formattedDateTime;
}
function hidenOption(e) {
  hiden.push(e.key);
  if (hiden.slice(-3).join("") === "key") {
    console.log("inside hiden opiton");
    let target = document.getElementById("hiden");
    target.innerText = givenCashBack.join("\n");
  }
}
setForm();
