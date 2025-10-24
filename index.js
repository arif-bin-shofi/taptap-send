

document.getElementById('year').textContent = new Date().getFullYear();

const fromBtn = document.getElementById('fromBtn');
const toBtn = document.getElementById('toBtn');
const fromList = document.getElementById('fromList');
const toList = document.getElementById('toList');
const fromLabel = document.getElementById('fromLabel');
const toLabel = document.getElementById('toLabel');
const amount = document.getElementById('amount');
const result = document.getElementById('result');
const rateText = document.getElementById('rate');
const fromCur = document.getElementById('fromCur');
const toCur = document.getElementById('toCur');
let fromCode = 'USD';
let toCode = 'BDT';

async function loadCurrencies() {
  const res = await fetch('currencies.json');
  const data = await res.json();

  data.forEach(item => {
    // From dropdown
    const liFrom = document.createElement('li');
    liFrom.className = 'p-2 flex items-center gap-2 cursor-pointer hover:bg-green-100 hover:text-green-900';
    liFrom.innerHTML = `
<img src="flags/${item.image}" class="w-5 h-5 rounded">
<span class="flex-1 text-black">${item.country} (${item.code})</span>
`;
    liFrom.onclick = () => {
      fromCode = item.code;
      fromLabel.innerHTML = `<img src="flags/${item.image}" class="w-5 h-5 rounded inline mr-2">${item.code}`;
      fromCur.textContent = item.code;
      fromList.classList.add('hidden');
      fetchRate();
    };
    fromList.appendChild(liFrom);

    // To dropdown
    const liTo = document.createElement('li');
    liTo.className = 'p-2 flex items-center gap-2 cursor-pointer hover:bg-green-100 hover:text-green-900';
    liTo.innerHTML = ` <img src="flags/${item.image}" class="w-5 h-5 rounded">
    <span class="flex-1 text-black">${item.country} (${item.code})</span>`;
    liTo.onclick = () => {
      toCode = item.code;
      toLabel.innerHTML = `<img src="flags/${item.image}" class="w-5 h-5 rounded inline mr-2">${item.code}`;
      toCur.textContent = item.code;
      toList.classList.add('hidden');
      fetchRate();
    };
    toList.appendChild(liTo);
  });


  // default
  fromLabel.innerHTML = `<img src="flags/en.png" class="w-5 h-5  rounded inline mr-2">USD`;
  toLabel.innerHTML = `<img src="flags/bn.png" class="w-5 h-5 rounded inline mr-2">BDT`;

  fetchRate();
}

fromBtn.addEventListener('click', () => fromList.classList.toggle('hidden'));
toBtn.addEventListener('click', () => toList.classList.toggle('hidden'));
amount.addEventListener('input', fetchRate);

let rateTodayText = 'Today rate: ';

async function fetchRate() {

  const amt = amount.value || 1;
  try {
    const res = await fetch(`https://v6.exchangerate-api.com/v6/125f6116312ef7661e6d95e6/latest/${fromCode}`);
    const data = await res.json();
    if (data.result === "success") {
      const rate = data.conversion_rates[toCode];

      // Result value
      result.value = (amt * rate).toFixed(2);

      // Bold Today rate text
      rateText.innerHTML = `<strong>${rateTodayText}</strong> 1 ${fromCode} = ${rate.toFixed(2)} ${toCode}`;
    } else {
      rateText.textContent = "Rate load failed: " + data["error-type"];
    }
  } catch (error) {
    rateText.textContent = "Fetch error";
  }
}


async function loadCountryList() {
  const res = await fetch('currencies.json');
  const data = await res.json();
  const countryList = document.getElementById('countryList');

  data.forEach(item => {
    const div = document.createElement('div');
    div.className = 'flex flex-col items-center text-center p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors';
    div.innerHTML = `
  <img src="flags/${item.image}" class="w-10 h-10 rounded-full mb-1" alt="${item.country}">
  <span class="text-sm text-white">${item.country}</span>
`;
    countryList.appendChild(div);
  });
}

loadCountryList();
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');

menuBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
});


loadCurrencies();
