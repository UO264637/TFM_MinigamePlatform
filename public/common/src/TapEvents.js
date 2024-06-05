window.addEventListener("mousedown", mousedown);
window.addEventListener("mousemove", mousemove);
window.addEventListener("mouseup", mouseup);

const taps = []; // actuales registradas
const tapType = {}; // tipos
tapType.start = 1;
tapType.mantain = 2;


function mousedown(event) {
  addTap(1, tapType.start, event);
}

function mousemove(event) {
  if (taps.length == 0 || event.timeStamp - taps[0].timeStamp > 10) {
    addTap(1, tapType.mantain, event);
  }
}

function mouseup(event) {
  deleteTap(1);
}

function addTap(id, tapType, event) {
  let x = event.pageX - canvas.offsetLeft;
  let y = event.pageY - canvas.offsetTop;

  const p = {};
  p.x = x / minScale;
  p.y = y / minScale;
  p.id = id; // Ratón SOLO hay 1
  p.type = tapType;
  p.timeStamp = event.timeStamp;

  let foundTap = false;
  for (let i = 0; i < taps.length; i++) {
    if (taps[i].id == id) {
      taps[i] = p;
      foundTap = true;
    }
  }

  if (!foundTap) {
    taps.push(p);
  }
}

function deleteTap(id) {
  for (let i = 0; i < taps.length; i++) {
    if (taps[i].id == id) {
      taps.splice(i, 1);
    }
  }
}

function disableTapInput() {
  window.removeEventListener("mousedown", mousedown);
  window.removeEventListener("mousemove", mousemove);
  window.removeEventListener("mouseup", mouseup);
}

function enableTapInput() {
  window.addEventListener("mousedown", mousedown);
  window.addEventListener("mousemove", mousemove);
  window.addEventListener("mouseup", mouseup);
}
