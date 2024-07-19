
// Add event listener to format loan amount input with commas
document.getElementById('loanAmount').addEventListener('input', function (e) {
    let value = e.target.value.replace(/\D/g, "");
    value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    e.target.value = value;
});

// Add event listener to handle form submission
document.getElementById('reviewForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const clientName = document.getElementById('clientName').value;
    const loanAmount = parseFloat(document.getElementById('loanAmount').value.replace(/,/g, '')); // Parse the number, removing commas
    const bank = document.getElementById('bank').value;
    const reviewDate = document.getElementById('reviewDate').value;
    const advisor = document.getElementById('advisor').value;
    const tagsInput = document.getElementById('tags').value;
    const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()) : []; // Split tags if any
    const tagColor = document.getElementById('tagColor').style.backgroundColor;
    const editIndex = document.getElementById('editIndex').value;

    if (editIndex === "") {
        addReview(clientName, loanAmount, bank, reviewDate, advisor, tags, tagColor);
    } else {
        updateReview(editIndex, clientName, loanAmount, bank, reviewDate, advisor, tags, tagColor);
    }

    document.getElementById('reviewForm').reset();
    document.getElementById('editIndex').value = "";
    updateTagColorInput('#e0e0e0'); // Reset tag color input background
});

// Function to open color picker
function openColorPicker() {
    const colorPicker = document.querySelector('input[type="color"]');
    colorPicker.click();
}

// Add event listener to update tag color preview
document.querySelector('input[type="color"]').addEventListener('input', function(e) {
    const tagColorBox = document.getElementById('tagColor');
    tagColorBox.style.backgroundColor = e.target.value;
});

// Function to add a new review row to the table
function addReview(clientName, loanAmount, bank, reviewDate, advisor, tags, tagColor) {
    const table = document.getElementById('reviewsTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();
    newRow.insertCell(0).textContent = clientName;
    newRow.insertCell(1).textContent = loanAmount.toLocaleString('en', { maximumFractionDigits: 2 }); // Format loan amount with commas
    newRow.insertCell(2).textContent = bank;
    newRow.insertCell(3).textContent = reviewDate;
    newRow.insertCell(4).textContent = advisor;

    const tagsCell = newRow.insertCell(5);
    if (tags.length > 0) {
        tags.forEach(tag => {
            const span = document.createElement('span');
            span.className = 'tag';
            span.textContent = tag;
            span.style.backgroundColor = tagColor;

            const editButton = document.createElement('span');
            editButton.className = 'edit-tag';
            editButton.textContent = '✎';
            editButton.onclick = () => editTag(span);
            
            const deleteButton = document.createElement('span');
            deleteButton.className = 'delete-tag';
            deleteButton.textContent = '✖';
            deleteButton.onclick = () => span.remove();

            span.appendChild(editButton);
            span.appendChild(deleteButton);
            tagsCell.appendChild(span);
        });
    } else {
        tagsCell.textContent = "No tags";
    }

    const actionsCell = newRow.insertCell(6);
    const editButton = document.createElement('span');
    editButton.className = 'edit';
    editButton.textContent = '✎ Edit';
    editButton.onclick = () => editReview(newRow);
    actionsCell.appendChild(editButton);

    const deleteButton = document.createElement('span');
    deleteButton.className = 'delete';
    deleteButton.textContent = '✖ Delete';
    deleteButton.onclick = () => newRow.remove();
    actionsCell.appendChild(deleteButton);
}

// Function to update an existing review row in the table
function updateReview(index, clientName, loanAmount, bank, reviewDate, advisor, tags, tagColor) {
    const table = document.getElementById('reviewsTable').getElementsByTagName('tbody')[0];
    const row = table.rows[index];
    row.cells[0].textContent = clientName;
    row.cells[1].textContent = loanAmount.toLocaleString('en', { maximumFractionDigits: 2 }); // Format loan amount with commas
    row.cells[2].textContent = bank;
    row.cells[3].textContent = reviewDate;
    row.cells[4].textContent = advisor;

    const tagsCell = row.cells[5];
    tagsCell.innerHTML = '';
    if (tags.length > 0) {
        tags.forEach(tag => {
            const span = document.createElement('span');
            span.className = 'tag';
            span.textContent = tag;
            span.style.backgroundColor = tagColor;

            const editButton = document.createElement('span');
            editButton.className = 'edit-tag';
            editButton.textContent = '✎';
            editButton.onclick = () => editTag(span);

            const deleteButton = document.createElement('span');
            deleteButton.className = 'delete-tag';
            deleteButton.textContent = '✖';
            deleteButton.onclick = () => span.remove();

            span.appendChild(editButton);
            span.appendChild(deleteButton);
            tagsCell.appendChild(span);
        });
    } else {
        tagsCell.textContent = "No tags";
    }
}

// Function to sort the table based on given criteria
function sortTable(criteria) {
    const table = document.getElementById('reviewsTable');
    const rows = Array.from(table.getElementsByTagName('tr')).slice(1);
    let compareFunction;

    switch (criteria) {
        case 'name':
            compareFunction = (rowA, rowB) => rowA.cells[0].textContent.localeCompare(rowB.cells[0].textContent);
            break;
        case 'amount':
            compareFunction = (rowA, rowB) => parseFloat(rowA.cells[1].textContent.replace(/,/g, '')) - parseFloat(rowB.cells[1].textContent.replace(/,/g, ''));
            break;
        case 'bank':
            compareFunction = (rowA, rowB) => rowA.cells[2].textContent.localeCompare(rowB.cells[2].textContent);
            break;
        case 'date':
            compareFunction = (rowA, rowB) => new Date(rowA.cells[3].textContent) - new Date(rowB.cells[3].textContent);
            break;
        case 'advisor':
            compareFunction = (rowA, rowB) => rowA.cells[4].textContent.localeCompare(rowB.cells[4].textContent);
            break;
    }

    rows.sort(compareFunction);

    const tbody = table.getElementsByTagName('tbody')[0];
    rows.forEach(row => tbody.appendChild(row));
}

// Function to edit a review row in the table
function editReview(row) {
    const cells = row.getElementsByTagName('td');
    document.getElementById('clientName').value = cells[0].textContent;
    document.getElementById('loanAmount').value = cells[1].textContent;
    document.getElementById('bank').value = cells[2].textContent;
    document.getElementById('reviewDate').value = cells[3].textContent;
    document.getElementById('advisor').value = cells[4].textContent;
    
    const tags = Array.from(cells[5].getElementsByClassName('tag')).map(span => span.textContent.replace('✎✖', '').trim());
    document.getElementById('tags').value = tags.join(', ');

    // Set the background color of the tag color input to the color of the first tag, if available
    const tagColor = tags.length > 0 ? cells[5].getElementsByClassName('tag')[0].style.backgroundColor : '#e0e0e0';
    updateTagColorInput(tagColor);

    document.getElementById('editIndex').value = row.rowIndex - 1;
}

// Function to update the tag color input background
function updateTagColorInput(color) {
    const tagColorBox = document.getElementById('tagColor');
    tagColorBox.style.backgroundColor = color;
    document.querySelector('input[type="color"]').value = color;
}

// Function to edit a tag in a review row
function editTag(span) {
    const newTag = prompt('Edit tag', span.firstChild.textContent.trim());
    if (newTag) {
        span.firstChild.textContent = newTag;
    }
}

// Function to export table data to Excel
function exportToExcel() {
    const table = document.getElementById('reviewsTable');
    const wb = XLSX.utils.table_to_book(table, { sheet: "Sheet1" });
    XLSX.writeFile(wb, "FixedRateReviews.xlsx");
}









