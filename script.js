let transactions = [];
let editingId = null;

const totalIncomeElement = document.getElementById('total-income');
const totalExpenseElement = document.getElementById('total-expenses');
const balanceElement = document.getElementById('balance');

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
const emptyMessage = document.getElementById('empty-message');

function calculateTotal(type) {
    return transactions
        .filter(function (transaction) {
            return transaction.type === type;
        })
        .reduce (function (sum, transaction) {
            return sum + transaction.amount;
        }, 0);
}

function renderSummary() {
    console.log("Rendering summary, transactions:", transactions.length);
    const totalIncome = calculateTotal('income');
    const totalExpense = calculateTotal('expense');
    const balance = totalIncome - totalExpense;
    console.log("Summary rendered: Income:", totalIncome, "Expense:", totalExpense, "Balance:", balance);

    totalIncomeElement.textContent = formatAmount(totalIncome);
    totalExpenseElement.textContent = formatAmount(totalExpense);
    balanceElement.textContent = formatAmount(balance);
}

function validateDescription(description) {
    if (description.trim() === "") {
        return "Please enter a description.";
    }
    return "";
}

function validateAmount(amountText) {
    const amount = Number(amountText);

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
    return "";
}

function showError(errorElement, inputElement, message) {
    errorElement.textContent = message;
    inputElement.classList.toggle("input-invalid", message !== "");
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
    return amount.toLocaleString('en-US', { style: 'currency', currency: 'PHP' });
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
        <td>
            <button type="button" class="btn-secondary" data-action="edit" data-id="${transaction.id}">Edit</button>
            <button type="button" class="btn-danger" data-action="delete" data-id="${transaction.id}">delete</button>
        </td>
    `;
    return row;
}

function renderTransactions() {
    transactionList.innerHTML = "";

    transactions.forEach(function (transaction) {
        transactionList.appendChild(createTransactionRow(transaction));
    });

    emptyMessage.hidden = transactions.length > 0;

    renderSummary();
}

function resetForm() {
    form.reset();
    setDefaultDate();
}

function setDefaultDate() {
    dateInput.value = new Date().toISOString().split('T')[0];
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

const formHeading = document.getElementById('form-heading');
const submitButton = document.getElementById('submit-button');
const cancelButton = document.getElementById('cancel-edit-button');