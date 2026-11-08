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

const formHeading = document.getElementById('form-heading');
const submitButton = document.getElementById('submit-button');
const cancelEditButton = document.getElementById('cancel-edit-button');

const searchInput = document.getElementById('search-input');
const filterTypeSelect = document.getElementById('filter-type');
const filterCategorySelect = document.getElementById('filter-category');
const sortSelect = document.getElementById('sort-select');

const sortIconContainer = document.getElementById('sort-icon');
const sortTextElement = document.getElementById('sort-text');

const typeError = document.getElementById('type-error');
const categoryError = document.getElementById('category-error');

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
    const totalIncome = calculateTotal('income');
    const totalExpense = calculateTotal('expense');
    const balance = totalIncome - totalExpense;

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

function validateType(type) {
    if (type === "") {
        return "Please select a type.";
    }
    return "";
}

function validateCategory(category) {
    if (category === "") {
        return "Please select a category.";
    }
    return "";
}

function validateOnChange(input, errorElement, validate) {
    input.addEventListener('change', function() {
        showError(errorElement, input, validate(input.value));
    });
}

validateOnChange(typeInput, typeError, validateType);
validateOnChange(CatergoryInput, categoryError, validateCategory);

function showError(errorElement, inputElement, message) {
    errorElement.textContent = message;
    inputElement.classList.toggle("input-invalid", message !== "");
}

function validateForm() {
    const descriptionMessage = validateDescription(descriptionInput.value);
    const amountMessage = validateAmount(getAmountText());
    const typeMessage = validateType(typeInput.value);
    const categoryMessage = validateCategory(CatergoryInput.value);
    const dateMessage = validateDate(dateInput.value);

    showError(descriptionError, descriptionInput, descriptionMessage);
    showError(amountError, amountInput, amountMessage);
    showError(typeError, typeInput, typeMessage);
    showError(categoryError, CatergoryInput, categoryMessage);
    showError(dateError, dateInput, dateMessage);

    return (
        descriptionMessage === "" &&
        amountMessage === "" &&
        typeMessage === "" &&
        categoryMessage === "" &&
        dateMessage === ""
    );
}

function createTransaction() {
    return {
        id: Date.now(),
        description: descriptionInput.value.trim(),
        amount: Number(getAmountText()),
        type: typeInput.value,
        category: CatergoryInput.value,
        date: dateInput.value 
    };
}

function formatAmount(amount) {
    return amount.toLocaleString('en-US', { style: 'currency', currency: 'PHP' });
}

function formatDate(dateText) {
    const [year, month, day] = dateText.split('-');
    return `${month}/${day}/${year}`;
}

