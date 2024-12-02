const bookItems = [];
const RENDER_EVENT = "BookShelf_Render";
const STORAGE_KEY = "BookShelf_App";
const SAVE_EVENT = "BookShelf_Saved";

function generateBookId() {
  return +new Date();
}

function generateBookItem(
  ID_buku,
  judul_buku,
  penulis_buku,
  tahun_rilis_buku,
  isCompleted
) {
  return {
    id: ID_buku,
    title: judul_buku,
    author: penulis_buku,
    year: Number(tahun_rilis_buku),
    isComplete: isCompleted,
  };
}

function addBookItem() {
  const bookFormTitle = document.getElementById("bookFormTitle").value;
  const bookFormAuthor = document.getElementById("bookFormAuthor").value;
  const bookFormYear = document.getElementById("bookFormYear").value;
  let bookFormIsComplete = false;
  if (document.getElementById("bookFormIsComplete").checked) {
    bookFormIsComplete = true;
  }

  const bookId = generateBookId();
  const bookObject = generateBookItem(
    bookId,
    bookFormTitle,
    bookFormAuthor,
    bookFormYear,
    bookFormIsComplete
  );
  bookItems.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveDataToStorage();
}

function makeBookItem(bookObject) {
  const { id, title, author, year, isComplete } = bookObject;

  const bookItem = document.createElement("div");
  bookItem.setAttribute("data-bookid", id);
  bookItem.setAttribute("data-testid", "bookItem");
  const bookTitle = document.createElement("h3");
  bookTitle.setAttribute("data-testid", "bookItemTitle");
  bookTitle.innerText = title;
  const bookAuthor = document.createElement("p");
  bookAuthor.setAttribute("data-testid", "bookItemAuthor");
  bookAuthor.innerText = author;
  const bookYear = document.createElement("p");
  bookYear.setAttribute("data-testid", "bookItemYear");
  bookYear.innerText = year;

  //buat div in/Complete
  let isCompleteDivButton = document.createElement("div");
  isCompleteDivButton.classList.add("isCompleteButton");

  //button hapus buku
  const DeleteButton = document.createElement("button");
  DeleteButton.setAttribute("data-testid", "bookItemDeleteButton");
  DeleteButton.innerText = "Hapus Buku";
  DeleteButton.addEventListener("click", function () {
    RemoveFromBookItemComplete(id);
  });
  //button edit buku
  const EditButton = document.createElement("button");
  EditButton.setAttribute("data-testid", "bookItemEditButton");
  EditButton.innerText = "Edit Buku";

  let isCompleteButton = document.createElement("button");
  isCompleteButton.setAttribute("data-testid", "bookItemIsCompleteButton");

  if (isComplete) {
    //button belum/selesai dibaca
    // const CompleteButton = document.createElement("button");
    isCompleteButton.innerText = "Belum selesai dibaca";
    isCompleteButton.addEventListener("click", function () {
      UndoFromBookItemComplete(id);
    });
    // isCompleteDivButton.append(CompleteButton, DeleteButton, EditButton);
  } else {
    //button belum/selesai dibaca
    isCompleteButton.innerText = "Selesai dibaca";
    isCompleteButton.addEventListener("click", function () {
      addToBookItemComplete(id);
    });
    // isCompleteDivButton.append(isCompleteButton, DeleteButton, EditButton);
  }
  isCompleteDivButton.append(isCompleteButton, DeleteButton, EditButton);
  //add item to div
  bookItem.append(bookTitle, bookAuthor, bookYear, isCompleteDivButton);
  return bookItem;
}

function findBookItem(ID) {
  for (item of bookItems) {
    if (item.id === ID) {
      return item;
    }
  }
  return null;
}

function findBookItemIndex(ID) {
  for (index in bookItems) {
    if (bookItems[index].id === ID) {
      return index;
    }
  }
  return -1;
}

function addToBookItemComplete(ID) {
  const findItem = findBookItem(ID);
  if (findItem == null) return;

  findItem.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveDataToStorage();
}

function RemoveFromBookItemComplete(ID) {
  const findItem = findBookItemIndex(ID);
  if (findItem === -1) return;
  bookItems.splice(findItem, 1);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveDataToStorage();
}

function UndoFromBookItemComplete(ID) {
  const findItem = findBookItem(ID);
  if (findItem == null) return;

  findItem.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveDataToStorage();
}

function saveDataToStorage() {
  if (isStorageExist()) {
    const parseBookItems = JSON.stringify(bookItems);
    localStorage.setItem(STORAGE_KEY, parseBookItems);
    document.dispatchEvent(new Event(SAVE_EVENT));
  }
}

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browsermu tidak mendukung local storage");
    return false;
  }
  return true;
}

document.addEventListener("DOMContentLoaded", function () {
  const bookForm = document.getElementById("bookForm");

  bookForm.addEventListener("submit", function (e) {
    e.preventDefault();
    addBookItem();
  });

  //menampilkan data dari storage
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function loadDataFromStorage() {
  const dataBuku = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(dataBuku);

  if (data !== null) {
    for (const item of data) {
      bookItems.push(item);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener(RENDER_EVENT, function () {
  const unComplete = document.getElementById("incompleteBookList");
  const complete = document.getElementById("completeBookList");

  unComplete.innerHTML = "";
  complete.innerHTML = "";

  for (item of bookItems) {
    const bookElement = makeBookItem(item);
    if (item.isComplete) {
      complete.append(bookElement);
    } else {
      unComplete.append(bookElement);
    }
  }
});

document.addEventListener(SAVE_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});
