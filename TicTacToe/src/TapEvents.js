window.addEventListener('mousedown', mousedown);
window.addEventListener('mousemove', mousemove);
window.addEventListener('mouseup', mouseup);

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
    x = event.pageX - canvas.offsetLeft;
    y = event.pageY - canvas.offsetTop;

    var p = {};
    p.x = x / minScale;
    p.y = y / minScale;
    p.id = id; // Ratón SOLO hay 1
    p.type = tapType;
    p.timeStamp = event.timeStamp;

    var foundTap = false;
    for (var i = 0; i < taps.length; i++) {
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
    for (var i = 0; i < taps.length; i++) {
        if (taps[i].id == id) {
            taps.splice(i, 1);
        }
    }
}