function createTransactionRow(transaction) {
    const row = document.createElement('tr');

    const sign = transaction.type === 'income' ? '+' : '-';
    const amountClass =
    transaction.type === 'income' ? 'amount-income' : 'amount-expense';

    row.innerHTML = `
        <td>${transaction.description}</td>
        <td>${transaction.category}</td>
        <td>${formatDate(transaction.date)}</td>
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

    const visibleTransactions = sortTransactions(
        getFilteredTransactions(),
        sortSelect.value
    );

    visibleTransactions.forEach(function (transaction) {
        transactionList.appendChild(createTransactionRow(transaction));
    });

    emptyMessage.hidden = visibleTransactions.length > 0;

    renderSummary();
}

function resetForm() {
    form.reset();
    setDefaultDate();
    refreshCustomSelects();
}

function setDefaultDate() {
    dateInput.value = new Date().toISOString().split('T')[0];
}

function handleFormSubmit(event) {
    event.preventDefault();

    if (!validateForm()) {
        return;
    }

    if (editingId === null) {
        transactions.push(createTransaction());
    } else {
        updateTransaction(editingId);
        exitEditMode();
    }

    renderTransactions();
    resetForm();
}


function deleteTransaction(id) {
    const confirmed = confirm('Delete this transaction?');
    if (!confirmed) {
        return;
    }
    
    transactions = transactions.filter(function(transaction) {
        return transaction.id !== id;
    });
    
    if (editingId === id) {
        exitEditMode();
    }
    
    renderTransactions();
}

function startEdit(id) {
    const transaction = transactions.find(function(item) {
        return item.id === id;
    });
    
    if (!transaction) {
        return;
    }
    
    editingId = id;
    
    descriptionInput.value = transaction.description;
    amountInput.value = transaction.amount;
    formatAmountInput();
    typeInput.value = transaction.type;
    CatergoryInput.value = transaction.category;
    dateInput.value = transaction.date;
    refreshCustomSelects();
    
    formHeading.textContent = 'Edit Transaction';
    submitButton.textContent = 'Save Changes';
    cancelEditButton.textContent = false;
    
    form.scrollIntoView();
}

function exitEditMode() {
    editingId = null;
    
    formHeading.textContent = 'Add Transaction';
    submitButton.textContent = 'Add Transaction';
    cancelEditButton.textContent = true;
    
    showError(descriptionError, descriptionInput,'');
    showError(amountError, amountInput, '');
    showError(dateError, dateInput, '');
    
    resetForm();
}

function updateTransaction(id) {
    const updated = createTransaction();
    updated.id = id;
    
    transactions = transactions.map(function(transaction) {
        return transaction.id === id ? updated : transaction;
    });
}

function handleTableClick(event) {
    const button = event.target.closest('button');
    if (!button) {
        return;
    }
    
    const id = Number(button.dataset.id);
    
    if (button.dataset.action === 'delete') {
        deleteTransaction(id);
    } else if (button.dataset.action === 'edit') {
        startEdit(id);
    }
}


function getFilteredTransactions() {
    const searchText = searchInput.value.trim().toLowerCase();
    const selectedType = filterTypeSelect.value;
    const selectedCategory =filterCategorySelect.value;
    
    return transactions.filter(function(transaction) {
        const matchesSearch = transaction.description
        .toLowerCase()
        .includes(searchText);
        
        const matchesType =
        selectedType === 'all' || transaction.type === selectedType;
        
        const matchesCategory =
        selectedCategory === 'all' || transaction.category === selectedCategory;
        
        return matchesSearch && matchesType && matchesCategory;
    });
}

function getAmountText() {
    return amountInput.value.replace(/,/g, '');
}

function formatAmountInput() {
    const rawValue = amountInput.value;
    const caretPosition = amountInput.selectionStart;
    
    const charBeforeCaret = rawValue
    .slice(0, caretPosition)
    .replace(/[^0-9.]/g, '').length;
    
    let cleaned = rawValue.replace(/[^0-9.]/g, '');
    
    const firstDot = cleaned.indexOf('.');
    if (firstDot !== -1) {
        cleaned =
        cleaned.slice(0, firstDot + 1) +
        cleaned.slice(firstDot + 1).replace(/\./g, '');
    }
    
    let [whole, decimal] = cleaned.split('.');
    
    whole = whole.replace(/^0+(?=\d)/, '');
    const wholeWithCommas = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    let formatted = wholeWithCommas;
    if (decimal !== undefined) {
        formatted += '.' + decimal.slice(0, 2);
    }
    
    amountInput.value = formatted;
    
    if (document.activeElement === amountInput) {
        let digitsSeen = 0;
        let newPosition = 0;
        while (newPosition < formatted.length && digitsSeen < charBeforeCaret) {
            if (formatted[newPosition] !== ',') {
                digitsSeen++;
            }
            newPosition++;
        }
        amountInput.setSelectionRange(newPosition, newPosition);
    }
}

function sortTransactions(list, sortBy) {
    return list.sort(function(a, b) {
        let result = 0;

        if (sortBy === 'newest') {
            result = b.date.localeCompare(a.date);
        } else if (sortBy === 'oldest') {
            result = a.date.localeCompare(b.date);
        } else if (sortBy === 'highest') {
            result = b.amount - a.amount;
        } else if (sortBy === 'lowest') {
            result = a.amount - b.amount;
        }
        
        if (result !== 0) {
            return result;
        }

        if (sortBy === 'oldest') {
            return a.id - b.id;
        }
        return b.id - a.id;
    });
}

function renderIcons() { 
    if (window.lucide) {
        lucide.createIcons();
    }
}

function updateSortDisplay() {
    sortIconContainer.innerHTML =
        `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            ${sortIcons[sortSelect.value]}
         </svg>`;
    sortTextElement.textContent =
        sortSelect.options[sortSelect.selectedIndex].text;
    renderIcons();
}

const sortIcons = {
    newest:  '<path d="m3 16 4 4 4-4"/><path d="M7 20V4"/><path d="M11 4h10"/><path d="M11 8h7"/><path d="M11 12h4"/>',
    oldest:  '<path d="m3 8 4-4 4 4"/><path d="M7 4v16"/><path d="M11 12h4"/><path d="M11 16h7"/><path d="M11 20h10"/>',
    highest: '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
    lowest:  '<polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/>'
};

const customSelects = [];

const optionIcons = {
    expense:   '<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M14 8H8"/><path d="M16 12H8"/><path d="M13 16H8"/>',
    income:    '<circle cx="12" cy="12" r="10"/><path d="m16 12-4-4-4 4"/><path d="M12 16V8"/>',
    Food:      '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>',
    Transport: '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>',
    Bills:     '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
    Shopping:  '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
    Salary:    '<rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
    Other:     '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>'
};

function createOptionIcon(value) {
    const shapes = optionIcons[value] || optionIcons.Other;
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${shapes}</svg>`; 
}

