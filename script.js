const todoValue = document.getElementById("todoText");
const todoAlert = document.getElementById("Alert");
const listItems = document.getElementById("list-items");
const addUpdate = document.getElementById("AddUpdateClick");

let todo = JSON.parse(localStorage.getItem("todo-list")) || [];

function CreateToDoItems() {
    console.log("Function Called: CreateToDoItems()"); // Debugging

    if (todoValue.value.trim() === "") {
        setAlertMessage("Please enter your todo text!");
        todoValue.focus();
        return;
    }

    let isPresent = todo.some(element => element.item === todoValue.value.trim());

    if (isPresent) {
        setAlertMessage("This item is already in the list!");
        return;
    }

    let li = document.createElement("li");

    li.innerHTML = `
        <div title="Click the checkmark to mark as done">
            <img class="check todo-controls" onclick="CompletedToDoItems(this)" src="/images/circle.png" />
            <span>${todoValue.value}</span>
        </div>
        <div>
            <img class="edit todo-controls" onclick="UpdateToDoItems(this)" src="/images/edit.png" />
            <img class="delete todo-controls" onclick="DeleteToDoItems(this)" src="/images/delete.png" />
        </div>`;

    listItems.appendChild(li);
    
    todo.push({ item: todoValue.value, status: false });
    setLocalStorage();

    todoValue.value = "";
    setAlertMessage("Todo item created successfully!");
    
    // Show "Clear All" button
    document.getElementById("clearAll").style.display = "block";
}


function ReadToDoItems() {
    listItems.innerHTML = ""; // Clear list before adding items

    if (todo.length > 0) {
        document.getElementById("clearAll").style.display = "block"; // Show button
    } else {
        document.getElementById("clearAll").style.display = "none"; // Hide button
    }

    todo.forEach((element) => {
        let li = document.createElement("li");
        let style = element.status ? "text-decoration: line-through;" : "";
        
        li.innerHTML = `<div style="${style}" title="Click to Complete" ondblclick="CompletedToDoItems(this)">
            <img class="check todo-controls" onclick="CompletedToDoItems(this)" src="/images/circle.png" />
            <span>${element.item}</span>
        </div>
        <div>
            <img class="edit todo-controls" onclick="UpdateToDoItems(this)" src="/images/edit.png" />
            <img class="delete todo-controls" onclick="DeleteToDoItems(this)" src="/images/delete.png" />
        </div>`;

        listItems.appendChild(li);
    });
}

  ReadToDoItems();

  function UpdateToDoItems(e) {
    if (
      e.parentElement.parentElement.querySelector("div").style.textDecoration ===
      ""
    ) {
      todoValue.value =
        e.parentElement.parentElement.querySelector("div").innerText;
      updateText = e.parentElement.parentElement.querySelector("div");
      addUpdate.setAttribute("onclick", "UpdateOnSelectionItems()");
      addUpdate.setAttribute("src", "/images/refresh.png");
      todoValue.focus();
    }
  }
  
  function UpdateOnSelectionItems() {
    let IsPresent = false;
    todo.forEach((element) => {
      if (element.item == todoValue.value) {
        IsPresent = true;
      }
    });
  
    if (IsPresent) {
      setAlertMessage("This item already present in the list!");
      return;
    }
  
    todo.forEach((element) => {
      if (element.item == updateText.innerText.trim()) {
        element.item = todoValue.value;
      }
    });
    setLocalStorage();
  
    updateText.innerText = todoValue.value;
    addUpdate.setAttribute("onclick", "CreateToDoItems()");
    addUpdate.setAttribute("src", "/images/plus.png");
    todoValue.value = "";
    setAlertMessage("Todo item Updated Successfully!");
  }

  function DeleteToDoItems(e) {
    let deleteValue =
      e.parentElement.parentElement.querySelector("div").innerText;
  
    if (confirm(`Are you sure. Due you want to delete this ${deleteValue}!`)) {
      e.parentElement.parentElement.setAttribute("class", "deleted-item");
      todoValue.focus();
  
      todo.forEach((element) => {
        if (element.item == deleteValue.trim()) {
          todo.splice(element, 1);
        }
      });
  
      setTimeout(() => {
        e.parentElement.parentElement.remove();
      }, 1000);
  
      setLocalStorage();
    }
  }

  function CompletedToDoItems(e) {
    let textElement = e.nextElementSibling; // Get the task text

    if (textElement.style.textDecoration === "line-through") {
        textElement.style.textDecoration = "none"; // Uncheck the item
        e.src = "/images/circle.png"; // Change to unchecked icon
    } else {
        textElement.style.textDecoration = "line-through"; // Check the item
        e.src = "/images/checkmark.png"; // Change to checked icon
    }

    // Update local storage
    let taskText = textElement.innerText.trim();
    todo.forEach((element) => {
        if (element.item === taskText) {
            element.status = textElement.style.textDecoration === "line-through";
        }
    });

    setLocalStorage();
}

  function setLocalStorage() {
    localStorage.setItem("todo-list", JSON.stringify(todo));
}


  function setAlertMessage(message) {
    todoAlert.removeAttribute("class");
    todoAlert.innerText = message;
    setTimeout(() => {
      todoAlert.classList.add("toggleMe");
    }, 1000);
  }

  function ClearAllItems() {
    if (todo.length === 0) {
        setAlertMessage("No items to clear!");
        return;
    }

    if (confirm("Are you sure you want to delete all items?")) {
        listItems.innerHTML = ""; // Clear UI
        todo = []; // Clear the array
        setLocalStorage(); // Update local storage
        setAlertMessage("All items have been cleared!");

        // Hide "Clear All" button when list is empty
        document.getElementById("clearAll").style.display = "none";
    }
}

// Attach event listener to the button
document.getElementById("clearAll").addEventListener("click", ClearAllItems);
