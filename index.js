
let fetchedData = [];
const API_ENDPOINT = './data/frontend-assignment.json';
const ITEMS_PER_PAGE = 5;
let currentPage = 1;


function showNoRecordsMessage() {
    const tableBodyContainer = document.querySelector('#table-body');
    tableBodyContainer.innerHTML = '<tr><td colspan="3">No records available</td></tr>';
    const paginationContainer = document.querySelector('#pagination');
    paginationContainer.innerHTML = '';
}


function showErrorScreen(message = 'An error occurred while fetching the data. Please try again later.') {
    const tableBodyContainer = document.querySelector('#table-body');
    tableBodyContainer.innerHTML = `<tr><td colspan="3">${message}</td></tr>`;
    const paginationContainer = document.querySelector('#pagination');
    paginationContainer.innerHTML = '';
}


async function fetchDataFromAPI() {
    try {
        const response = await fetch(API_ENDPOINT);
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        fetchedData = await response.json();
        if (fetchedData.length === 0) {
            showNoRecordsMessage();
        } else {
            renderTableData(fetchedData);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        showErrorScreen();
    }
}
function createTableRow(item) {
    const amountPledged = item['amt.pledged'] ?? 0;
    const serialNumber = item['s.no'] ?? 0;
    const percentageFunded = item['percentage.funded'] ?? 0;

    const tableBodyContainer = document.querySelector('#table-body');
    const tr = document.createElement('tr');
    tr.innerHTML = `
    <td>
    ${serialNumber}
    </td>
    <td>
    ${percentageFunded}
    </td>
     <td>
    ${amountPledged}
    </rd>
    `
    tableBodyContainer.appendChild(tr);
}


function createPaginationButton(label, isDisabled = false, onClick = null) {
    const paginationContainer = document.querySelector('#pagination');
    const button = document.createElement('button');
    button.innerText = label;
    button.setAttribute('aria-label', `Go to page ${label}`);

    if (isDisabled) {
        button.disabled = true;
        button.classList.add('disabled');
        button.setAttribute('aria-disabled', 'true');
    } else if (onClick) {
        button.addEventListener('click', onClick);
    }

    paginationContainer.appendChild(button);

    return button;
}


function onPageChange(newPage) {
    currentPage = newPage;
    renderTableData(fetchedData);
    renderPagination(currentPage);
}


function renderPagination(currentPage = 1) {
    const totalRecords = fetchedData.length;
    const totalPages = Math.ceil(totalRecords / ITEMS_PER_PAGE);
    const paginationContainer = document.querySelector('#pagination');

    paginationContainer.innerHTML = '';


    createPaginationButton('<', currentPage === 1, () => onPageChange(currentPage - 1));

    const paginationButtons = [];

    paginationButtons.push(1);

    if (currentPage > 3) {
        paginationButtons.push('...');
    }

    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
        paginationButtons.push(i);
    }

    if (currentPage < totalPages - 2) {
        paginationButtons.push('...');
    }

    if (totalPages > 1) {
        paginationButtons.push(totalPages);
    }

    paginationButtons.forEach((item) => {
        const isActive = item === currentPage;
        const button = createPaginationButton(
            item,
            item === '...',
            item !== '...' ? () => onPageChange(item) : null,
            isActive
        )
        if (isActive) {
            button.classList.add('active');
        }
    });

    createPaginationButton('>', currentPage === totalPages, () => onPageChange(currentPage + 1));
}


function renderTableData(data) {
    let paginatedData = data.slice();
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
    paginatedData = paginatedData.slice(startIndex, endIndex);
    const tableBodyContainer = document.querySelector('#table-body');
    tableBodyContainer.innerHTML = ''
    paginatedData.map((item) => {
        createTableRow(item)
    })

    renderPagination(1)
}

function init() {
    fetchDataFromAPI();
}

init()