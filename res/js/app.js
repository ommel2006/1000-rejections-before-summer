var rejections = JSON.parse(localStorage.getItem('rejections')) || [];
var currentPopUp = null;
var objective = JSON.parse(localStorage.getItem('objective')) || 1000;
var deadline = JSON.parse(localStorage.getItem('deadline')) || new Date(2026, 6, 1).toISOString().split('T')[0];

window.onload = () => {
    rejections = loadRejections();
    update();
}
function update() {
    displayRejections();
    displayDaysLeft();
    updateProgressBar();
    console.log(rejections);
}
function progress(){
    return rejections.filter(r => r.outcome === 'Rejected').length;
}

function loadRejections() {
    const saved = JSON.parse(localStorage.getItem('rejections')) || [];
    return saved.map(r => Object.assign(new Rejection(), r));
}

function saveRejections() {
    localStorage.setItem('rejections', JSON.stringify(rejections));
}

function addRejection(descriptionID, categoryID, outcomeID, dateID){
    if (emptyForm(descriptionID, categoryID, outcomeID, dateID)) {
        alert("Please fill out all fields.");
        return;
    }
    const description = document.getElementById(descriptionID).value;
    const category = document.getElementById(categoryID).value;
    const outcome = document.getElementById(outcomeID).value;
    const date = document.getElementById(dateID).value;
    const newRejection = new Rejection(description, category, outcome, date);
    rejections.push(newRejection);
    saveRejections();
    update();
}

function editRejection(id, description = null, category = null, outcome = null, date = null) {
    const rejection = rejections.find(r => r.id === id);
    if (rejection) {
        if (description !== null) rejection.editDescription(description);
        if (category !== null) rejection.editCategory(category);
        if (outcome !== null) rejection.editOutcome(outcome);
        if (date !== null) rejection.editDate(date);
        saveRejections();
        update();
    }
}

function deleteRejection(id) {
    if (!confirm("Are you sure you want to delete this rejection?")) {
        return;
    }
    const rejection = rejections.find(r => r.id === id);
    if (rejection) {
        rejections = rejections.filter(r => r.id !== id);
        saveRejections();
        update();
    }
}

function saveObjective() {
    localStorage.setItem('objective', JSON.stringify(objective));
}

function editObjective(newObjective) {
    objective = newObjective;
    saveObjective();
    updateProgressBar();
}

function saveDeadline() {
    localStorage.setItem('deadline', JSON.stringify(deadline));
}

function editDeadline(newDeadline) {
    deadline = newDeadline;
    saveDeadline();
    displayDaysLeft();
}

function showByID(id){
    if (currentPopUp != null) {
        hideByID(currentPopUp);
    }
    document.getElementById(id).style.display = "flex";
    currentPopUp = id;
}
function hideByID(id){
    document.getElementById(id).style.display = "none";
    currentPopUp = null;
}

function reset(){
    var inputs = document.querySelectorAll('input');
    for(let input of inputs){
       input.value = input.defaultValue;
    }

    var selects = document.querySelectorAll('select');
    for(let select of selects){
        for(let option of select.options){
            option.selected = option.defaultSelected;
        }
    }
}

function displayRejections(){
    const table = document.createElement("table");
    document.getElementById('rejectionTable').replaceWith(table);
    table.id = "rejectionTable";
    let header = table.insertRow();
    th = document.createElement('th');
    th.textContent = "Date";
    header.appendChild(th);
    th = document.createElement('th');
    th.textContent = "Description";
    header.appendChild(th);
    th = document.createElement('th');
    th.textContent = "Category";
    header.appendChild(th);
    th = document.createElement('th');
    th.textContent = "Outcome";
    header.appendChild(th);
    th = document.createElement('th');
    th.textContent = "Action";
    header.appendChild(th);

    for (let rejection of rejections){
        addRow(table, rejection);
    }
}

function addRow(table, rejection){
    let row = table.insertRow();
    row.className = "rejectionRow";
    row.id = rejection.id;
    row.insertCell().textContent = rejection.date;
    row.insertCell().textContent = rejection.description;
    row.insertCell().textContent = rejection.category;
    var outcome = document.createElement("SELECT");
    outcome.add(new Option("Rejected", "Rejected"));
    outcome.add(new Option("Accepted", "Accepted"));
    outcome.add(new Option("Pending", "Pending"));  
    for(let option of outcome.options){
        if (option.value == rejection.outcome){
            option.selected = true;
        }
    }
    outcome.onchange = function() {
        editRejection(Number(row.id), null, null, outcome.value);
    }
    row.insertCell().appendChild(outcome);
    var deleteButton = document.createElement("button");
    deleteButton.onclick = function() {
        deleteRejection(Number(row.id));
    }
        
    var editButton = document.createElement("button");
    editButton.onclick = function() {
        showByID('editRejection');
        fillOutEditForm(Number(row.id));
    }
    deleteButton.appendChild(createIcon("delete"));
    editButton.appendChild(createIcon("edit"));

    var actionCell = document.createElement("span");
    actionCell.className = "actionCell";
    actionCell.appendChild(editButton);
    actionCell.appendChild(deleteButton);
    row.insertCell().appendChild(actionCell);
}

function emptyForm(){
    for (const id of arguments) {
        if (document.getElementById(id).value == "") {
            return true;
        }
    }
    return false;
}

function daysBetween(startDate, endDate) {
    var millisecondsPerDay = 24 * 60 * 60 * 1000;
    return (endDate - startDate) / millisecondsPerDay;
}

function displayDaysLeft() {
    document.getElementById('daysLeft').textContent = Math.ceil(daysBetween(new Date(), new Date(deadline)));
}

function updateProgressBar() {
    document.getElementById('currProgress').textContent = progress();
    document.getElementById('currObjective').textContent = objective;
    document.getElementById('progressBar').style.width = (progress() / objective * 100) + '%';
    document.getElementById('rejectionGoal').defaultValue = objective;
    document.getElementById('deadline').defaultValue = deadline;
}

function createIcon(name){
    var icon = document.createElement("span");
    icon.className = "material-symbols-outlined";
    icon.textContent = name;
    return icon;
}
function fillOutEditForm(id){
    const rejection = rejections.find(r => r.id === id);
    document.getElementById('editID').value = rejection.id;
    document.getElementById('editDescription').defaultValue = rejection.description;
    document.getElementById('editCategory').defaultValue = rejection.category;
    document.getElementById('editOutcome').defaultValue = rejection.outcome;
    for(let option of document.getElementById('editOutcome').options){
        if (option.value == rejection.outcome){
            option.selected = true;
        }
    }
    document.getElementById('editDate').defaultValue = rejection.date;
}