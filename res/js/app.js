var rejections = JSON.parse(localStorage.getItem('rejections')) || [];
var currentPopUp = null;
var objective = JSON.parse(localStorage.getItem('objective')) || 1000;
var progress = JSON.parse(localStorage.getItem('progress')) || rejections.filter(r => r.outcome === 'rejected').length;
var deadline = JSON.parse(localStorage.getItem('deadline')) || new Date(2026, 6, 1).toISOString().split('T')[0];

function saveRejections() {
    localStorage.setItem('rejections', JSON.stringify(rejections));
}

function addRejection(description, category, outcome, date){
    const newRejection = new Rejection(description, category, outcome, date);
    rejections.push(newRejection);
    if (outcome === 'rejected') {
        progress++;
        saveProgress();
    }
    saveRejections();
}

function editRejection(id, description = null, category = null, outcome = null, date = null) {
    const rejection = rejections.find(r => r.id === id);
    if (rejection) {
        if (description !== null) rejection.editDescription(description);
        if (category !== null) rejection.editCategory(category);
        if (outcome !== null) rejection.editOutcome(outcome);
        if (outcome === 'rejected') {
            progress++;
            saveProgress();
        }
        if (date !== null) rejection.editDate(date);
        saveRejections();
    }
}

function deleteRejection(id) {
    const rejection = rejections.find(r => r.id === id);
    if (rejection) {
        if (rejection.outcome === 'rejected') {
            progress--;
            saveProgress();
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

function saveProgress() {
    localStorage.setItem('progress', JSON.stringify(progress));
}

function saveDeadline() {
    localStorage.setItem('deadline', JSON.stringify(deadline));
}

function editDeadline(year, month, day) {
    deadline = new Date(year, month, day).toISOString().split('T')[0];
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