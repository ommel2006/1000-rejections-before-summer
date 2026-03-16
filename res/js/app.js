var rejections = JSON.parse(localStorage.getItem('rejections')) || [];
const outcomes = ['Rejected', 'Pending', 'Accepted'];
var objective = JSON.parse(localStorage.getItem('objective')) || 1000;

function saveRejections() {
    localStorage.setItem('rejections', JSON.stringify(rejections));
}

function addRejection(description, category, outcome, date, notes = null){
    const newRejection = new Rejection(description, category, outcome, date, notes);
    rejections.push(newRejection);
    saveRejections();
}

function editRejection(id, description = null, category = null, outcome = null, date = null, notes = null) {
    const rejection = rejections.find(r => r.id === id);
    if (rejection) {
        if (description !== null) rejection.editDescription(description);
        if (category !== null) rejection.editCategory(category);
        if (outcome !== null) rejection.editOutcome(outcome);
        if (date !== null) rejection.editDate(date);
        if (notes !== null) rejection.editNotes(notes);
        saveRejections();
    }
}

function deleteRejection(id) {
    rejections = rejections.filter(r => r.id !== id);
    saveRejections();
}

function saveObjective() {
    localStorage.setItem('objective', JSON.stringify(objective));
}

function editObjective(newObjective) {
    objective = newObjective;
    saveObjective();
}