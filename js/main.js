const API = "http://localhost:8001/contacts";

let form = $(".add-contact");
let name = $(".name");
let lastname = $(".lastname");
let phoneNumber = $("#phone");
let createBtn = $(".create-btn");

//! POST
function addContact(event) {
  event.preventDefault();
  if (!name.val() || !phoneNumber.val()) {
    alert("Fill form to create contact!");
    return;
  }
  let contName = name.val();
  let contLastname = lastname.val();
  let phone = phoneNumber.val();
  let user = {
    name: contName,
    lastname: contLastname,
    phoneNum: phone,
  };
  fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  }).then(() => getContacts(API));
  name.val("");
  lastname.val("");
  phoneNumber.val("");
}

form.on("submit", addContact);

//! GET
let tbody = $("tbody");

function getContacts(API) {
  fetch(API)
    .then((response) => response.json())
    .then((data) => {
      tbody.html("");
      data.forEach((item, index) => {
        tbody.append(`
                <tr>
                    <td>${item.id}</td>
                    <td>${item.name}</td>
                    <td>${item.lastname}</td>
                    <td>${item.phoneNum}</td>
                    <td>
                        <button style="
                          display:inline-block;
                          font-weight: 700;
                          text-decoration: none;
                          user-select: none;
                          padding: .5em 2em;
                          outline: none;
                          border: 2px solid;
                          border-radius: 5px;
                          cursor: pointer;
                          transition: 0.2s;"
                          class="delete-btn" id="${item.id}">Delete</button>
                        <button style="
                        display:inline-block;
                        font-weight: 700;
                        text-decoration: none;
                        user-select: none;
                        padding: .5em 2em;
                        outline: none;
                        border: 2px solid;
                        border-radius: 5px;
                        cursor: pointer;
                        transition: 0.2s;" class="edit-btn" id="${item.id}">Edit</button>
                    </td>
                </tr>
            `);
      });
    });
}
getContacts(API);

//! DELETE

function deleteContact(event) {
  let id = event.target.id;
  fetch(`${API}/${id}`, {
    method: "DELETE",
  }).then(() => getContacts(API));
}
$(document).on("click", ".delete-btn", deleteContact);

//! EDIT

let editedForm = $(".modal-form");
let editedName = $(".edit-name");
let editedLastname = $(".edit-lastname");
let editedNum = $(".edit-phone");
let editedBtn = $(".save-btn");
let modal = $(".modal");

function editContact(event) {
  let id = event.target.id;
  editedForm.attr("id", id);
  fetch(`${API}/${id}`)
    .then((response) => response.json())
    .then((data) => {
      // console.log(data);
      editedName.val(data.name);
      editedLastname.val(data.lastname);
      editedNum.val(data.phoneNum);
    });
}
function saveEditedContact(event) {
  event.preventDefault();
  let id = event.target.id;
  let name = editedName.val();
  let lastname = editedLastname.val();
  let contNum = editedNum.val();
  if (!name.trim() || !contNum.trim()) {
    alert("Can not be empty!");
    return;
  }

  let contact = {
    name: name,
    lastname: lastname,
    phoneNum: contNum,
  };
  fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(contact),
  }).then(() => getContacts(API));
  editedName.val("");
  editedLastname.val("");
  editedNum.val("");
}

$(document).on("click", ".edit-btn", () => {
  editContact(event);
  modal.fadeIn(300).css("display", "flex");
});
$(".close-btn").on("click", () => {
  modal.fadeOut(300);
});
editedForm.on("submit", () => {
  saveEditedContact(event);
  modal.fadeOut(300);
});
