var taskIdCounter = 0;
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var pageContentEl = document.querySelector("#page-content");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");

var tasks = []; // create an array to hold tasks for saving 

var taskFormHandler = function(event) {
    event.preventDefault();
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    if (!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form!"); //check if input values are empty strings
        return false;
    }
    formEl.reset(); // ??

    var isEdit = formEl.hasAttribute("data-task-id");

    if (isEdit) {  //has data attribute so get task id and call function to complete the edit process
        var taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    }
    else {  // no data attribute, so create object as normal and pass to createTaskEl function
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput,
            status: "to do"
        };

        createTaskEl(taskDataObj);
    }
};

var createTaskEl = function(taskDataObj) {
    var listItemEl = document.createElement("li"); //create the list item
    listItemEl.className = "task-item";
    listItemEl.setAttribute("data-task-id", taskIdCounter);  //add task id as custom attribute

    var taskInfoEl = document.createElement("div");  //create a div to hold task info and add to the list item
    taskInfoEl.className = "task-info"; //give it a class name 
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";  //add html content inside the div
    listItemEl.appendChild(taskInfoEl);

    var taskActionsEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionsEl); // append taskActionEl to listItemEl before ListItemEl is appended to page 
    tasksToDoEl.appendChild(listItemEl);  //add the entire list item to the list

    switch (taskDataObj.status) {
    case "to do":
      taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 0;
      tasksToDoEl.append(listItemEl);
      break;
    case "in progress":
      taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 1;
      tasksInProgressEl.append(listItemEl);
      break;
    case "completed":
      taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 2;
      tasksCompletedEl.append(listItemEl);
      break;
    default:
      console.log("Something went wrong!");
  }

    taskDataObj.id = taskIdCounter;
    tasks.push(taskDataObj);

    taskIdCounter++; //increase taskcounter for next unique id

    saveTasks();
};

var createTaskActions = function(taskId) {
    var actionsContainerEl = document.createElement("div");
    actionsContainerEl.className = "task-actions";

    var editButtonEl = document.createElement("button"); // create edit button
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);
    actionsContainerEl.appendChild(editButtonEl);

    var deleteButtonEl = document.createElement("button"); // create the delete button
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);
    actionsContainerEl.appendChild(deleteButtonEl);

    var statusSelectEl = document.createElement("select"); // create status dropdown
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);
    statusSelectEl.className = "select-status";
    actionsContainerEl.appendChild(statusSelectEl);

    var statusChoices = ["To DO", "In Progress", "Completed"]; // create status options

    for (var i = 0; i < statusChoices.length; i++) {

        var statusOptionEl = document.createElement("option"); // create the option El
        statusOptionEl.setAttribute("value", statusChoices[i]);
        statusOptionEl.textContent = statusChoices[i];

        statusSelectEl.appendChild(statusOptionEl); // append statusOptionEl to statusSelectEl
    }
    return actionsContainerEl;
};

var taskButtonHandler = function(event) {
    var targetEl = event.target;   // get the target element from the event

    if (targetEl.matches(".edit-btn")) {
        var taskId = targetEl.getAttribute("data-task-id"); // if edit button is clicked
        editTask(taskId);
    }
    else if (targetEl.matches(".delete-btn")) {  // if delete btn is clicked
        var taskId = targetEl.getAttribute("data-task-id");
        deleteTask(taskId);
    }
};

var editTask = function(taskId) {
    console.log("editing task #" + taskId);
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']"); // get task list item EL
    var taskName = taskSelected.querySelector("h3.task-name").textContent; // get content from task name and type 
    var taskType = taskSelected.querySelector("span.task-type").textContent;

    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
    document.querySelector("#save-task").textContent = "Save Task";
    
    formEl.setAttribute("data-task-id", taskId);
};

var completeEditTask = function(taskName, taskType, taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']"); // find the matching list Item

    taskSelected.querySelector("h3.task-name").textContent = taskName; // set new values
    taskSelected.querySelector("span.task-type").textContent = taskType;

    for (vari =0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {  // loop through tasks array and task object with new content
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
    };

    saveTasks();

    alert("Task Updated!");
    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";
};

var deleteTask = function(taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove(); 

    var updatedTaskArr =[]; // create a new array to hold updated list of tasks

    for (var i =0; i < tasks.length; i++) {  // loop through current tasks

        if (tasks[i].id !== parseInt(taskId)) { //if task[i].id doesnt match the value of taskId, lets keep it and push it into the new array
            updatedTaskArr.push(tasks[i]);
        }
    }
    tasks = updatedTaskArr; // reassign tasks to be the same as updatedTaskArr

    saveTasks();
};

var taskStatusChangeHandler = function(event) {

    var taskId = event.target.getAttribute("data-task-id"); // get the task item's Id
    var statusValue = event.target.value.toLowerCase();  // get the currently selected options value and convert to lowercase
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']"); // find the parent task item element based on the Id
    
    if (statusValue === "to do") {
        tasksToDoEl.appendChild(taskSelected);
    }
    else if (statusValue === "in progress") {
        tasksInProgressEl.appendChild(taskSelected);
    }
    else if (statusValue === "completed") {
        tasksCompletedEl.appendChild(taskSelected);
    }
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].status = statusValue;
        }
    }
    saveTasks();
};

var saveTasks = function() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

var loadTasks = function() {
    var savedTasks = localStorage.getItem("tasks");  //get tasks from local storage
    if (!savedTasks) { // also could use (savedTasks === null)
        return false;
    }
    savedTasks = JSON.parse(savedTasks);  //convert tasks from string format back to array of objects
    
    for (var i = 0; i < savedTasks.length; i++) { // pass each object into the createTaskEl() function
        createTaskEl(savedTasks[i]);
    }
};

formEl.addEventListener("submit", taskFormHandler);
pageContentEl.addEventListener("click", taskButtonHandler);
pageContentEl.addEventListener("change", taskStatusChangeHandler);