var rejections = JSON.parse(localStorage.getItem('rejections')) || [];
const outcomes = ['Rejected', 'Pending', 'Accepted'];
var objective = JSON.parse(localStorage.getItem('objective')) || 1000;
var progress = JSON.parse(localStorage.getItem('progress')) || rejections.filter(r => r.outcome === 'Rejected').length;

function saveRejections() {
    localStorage.setItem('rejections', JSON.stringify(rejections));
}

function addRejection(description, category, outcome, date, notes = null){
    const newRejection = new Rejection(description, category, outcome, date, notes);
    rejections.push(newRejection);
    if (outcome === 'Rejected') {
        progress++;
        saveProgress();
    }
    saveRejections();
}

function editRejection(id, description = null, category = null, outcome = null, date = null, notes = null) {
    const rejection = rejections.find(r => r.id === id);
    if (rejection) {
        if (description !== null) rejection.editDescription(description);
        if (category !== null) rejection.editCategory(category);
        if (outcome !== null) rejection.editOutcome(outcome);
        if (outcome === 'Rejected') {
            progress++;
            saveProgress();
        }
        if (date !== null) rejection.editDate(date);
        if (notes !== null) rejection.editNotes(notes);
        saveRejections();
    }
}

function deleteRejection(id) {
    const rejection = rejections.find(r => r.id === id);
    if (rejection) {
        if (rejection.outcome === 'Rejected') {
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
