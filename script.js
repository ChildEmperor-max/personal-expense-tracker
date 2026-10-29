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