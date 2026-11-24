// Ambil elemen HTML
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const categoryInput = document.getElementById("categoryInput");
const dateInput = document.getElementById("dateInput");
const priorityInput = document.getElementById("priorityInput");

const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");
const filterInput = document.getElementById("filterInput");
const emptyState = document.getElementById("emptyState");

// Simpan data tugas
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Tampilkan tanggal hari ini
const today = new Date();

document.getElementById("todayDate").textContent =
    today.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric"
    });

// Fungsi menyimpan data
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Tambah tugas
taskForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const newTask = {
        id: Date.now(),
        name: taskInput.value,
        category: categoryInput.value,
        date: dateInput.value,
        priority: priorityInput.value,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();
    showTasks();

    taskForm.reset();

});

// Tampilkan daftar tugas
function showTasks() {

    taskList.innerHTML = "";

    const keyword = searchInput.value.toLowerCase();
    const filter = filterInput.value;

    let count = 0;

    for (let i = 0; i < tasks.length; i++) {

        const task = tasks[i];

        // Search
        if (!task.name.toLowerCase().includes(keyword)) {
            continue;
        }

        // Filter
        if (filter === "Pending" && task.completed) {
            continue;
        }

        if (filter === "Completed" && !task.completed) {
            continue;
        }

        count++;

        // Buat kotak tugas
        const item = document.createElement("div");
        item.className = "task-item";

        if (task.completed) {
            item.classList.add("completed");
        }

        // Checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        checkbox.addEventListener("change", function() {

            task.completed = checkbox.checked;

            saveTasks();
            showTasks();

        });

        // Informasi tugas
        const info = document.createElement("div");
        info.className = "task-info";

        const title = document.createElement("h4");
        title.textContent = task.name;

        const detail = document.createElement("p");

        let dueDate = task.date || "No due date";

        detail.textContent =
            task.category + " • " +
            dueDate + " • " +
            task.priority + " priority";

        info.appendChild(title);
        info.appendChild(detail);

        // Tombol hapus
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "×";
        deleteButton.className = "delete-button";

        deleteButton.addEventListener("click", function() {

            tasks = tasks.filter(function(currentTask) {
                return currentTask.id !== task.id;
            });

            saveTasks();
            showTasks();

        });

        // Masukkan ke halaman
        item.appendChild(checkbox);
        item.appendChild(info);
        item.appendChild(deleteButton);

        taskList.appendChild(item);

    }

    // Tampilkan pesan jika kosong
    if (count === 0) {
        emptyState.style.display = "block";
    } else {
        emptyState.style.display = "none";
    }

    // Hitung jumlah tugas
    let completed = 0;

    for (let i = 0; i < tasks.length; i++) {

        if (tasks[i].completed) {
            completed++;
        }

    }

    document.getElementById("totalCount").textContent = tasks.length;

    document.getElementById("doneCount").textContent = completed;

    document.getElementById("pendingCount").textContent =
        tasks.length - completed;

}

// Search tugas
searchInput.addEventListener("input", showTasks);

// Filter tugas
filterInput.addEventListener("change", showTasks);

// Tampilkan data pertama kali
showTasks();