const chatForm = document.getElementById("chat-form");
const chatMessage = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

// messag efrom the server
socket.on("message", (message) => {
  outputMessage(message);
  chatMessage.scrollTop = chatMessage.scrollHeight;
});

// join chatroom
socket.emit("joinRoom", { username, room });

// get room and users
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // emit mesg to the server
  const messag = e.target.msg.value;
  socket.emit("msg", messag);
  e.target.msg.value = "";
  e.target.msg.value.focus();
});

// output message to the dom
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username}<span>${message.time}</span></p>
  <p class="text">
    ${message.text}
  </p>`;
  document.querySelector(".chat-messages").appendChild(div);
}

function outputRoomName(room) {
  roomName.innerText = room;
}

function outputUsers(users) {
  userList.innerHTML = `
  ${users.map((user) => `<li>${user.username}</li>`).join(" ")}`;
}
