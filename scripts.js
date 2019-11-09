const API_URL = 'https://apis.is/company?name=';

/**
 * Leit að fyrirtækjum á Íslandi gegnum apis.is
 */
const program = (() => {
  let companiesGlobal;
  let results;
  let errorMsgContainer;
  let loadingContainer;

  function removeErrorContainer() {
    if (errorMsgContainer != null) {
      errorMsgContainer.remove();
    }
  }

  function clearAllResults() {
    while (results.firstChild) {
      results.removeChild(results.firstChild);
    }
  }

  function removeLoadingContainer() {
    loadingContainer.remove();
  }

  function displayError(errorMsg) {
    errorMsgContainer = document.createElement('p');
    companiesGlobal.insertBefore(errorMsgContainer, results);
    errorMsgContainer.innerText = errorMsg;
  }

  function displayLoading() {
    loadingContainer = document.createElement('div');
    companiesGlobal.insertBefore(loadingContainer, results);
    loadingContainer.classList.add('loading');

    const loadingGif = document.createElement('img');
    loadingGif.src = 'loading.gif';
    loadingContainer.appendChild(loadingGif);

    const loadingMsg = document.createElement('p');
    loadingMsg.innerText = 'Leita að fyrirtækjum...';
    loadingContainer.appendChild(loadingMsg);
  }

  function displayCompany(listOfCompanies) {
    if (listOfCompanies.length === 0) {
      displayError('Ekkert fyrirtæki fannst fyrir leitarstreng');
      return;
    }
    for (let i = 0; i < listOfCompanies.length; i += 1) {
      const divElement = document.createElement('div');
      divElement.classList.add('company');

      const dlElement = document.createElement('dl');
      divElement.appendChild(dlElement);

      const nameLabelEl = document.createElement('dt');
      dlElement.appendChild(nameLabelEl);
      nameLabelEl.innerText = 'Lén';

      const companyNameEl = document.createElement('dd');
      dlElement.appendChild(companyNameEl);
      companyNameEl.innerText = listOfCompanies[i].name;

      const CompanySsnLabelEl = document.createElement('dt');
      dlElement.appendChild(CompanySsnLabelEl);
      CompanySsnLabelEl.innerText = 'Kennitala';

      const companySsnEl = document.createElement('dd');
      dlElement.appendChild(companySsnEl);
      companySsnEl.innerText = listOfCompanies[i].sn;

      if (listOfCompanies[i].active === 0) {
        divElement.classList.add('company--inactive');
      } else if (listOfCompanies[i].active === 1) {
        divElement.classList.add('company--active');

        const companyAddrLabelEl = document.createElement('dt');
        dlElement.appendChild(companyAddrLabelEl);
        companyAddrLabelEl.innerText = 'Heimilisfang';

        const companyAddressEl = document.createElement('dd');
        dlElement.appendChild(companyAddressEl);
        companyAddressEl.innerText = listOfCompanies[i].address;
      }
      results.appendChild(divElement);
    }
  }

  function fetchData(company) {
    fetch(`${API_URL}${company}`)
      .then((response) => {
        removeLoadingContainer();
        if (response.ok) {
          return response.json();
        }
        throw new Error('Villa');
      })
      .then((data) => {
        removeLoadingContainer();
        displayCompany(data.results);
      })
      .catch((error) => {
        removeLoadingContainer();
        displayError('Villa við að sækja gögn');
        /*  eslint no-console: ["error", { allow: ["warn", "error"] }] */
        console.error(error);
      });
  }

  function onSubmit(e) {
    e.preventDefault();
    removeErrorContainer();
    clearAllResults();

    const input = e.target.querySelector('input');
    if (input.value === '') {
      displayError('Lén verður að vera strengur');
    } else {
      displayLoading();
      fetchData(input.value);
    }
  }

  function init(companies) {
    companiesGlobal = companies;

    const form = companies.querySelector('form');
    form.addEventListener('submit', onSubmit);

    results = companies.querySelector('.results');
  }

  return {
    init,
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  const companies = document.querySelector('.companies');
  program.init(companies);
});
