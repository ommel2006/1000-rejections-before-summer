var rejections = JSON.parse(localStorage.getItem('rejections')) || [];
var currentPopUp = null;
var objective = JSON.parse(localStorage.getItem('objective')) || 1000;
var progress = rejections.filter(r => r.outcome === 'Rejected').length;
var deadline = JSON.parse(localStorage.getItem('deadline')) || new Date(2026, 6, 1).toISOString().split('T')[0];

window.onload = () => {
    displayRejections();
    rejections = loadRejections();
}

function loadRejections() {
    const saved = JSON.parse(localStorage.getItem('rejections')) || [];
    return saved.map(r => Object.assign(new Rejection(), r));
}

function saveRejections() {
    localStorage.setItem('rejections', JSON.stringify(rejections));
}

function addRejection(descriptionID, categoryID, outcomeID, dateID){
    const description = document.getElementById(descriptionID).value;
    const category = document.getElementById(categoryID).value;
    const outcome = document.getElementById(outcomeID).value;
    const date = document.getElementById(dateID).value;
    const newRejection = new Rejection(description, category, outcome, date);
    rejections.push(newRejection);
    if (outcome === 'Rejected') {
        progress++;
    }
    saveRejections();
}

function editRejection(id, description = null, category = null, outcome = null, date = null) {
    const rejection = rejections.find(r => r.id === id);
    if (rejection) {
        if (description !== null) rejection.editDescription(description);
        if (category !== null) rejection.editCategory(category);
        if (outcome !== null) {
            if(rejection.outcome == "Rejected"){
                progress--;
            }else if (outcome === 'Rejected') {
                progress++;
            }
            rejection.editOutcome(outcome);
        }
        if (date !== null) rejection.editDate(date);
        saveRejections();
    }
}

function deleteRejection(id) {
    const rejection = rejections.find(r => r.id === id);
    if (rejection) {
        if (rejection.outcome === 'Rejected') {
            progress--;
        }
        rejections = rejections.filter(r => r.id !== id);
        saveRejections();
    }
}

function saveObjective() {
    localStorage.setItem('objective', JSON.stringify(objective));
}

function editObjective(newObjective) {
    objective = newObjective;
    saveObjective();
}

function saveDeadline() {
    localStorage.setItem('deadline', JSON.stringify(deadline));
}

function editDeadline(newDeadline) {
    deadline = newDeadline;
    saveDeadline();
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
    const table = document.getElementById('rejectionTable');
    for (let rejection of rejections){
        addRow(table, rejection);
    }
}

function addRow(table, rejection){
    let row = table.insertRow();
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
}

function daysBetween(startDate, endDate) {
    var millisecondsPerDay = 24 * 60 * 60 * 1000;
    return (endDate - startDate) / millisecondsPerDay;
}