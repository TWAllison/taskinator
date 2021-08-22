var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var taskIdCounter = 0;


var taskFormHandler = function (event) {
    event.preventDefault();
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    if (!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form!"); //check if input values are empty strings
        return false;
    }
    formEl.reset();


    //package up data as an object
    var taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput
    };

    // send it as an argument to createTaskEl
    createTaskEl(taskDataObj);
}

var createTaskEl = function (taskDataObj) {


    var listItemEl = document.createElement("li"); //create the list item
    listItemEl.className = "task-item";
    listItemEl.setAttribute = ("data-task-id", taskIdCounter);  //add task id as custom attribute

    var taskInfoEl = document.createElement("div");  //create a div to hold task info and add to the list item
    taskInfoEl.className = "task-info"; //give it a class name 
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";  //add html content inside the div
    listItemEl.appendChild(taskInfoEl);

    var taskActionsEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionsEl); // append taskActionEl to listItemEl before ListItemEl is appended to page 

    tasksToDoEl.appendChild(listItemEl);  //add the entire list item to the list

    taskIdCounter++; //increase taskcounter for next unique id
};

var createTaskActions = function (taskId) {
    var actionsContainerEl = document.createElement("div");
    actionsContainerEl.className = "task-actions";

    var editButtonEl = document.createElement("button"); // create edit button
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);

    actionsContainerEl.appendChild(editButtonEl);

    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);

    actionsContainerEl.appendChild(deleteButtonEl);

    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);

    actionsContainerEl.appendChild(statusSelectEl);

    var statusChoices = ["To DO", "In Progress", "completed"];

    for (var i = 0; i < statusChoices.length; i++) {
        //create option el
        var statusOptionEl = document.createElement("options");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);
        //append to select
        statusSelectEl.appendChild(statusOptionEl);
    }



    return actionsContainerEl;


};



formEl.addEventListener("submit", taskFormHandler);