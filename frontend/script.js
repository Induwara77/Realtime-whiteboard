const socket = io("http://localhost:3001");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const colorPicker = document.getElementById("colorPicker");
const brushSize = document.getElementById("brushSize");
const clearBtn = document.getElementById("clearBtn");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 50;

let isDrawing = false;
let lastX = 0;
let lastY = 0;

canvas.addEventListener("mousedown", (e) => {
  isDrawing = true;
  lastX = e.offsetX;
  lastY = e.offsetY;
});

canvas.addEventListener("mousemove", (e) => {
  if (!isDrawing) return;

  const data = {
    x: e.offsetX,
    y: e.offsetY,
    prevX: lastX,
    prevY: lastY,
    color: colorPicker.value,
    size: brushSize.value,
  };

  drawLine(data);
  socket.emit("draw", data);

  lastX = e.offsetX;
  lastY = e.offsetY;
});

canvas.addEventListener("mouseup", () => (isDrawing = false));
canvas.addEventListener("mouseleave", () => (isDrawing = false));

function drawLine(data) {
  ctx.beginPath();
  ctx.moveTo(data.prevX, data.prevY);
  ctx.lineTo(data.x, data.y);
  ctx.strokeStyle = data.color;
  ctx.lineWidth = data.size;
  ctx.lineCap = "round";
  ctx.stroke();
}

socket.on("draw", (data) => {
  drawLine(data);
});

/*
socket.on('clear', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
})
*/

clearBtn.addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  /*socket.emit('clear')*/
})

