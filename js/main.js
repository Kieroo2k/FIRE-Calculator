const lightBtn = document.querySelector('#light');
const darkBtn = document.querySelector('#dark');
body = document.querySelector('#body');

const startingAmount = document.querySelector('#starting_amount');
const annualContributions = document.querySelector('#annual_contributions');
const startingDividendYield = document.querySelector('#starting_dividend_yield');
const rateOfReturnShares = document.querySelector('#rate_of_return_shares');
const annualDidivendGrowth = document.querySelector('#annual_dividend_growth');
const tax = document.querySelector('#tax');
const taxInclude = document.querySelector('#tax_include');
const dividendsReinvest = document.querySelector('#dividends_reinvest');
const investmentTime = document.querySelector('#investment_time');
const annualInflation = document.querySelector('#annual_inflation');

clearBtn = document.querySelector('#clear');
calculateBtn = document.querySelector('#calculate');

const tableSection = document.querySelector('#output_data');
const table = document.querySelector('#responsive_table');
const tBody = table.querySelector('#t_body');

const columnNumber = table.querySelectorAll('th').length;
let yearNumber = 0, newStartingAmount = 0, newStartingDividendYield = 0, newRateOfReturnShares = 0, newAnnualDidivendGrowth = 0, rateOfReturnSharesSum = 0, cumulativeInflation = 0;
let firstYear = true;


const percentInputArrays = document.querySelectorAll('input[max="100"]');
percentInputArrays.forEach(input => {
    input.addEventListener('blur', function() {
        const min = parseInt(this.min);
        const max = parseInt(this.max);
        if (this.value > max) {
            this.value = max;
        }else if(this.value < min){
            this.value = min;
        }
        if (this.value !== '') {
            this.value = parseFloat(this.value).toFixed(2);
        }
    });
});

investmentTime.addEventListener('blur', function() {
    const min = parseInt(this.min);
    const max = parseInt(this.max);
    if (this.value > max) {
        this.value = max;
    }else if(this.value < min){
        this.value = min;
    }
    if (this.value !== '') {
        this.value = parseFloat(this.value).toFixed(0);
    }
});

const changeStyleToLight = () => {
	if (body.getAttribute('data-mode') === 'dark') {
		body.setAttribute('data-mode', 'light')
	}
}
const changeStyleToDark = () => {
	if (body.getAttribute('data-mode') === 'light') {
		body.setAttribute('data-mode', 'dark')
	}
}

function formatNumber(num) {
    return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

const createTableRows = () => {
    for(let i = 0; i<investmentTime.value;i++){
        const tr = document.createElement('tr');
        tBody.appendChild(tr);
        yearNumber++;
        for(let j=0; j<columnNumber; j++){
            const td = document.createElement('td');
            tr.appendChild(td);
            // rok
            if(j == 0){
                td.textContent = yearNumber;
            // Wartość portfela na początku roku
            }else if (j==1){
                if(firstYear == true){
                    td.textContent = parseFloat(startingAmount.value).toFixed(2);
                }else{
                    td.textContent = parseFloat(newStartingAmount).toFixed(2);
                }
                td.classList.add('amount');
                newStartingAmount = td.textContent;
            // Roczne dywidendy brutto
            }else if (j==2){
                if(firstYear == true){
                    td.textContent = parseFloat(newStartingAmount * startingDividendYield.value / 100).toFixed(2);
                }else{
                    td.textContent = parseFloat((parseFloat(newStartingDividendYield) + (newStartingDividendYield * annualDidivendGrowth.value / 100)) + (newAnnualDidivendGrowth * startingDividendYield.value / 100) + (annualContributions.value * startingDividendYield.value / 100)).toFixed(2);
                }
                td.classList.add('amount');
                newStartingDividendYield = td.textContent;
            // Stopa dywidendy
            }else if (j==3){
                td.classList.add('percentage');
                td.textContent = parseFloat(newStartingDividendYield / newStartingAmount * 100).toFixed(2);
            // Wzrots kursu akcji
            }else if (j==4){
                td.textContent = parseFloat(newStartingAmount * rateOfReturnShares.value / 100).toFixed(2);
                td.classList.add('amount');
                newRateOfReturnShares = td.textContent;
            // Roczne dywidendy netto
            }else if (j==5){
                if(taxInclude.checked){
                    td.textContent = parseFloat(newStartingDividendYield * (100-tax.value) / 100).toFixed(2);
                }else{
                    td.textContent = parseFloat(newStartingDividendYield).toFixed(2);
                }
                td.classList.add('amount');
                newAnnualDidivendGrowth = td.textContent;
            // Wartość portfela na koniec roku
            }else if (j==6){
                if(dividendsReinvest.checked){
                    td.textContent = parseFloat(parseFloat(newStartingAmount) + parseFloat(annualContributions.value) + parseFloat(newAnnualDidivendGrowth) + parseFloat(newRateOfReturnShares)).toFixed(2);
                }else{
                    td.textContent = parseFloat(parseFloat(newStartingAmount) + parseFloat(annualContributions.value) + parseFloat(newRateOfReturnShares)).toFixed(2);
                }
                td.classList.add('amount');
                newStartingAmount = td.textContent;
            // Skumulowane wpłaty do portfela
            }else if (j==7){
                td.textContent = parseFloat((yearNumber * parseFloat(annualContributions.value)) + parseFloat(startingAmount.value)).toFixed(2);
                td.classList.add('amount');
            // Skumulowany wzrost kursu akcji
            }else if (j==8){
                td.textContent = parseFloat(newRateOfReturnShares).toFixed(2);
                td.classList.add('amount');
            // Skumulowane wypłaty dywidend
            }else if (j==9){
                td.textContent = parseFloat(newAnnualDidivendGrowth).toFixed(2);
                td.classList.add('amount');
            // Skumulowana inflacja
            }else if (j==10){
                td.textContent = parseFloat((Math.pow((parseFloat(annualInflation.value / 100)+1),yearNumber)-1) * 100).toFixed(2);
                td.classList.add('percentage');
                cumulativeInflation = td.textContent;
            // Wartość portfela po uwzględnieniu inflacji
            }else if (j==11){
                td.textContent = parseFloat(parseFloat(newStartingAmount) * (100 - parseFloat(cumulativeInflation)) / 100).toFixed(2);
                td.classList.add('amount');
                firstYear = false;
            }
        }
    }
}

clearBtn.addEventListener('click', e => {
	e.preventDefault();
    [startingAmount, annualContributions, startingDividendYield, rateOfReturnShares, annualDidivendGrowth, tax, investmentTime, annualInflation].forEach(e => {
		e.value = ''
	});
    tBody.innerHTML = '';
    yearNumber = 0; newStartingAmount = 0;
    newStartingDividendYield = 0;
    newRateOfReturnShares = 0;
    newAnnualDidivendGrowth = 0;
    rateOfReturnSharesSum = 0;
    cumulativeInflation = 0;
    firstYear = true;
})

calculateBtn.addEventListener('click', e => {
    e.preventDefault();
    tBody.innerHTML = '';
    yearNumber = 0; newStartingAmount = 0;
    newStartingDividendYield = 0;
    newRateOfReturnShares = 0;
    newAnnualDidivendGrowth = 0;
    rateOfReturnSharesSum = 0;
    cumulativeInflation = 0;
    firstYear = true;
    createTableRows();
    tableSection.scrollIntoView({ behavior: 'smooth' });
})

lightBtn.addEventListener('click', changeStyleToLight);
darkBtn.addEventListener('click', changeStyleToDark);

