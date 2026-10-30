let transactions = [];

const form = document.getElementById('transaction-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const typeInput = document.getElementById('type');
const CatergoryInput = document.getElementById('category');
const dateInput = document.getElementById('date');

const descriptionError = document.getElementById('description-error');
const amountError = document.getElementById('amount-error');
const dateError = document.getElementById('date-error');

const transactionList = document.getElementById('transaction-list');
const emtyMessage = document.getElementById('empty-message');

function validateDescription(description) {
    if (description.trim() === "") {
        return "Please enter a description.";
    }
    return "";
}

function validateAmount(amountText) {
    const amount = number(amountText);

    if (amountText.trim() === "" || Number.isNaN(amount)) {
        return "Please enter a valid amount.";
    }
    if (amount <= 0) {
        return "Amount must be greater than zero.";
    }
    return "";
}

function validateDate(date) {
    if (date === "") {
        return "Please choose a date.";
    }
}

function shoowError(errorElement, inputElement, message) {
    errorElement.textContent = message;
    inputElement.classlist.toggle("input-invalid", message !== "");
}

function validateForm() {
    const descriptionMessage = validateDescription(descriptionInput.value);
    const amountMessage = validateAmount(amountInput.value);
    const dateMessage = validateDate(dateInput.value);

    showError(descriptionError, descriptionInput, descriptionMessage);
    showError(amountError, amountInput, amountMessage);
    showError(dateError, dateInput, dateMessage);

    return descriptionMessage === "" && amountMessage === "" && dateMessage === "";
}

function createTransaction() {
    return {
        id: Date.now(),
        description: descriptionInput.value.trim(),
        amount: Number(amountInput.value),
        type: typeInput.value,
        category: CatergoryInput.value,
        date: dateInput.value 
    };
}

function formatAmount(amount) {
    return amount.toFixed(2);
}

function createTransactionRow(transaction) {
    const row = document.createElement('tr');

    const sign = transaction.type === 'income' ? '+' : '-';
    const amountClass =
    transaction.type === 'income' ? 'amount-income' : 'amount-expense';

    row.innerHTML = `
        <td>${transaction.description}</td>
        <td>${transaction.category}</td>
        <td>${transaction.date}</td>
        <td>${transaction.type}</td>
        <td class="${amountClass}">${sign}${formatAmount(transaction.amount)}</td>
    `;
    return row;
}

function renderTransactions() {
    transactionList.innerHTML = "";

    transactions.forEach(function (transaction) {
        transactionList.appendChild(createTransactionRow(transaction));
    });

    emptyMessage.hidden = transactions.length > 0;
}

function resetForm() {
    form.reset();
    setDefaultDate();
}

function handleFormSubmit(event) {
    event.preventDefault();

    if (!validateForm()) {
        return;
    }

    transactions.push(createTransaction());
    renderTransactions();
    resetForm();
}

form.addEventListener('submit', handleFormSubmit);
setDefaultDate();
renderTransactions();