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