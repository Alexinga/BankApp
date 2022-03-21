'use strict';

const account1 = {
    owner: 'Alex Inga',
    pin: 1111,
    movements: [1300, -400, 2400, 600, -300, -200, 150,],
    interestRate: 0.5 // %
}

const account2 = {
    owner: 'Lance Nines',
    pin: 2222,
    movements: [1500, -800, 350, -400, 600, 150, -600],
    interestRate: 1.7 // %
}

const account3 = {
    owner: 'Maddy Smith',
    pin: 3333,
    movements: [300, 1200, -400, 450, -800, -200, 200],
    interestRate: 1.2
}

const account4 = {
    owner: 'John Doe',
    pin: 4444,
    movements: [500, 350, -250, 150, -300, -400, 860],
    interestRate: 0.8
}

const accounts = [account1,account2,account3,account4];

const transferBtn = document.querySelector('.transfer-btn');
const LoanBtn = document.querySelector('.loan-btn');
const closeBtn = document.querySelector('.close-btn');
const sortBtn = document.querySelector('.sortBtn');

const transferToInput = document.querySelector('#transferTo');
const transferAmountInput = document.querySelector('#transfer-amount');
const loanAmountInput = document.querySelector('#loanAmount');
const confirmUserInput = document.querySelector('#closeUser');
const confirmPinInput = document.querySelector('#closePin');

const loginUser = document.querySelector('#user');
const loginPin = document.querySelector('#pin');
const loginBtn = document.querySelector('#loginBtn');

const balanceNum = document.querySelector('.balance');
const withdrawal = document.querySelector('.withdrawal');
const deposit = document.querySelector('.deposit');
const interest = document.querySelector('.interest');

const movementContainer = document.querySelector('.movement-money');
const appContainer = document.querySelector('#bankApp');
let currentUser;

function userInitials(accs) {
    accs.forEach((acc) => {
        acc.userName = acc.owner
        .toLowerCase()
        .split(' ')
        .map(firstLetter => firstLetter[0])
        .join('');
    });
}
function calcPrintBalance(acc) {
    acc.balance = acc.movements.reduce((accu, mov) => accu + mov)
    balanceNum.textContent = `$ ${acc.balance} USD`;
}
function calcDisplaySummary(acc) {
    let depositIn = acc.movements.filter(mov => mov > 0).reduce((accu, mov) => accu + mov);
    let withdrawalOut = acc.movements.filter(mov => mov < 0).reduce((accu, mov) => accu + mov);
    let interestNum = acc.movements.filter(mov => mov > 0).map(depo => depo * acc.interestRate/100).filter(int => int >= 1).reduce((accu, int) => accu + int);
    deposit.textContent = `In: ${depositIn} USD`;
    withdrawal.textContent = `Out: ${withdrawalOut} USD`;
    interest.textContent = `Interest: ${Math.round(interestNum)} USD`;
}

function displayMovements(movements, sort = false) {
    movementContainer.innerHTML = '';
    const mov = sort ? movements.slice().sort((a,b) => a - b) : movements;
    mov.forEach((mov, i) => {
        const type = mov > 0 ? 'deposit' : 'withdrawal';
        let html = `
                <div class="money">
                    <div>
                        <div>${i + 1} ${type}</div>
                        <p>12/03/2021</p>
                    </div>
                    <div>${mov} USD</div>
                </div>
        `;
        movementContainer.insertAdjacentHTML('afterbegin', html);
    });
}

function displayUI(acc) {
    displayMovements(acc.movements);
    calcDisplaySummary(acc);
    calcPrintBalance(acc)
}
userInitials(accounts);

loginBtn.addEventListener('click', function(e) {
    e.preventDefault();
    currentUser = accounts.find(acc => acc.userName === loginUser.value);
    if(currentUser.pin === Number(loginPin.value)) {
        appContainer.style.opacity = 100;
        loginUser.value = '';
        loginPin.value = '';
        displayUI(currentUser);
    }
});

transferBtn.addEventListener('click', function(e) {
    e.preventDefault();
    const amount = Number(transferAmountInput.value);
    const receiverAccount = accounts.find(acc => acc.userName === transferToInput.value);
    transferAmountInput.value = '';
    transferToInput.value = '';
    if(amount > 0 && receiverAccount && currentUser.balance >= amount && receiverAccount.userName != currentUser.userName) {
        currentUser.movements.push(-amount);
        receiverAccount.movements.push(amount);
        displayUI(currentUser);
    }
});

LoanBtn.addEventListener('click', function(e) {
    e.preventDefault();
    const amount = Number(loanAmountInput.value);
    if(amount > 0 && currentUser.movements.some(mov => mov >= amount * 0.1)) {
        currentUser.movements.push(amount);
        displayUI(currentUser);
    }
    loanAmountInput.value = '';
});

closeBtn.addEventListener('click', function(e) {
    e.preventDefault();
    if(Number(confirmPinInput.value) === currentUser.pin && confirmUserInput.value === currentUser.userName) {
        const index = accounts.findIndex(acc => acc.userName === currentUser.userName);
        accounts.splice(index, 1);
        appContainer.style.opacity = 0;
    }
    confirmPinInput.value = '';
    confirmUserInput.value = '';
});

let sorted = false;
sortBtn.addEventListener('click', function(e) {
    e.preventDefault();
    displayMovements(currentUser.movements, !sorted);
    sorted = !sorted;
})
