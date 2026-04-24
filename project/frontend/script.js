let nodes = [];
let edges = [];
let selected = null;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.addEventListener("click", (e) => {
    const x = e.offsetX;
    const y = e.offsetY;

    let idx = getNode(x, y);

    if (idx !== null) {
        if (selected === null) {
            selected = idx;
        } else {
            edges.push([selected, idx]);
            selected = null;
        }
    } else {
        nodes.push({ x, y });
    }

    draw();
});

function getNode(x, y) {
    for (let i = 0; i < nodes.length; i++) {
        let dx = nodes[i].x - x;
        let dy = nodes[i].y - y;
        if (Math.sqrt(dx*dx + dy*dy) < 15) return i;
    }
    return null;
}

function draw() {
    ctx.clearRect(0, 0, 800, 500);

    // edges
    edges.forEach(([a,b]) => {
        ctx.beginPath();
        ctx.moveTo(nodes[a].x, nodes[a].y);
        ctx.lineTo(nodes[b].x, nodes[b].y);
        ctx.strokeStyle = "white";
        ctx.stroke();
    });

    // nodes
    nodes.forEach((n, i) => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, 15, 0, 2*Math.PI);
        ctx.fillStyle = (i === selected) ? "yellow" : "lightblue";
        ctx.fill();
        ctx.fillStyle = "black";
        ctx.fillText(i, n.x-5, n.y+5);
    });
}

function resetGraph() {
    nodes = [];
    edges = [];
    selected = null;
    draw();
}

function runAlgo(type) {
    fetch("http://localhost:3000/run", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            nodesCount: nodes.length,
            edges: edges,
            type: type
        })
    })
    .then(res => res.json())
    .then(data => {
        console.log("RESULT:", data);
        visualize(data.result);
    });
}

function visualize(order) {
    let i = 0;

    function step() {
        if (i >= order.length) return;

        let node = nodes[order[i]];

        ctx.beginPath();
        ctx.arc(node.x, node.y, 15, 0, 2*Math.PI);
        ctx.fillStyle = "green";
        ctx.fill();

        i++;
        setTimeout(step, 600);
    }

    step();
}