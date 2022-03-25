//Declaring the form's inputs and buttons.

let taskInput = document.getElementById("taskInput");
let dateInput = document.getElementById("taskDate");
let timeInput = document.getElementById("taskTime");
let resetBTN = document.querySelector(".reset-btn");
let notesContainer = document.getElementById("notes-container");
let form = document.getElementById("taskForm");


//Function that loads saved tasks when you enter the site
window.addEventListener('load', function (e) {
    let savedTasks = localStorage.getItem("tasks");
    //If there are saved tasks - running over the tasks array and loading
    // every object in the array, and adding the HTML Elements
    if (savedTasks) {
        let savedTasksArray = JSON.parse(savedTasks);
        for (let i = 0; i < savedTasksArray.length; i++) {
            let savedTask = savedTasksArray[i];
            //Displaying the saved tasks in the local storage & HTML on page entry
            //First null represents the submit event which is not happening on page load
            //Second null represents the savedTask.time in case user did not assigned time to the time input
            addTask(null, savedTask.text, savedTask.date, (savedTask.time || null), savedTask.id);

        }
    }
});


function addTaskToLocalStorage(text, date, time, id) {
    //Task object
    let newTask = {
        text: text,
        date: date,
        time: time || null,
        id: id
    };
    let savedTasks = localStorage.getItem("tasks");

    //If you already have saved tasks - add them to the array of the saved tasks in the local storage
    if (savedTasks) {
        let savedTasksArray = JSON.parse(savedTasks);
        savedTasksArray.push(newTask);
        localStorage.setItem("tasks", JSON.stringify(savedTasksArray));

        //If that is the first time the user is creating a task
        //Creating a variable named tasks, which contains the newTask in an array, and setting it to the local storage. 
    } else {
        newTask = [newTask]
        localStorage.setItem("tasks", JSON.stringify(newTask));
        console.log("[newTask]: " + JSON.stringify(newTask))


    }

}

//Adding a task on clicking the submit button
function addTask(submittedEvent, text, date, time, id) {
    //On submit click - prevents the form from doing its default page refresh    
    if (submittedEvent) {
        submittedEvent.preventDefault();
    }

    //If you entered a valid date, add a new note, or if the user refreshed the page, add existing notes to the page
    if (isValidDate(dateInput.value) || !submittedEvent) {
        //Creating the note's divs
        let note = document.createElement("div");
        let noteTask = document.createElement("div");
        let noteDate = document.createElement("div");
        let noteTime = document.createElement("div");
        //Adding the styled css classes
        note.classList.add("note", "fadeIn");
        noteTask.classList.add("task");
        noteDate.classList.add("date");
        noteTime.classList.add("time");
        //Updating the elements text content according to the inputs value
        noteTask.textContent = text || taskInput.value;
        noteDate.textContent = date || dateInput.value;
        noteTime.textContent = time || timeInput.value;
        note.appendChild(noteTask);
        note.appendChild(noteDate);
        note.appendChild(noteTime);
        notesContainer.appendChild(note)

        //On submit click - assign a random id to the note, add the note to the local storage
        //and reset the inputs value.
        if (submittedEvent) {
            let id = Math.random().toString(36).substr(2, 16);
            note.dataset.id = id
            addTaskToLocalStorage(taskInput.value, dateInput.value, timeInput.value, note.dataset.id);
            resetInputsValue();
        }
        //In case the user just refreshed the page and no submit event happend, assign an id to the existing notes.
        else {
            note.dataset.id = id;
        }


        // Adding  or removing an X button on hover which deletes the note on click
        note.addEventListener('mouseenter', function (e) {
            let icon = document.createElement("i")
            icon.classList.add('glyphicon', 'glyphicon-remove')
            icon.id = "icon"
            note.appendChild(icon)

            //Removing the note by comparing its id to a loop that runs over the saved tasks array, and comparing the IDs
            //In addition, removing the note itself from the HTML
            icon.addEventListener('click', function (e) {
                removeTaskFromLocalStorage(e.target.parentElement.dataset.id)
                notesContainer.removeChild(e.target.parentElement)
            })
            note.addEventListener('mouseleave', function () {
                note.appendChild(icon)
                note.removeChild(icon)
            })


        })

    } else {
        alert("Please write a valid date in a format of DD-MM-YYYY")

    }

}
// reset text field button
resetBTN.addEventListener('click', resetInputsValue)

function resetInputsValue() {
    if (taskInput.value.trim() || dateInput.value.trim() || timeInput.value.trim()) {
        taskInput.value = ""
        dateInput.value = ""
        timeInput.value = ""

    } else {
        alert("The inputs field are already empty!")
    }
}


//Regex date validation function
//Minimum year - 1600

function isValidDate(dateString) {
    let regEx = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;
    return dateString.match(regEx) != null;
}

/**** Function that removes the selected note from the local storage
By making a loop that runs over the object's id that inside of the savedTasksArray ****/

function removeTaskFromLocalStorage(noteId) {
    let savedTasks = localStorage.getItem("tasks");
    let savedTasksArray = JSON.parse(savedTasks);
    for (i = 0; i < savedTasksArray.length; i++) {
        if (savedTasksArray[i].id == noteId) {
            savedTasksArray.splice(i, 1)
            localStorage.setItem("tasks", JSON.stringify(savedTasksArray))
            // If the "tasks" key is empty from values, remove the tasks key from the local storage.
            if (savedTasksArray.length == 0) {
                localStorage.removeItem("tasks")
            }
        }
    }

}



