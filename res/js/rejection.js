class Rejection {
    constructor (description, category, outcome, date, notes = null) {
        this.id= Date.now();
        this.description = description;
        this.category = category;
        this.outcome = outcome;
        this.date = date;
        this.notes = notes;
    }
    editDescription(newDescription) {
        this.description = newDescription;
    }
    editCategory(newCategory) {
        this.category = newCategory;
    }
    editOutcome(newOutcome) {
        this.outcome = newOutcome;
    }
    editDate(newDate) {
        this.date = newDate;
    }
    editNotes(newNotes) {
        this.notes = newNotes;
    }

}

export {Rejection};