const checkIconMarkup = `<svg class="custom-select-check" viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="10" fill="currentColor"/>
    <path d="m8 12.5 3 3 5-6" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

function createCustomSelect(select) {
    const label = document.querySelector('label[for="${select.id}"]');
    const wrapper = document.createElement('div');
    wrapper.classList = 'custom-select';
    
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'custom-select-trigger';
    trigger.id = select.id + '-trigger';
    trigger.setAttribute('aria-haspopud', 'listbox');
    trigger.setAttribute('aria0-expanded', 'false');

    const triggerText = document.createElement('span');
    triggerText.className = 'custom-select-text';
    trigger.appendChild(triggerText);
    trigger.insertAdjacentHTML('beforeend',
        `<svg class="custom-select-chevron" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>`);

    const menu = document.createElement('div');
    menu.className = 'custom-select-menu';

    const list = document.createElement('ul');
    list.className = 'custom-select-list';
    list.id = select.id + '-list';
    list.setAttribute('role', 'listbox');
    list.setAttribute('aria-label', label ? label.textContent : select.name);
    trigger.setAttribute('aria-controls', list.id);

    Array.from(select.options).forEach(function(option) {
        if (option.disabled) {
            return;
        }
        const item = document.createElement('li');
        item.className = 'custom-select-option';
        item.setAttribute('role', 'option');
        item.tabIndex = -1;
        item.dataset.value = option.value;
        item.innerHTML =
            `<span class="custom-select-icon">${createOptionIcon(option.value)}</span>
             <span class="custom-select-label"></span>
             ${checkIconMarkup}`;
        item.querySelector('.custom-select-label').textContent = option.text;
        list.appendChild(item);
    });

    const items = Array.from(list.children);

    select.classList.add('custom-select-native');
    select.tabIndex = -1;
    select.setAttribute('aria-hidden', 'true');
    select.parentNode.insertBefore(wrapper, select);
    menu.appendChild(list);
    wrapper.append(select, trigger, menu);

    if (label) {
        label.htmlFor = trigger.id;
    }

    function refresh() {
        const selectedOption = select.options[select.selectedIndex];
        triggerText.textContent = selectedOption ? selectedOption.text : '';
        trigger.classList.toggle('is-placeholder', select.value ==='');

        items.forEach(function (item) {
            const isSelected = item.dataset.value === select.value;
            item.classList.toggle('is-selected', isSelected);
            item.setAttribute('aria-selected', String(isSelected) );
        });
    }

    function open() {
        wrapper.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
        const target = items.find(function (item) {
            return item.classList.contains('is-selected');
        }) || items[0];
        target.focus();
    }

    function close(returnFocus) {
        wrapper.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
        if (returnFocus) {
            trigger.focus();
        }
    }

    function choose(item) {
        select.value = item.dataset.value;

        select.dispatchEvent(new Event('change', {bubbles: true}));
        refresh();
        close();
    }

    trigger.addEventListener('click', function() {
        if (wrapper.classList.contains('is-open')) {
            close(false);
        } else {
            open();
        }
    });

    trigger.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            open();
        }
    });

    list.addEventListener('click', function(event) {
        const item = event.target.closest('.custom-select-option');
        if (item) {
            choose(item);
        }
    });

    list.addEventListener('keydown', function (event) {
        const currentIndex = items.indexOf(document.activeElement);

        if (event.key === 'ArrowDown') {
            event.preventDefault();
            items[Math.min(currentIndex + 1, items.length - 1)].focus();
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            items[Math.max(currentIndex - 1, 0)].focus();
        } else if (event.key === 'Home') {
            event.preventDefault();
            items[0].focus();
        }  else if (event.key === 'End') {
            event.preventDefault();
            items[items.length - 1].focus();
        } else if (event.key === 'Enter' || event. key === ' ') {
            event.preventDefault();
            if (currentIndex >= 0) {
                choose(items[currentIndex]);
            }
        } else if (event.key === 'Escape') {
            event.preventDefault();
            close(true);
        } else if (event.key === 'Tab') {
            event.preventDefault();
            close(false);
        }
    });

    document.addEventListener('click', function (event) {
        if (!wrapper.contains(event.target)) {
            close(false);
        }
    });

    refresh();
    return { refresh: refresh };
}

function refreshCustomSelects() {
    customSelects.forEach(function (customSelect) {
        customSelect.refresh();
    });
}

document.querySelectorAll('select[data-custom-select]').forEach(function (select) {
    customSelects.push(createCustomSelect(select));
});

form.addEventListener('submit', handleFormSubmit);
amountInput.addEventListener('input', formatAmountInput);
searchInput.addEventListener('input', renderTransactions);
filterTypeSelect.addEventListener('change', renderTransactions);
filterCategorySelect.addEventListener('change', renderTransactions);
sortSelect.addEventListener('change', renderTransactions);
transactionList.addEventListener('click', handleTableClick);
cancelEditButton.addEventListener('click', exitEditMode);
sortSelect.addEventListener('change', updateSortDisplay);
sortSelect.addEventListener('change', renderTransactions);

setDefaultDate();
updateSortDisplay();
renderIcons();
renderTransactions();