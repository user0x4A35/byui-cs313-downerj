function toSentenceCase(text) {
    text = text.toString();
    let textNew = text.charAt(0).toUpperCase();
    for (let c = 1; c < text.length; c++) {
        textNew += text[c];
    }
    return textNew;
}

function isSet(val) {
    return (val !== undefined && val !== null);
}

function viewAssign(id) {
    let form = document.forms.namedItem(`form-${id}`);
    let data = new FormData(form);
    let dataObj = {};
    for (let datum of data) {
        let key = datum[0];
        let value = datum[1];
        dataObj[key] = value;
    }

    $.ajax({
        url: 'view-tasks.php',
        method: 'get',
        data: dataObj,
        statusCode: {
            200: function(data) {
                let obj = JSON.parse(data);
                let table = generateTaskTable(obj);
                initDialog(table);
                showDialog(`Tasks for Assignment #${id}`, table);
            },
            204: function() {
                initDialog();
                showDialog(`Tasks for Assignment #${id}`, 'No records found');
            },
            404: function() {
                console.log('Page not found');  
            },
            406: function() {
                initDialog();
                showDialog('Error', 'Invalid request');
            }
        }
    });
}

function updateTask(row, column, value, cell) {
    let label = cell.children[0];

    $.ajax({
        url: 'update-task.php',
        method: 'post',
        data: {
            'task-id': row,
            'column': column,
            'value': value
        },
        statusCode: {
            200: function(xhr) {
                console.log('Update success');
                console.log(xhr.responseText);
                label.innerText = (value) ? value : "null";
            },
            404: function() {
                console.log('Page not found');  
            },
            406: function(xhr) {
                console.log('Invalid request');
                console.log(xhr.responseText);
            },
            409: function(xhr) {
                console.log('Update conflict');
                console.log(xhr.responseText);
            }
        }
    });
}

function deleteTask(id, table, row) {
    let answer = confirm(`Are you sure you want to delete task #${id}?`);
    if (!answer) {
        return;
    }
    
    $.ajax({
        url: 'delete-task.php',
        method: 'post',
        data: {
            'task-id': id
        },
        statusCode: {
            200: function(xhr) {
                console.log('Update success');
                console.log(xhr.responseText);
                table.deleteRow(row);
            },
            404: function() {
                console.log('Page not found');
            },
            406: function(xhr) {
                console.log('Invalid request');
                console.log(xhr.responseText);
            },
            409: function(xhr) {
                console.log('Update conflict');
                console.log(xhr.responseText);
            }
        }
    });
}

function generateTaskTable(data) {
    let div = document.createElement('div');
    let caption = document.createElement('label');
    let br = document.createElement('br');
    let table = document.createElement('table');
    div.appendChild(caption);
    div.appendChild(br);
    div.appendChild(table);
    
    table.className = 'u-dialog-table';

    // create table header
    let theader = table.createTHead();
    let rowh = theader.insertRow();

    // insert a header for each column
    for (let key in data[0]) {
        let cell = document.createElement('th');
        cell.innerText = toSentenceCase(key);
        rowh.appendChild(cell);
    }

    // insert a blank header for the "delete" row
    let dellCellH = document.createElement('th');
    rowh.append(dellCellH);

    // create table body
    data.forEach((datum) => {
        let row = table.insertRow();
        let col = 0;
        let rowID = datum['id'];

        // add each field
        let rowCount = 0;
        for (let key in datum) {
            let value = datum[key];
            let cell = row.insertCell();
            let title = rowh.cells[col].innerText.toLowerCase();
            let label = document.createElement('label');
            if (title != 'id' && title != 'assignment') {
                $(label).dblclick(() => {
                    editCell(rowID, key, cell);
                });
            }
            if (!isSet(value)) {
                value = 'null';
            } else {
                value = ('' + value).trim();
            }
            label.innerText = (value) ? value : 'null';
            cell.appendChild(label);
            col++;
        }

        // add a delete button
        let delCell = row.insertCell();
        let btDel = document.createElement('div');
        btDel.className = 'u-button';
        btDel.innerText = 'Delete';
        $(btDel).click(() => {
            deleteTask(rowID, table, rowCount);
        });
        delCell.appendChild(btDel);

        rowCount++;
    });

    table.style.borderCollapse = 'collapse';

    return table;
}

function editCell(rowID, columnName, cell) {
    let text = cell.children[0].innerText;
    let input = document.createElement('input');
    if (!text || text.toLowerCase() == 'null') {
        text = '';
    } else {
        input.value = text;
    }
    cell.children[0].style.display = 'none';
    cell.appendChild(input);

    $(input).focus();
    $(input).blur(() => {
        updateCell(rowID, columnName, cell);
    });
}

function updateCell(rowID, columnName, cell) {
    let input = cell.children[1];
    let text = input.value.trim();
    cell.removeChild(input);
    let label = cell.children[0];
    label.style.display = 'initial';
    // label.innerText = (text) ? text : 'null';
    updateTask(rowID, columnName, text, cell);
}

function initDialog(table) {
    let $btDialogNew = $('.u-dialog-new');

    $btDialogNew.css('display', 'initial');
}