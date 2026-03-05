/* ===== TABLE ===== */
let idx = 0;
function createRow() {
    const name = document.getElementById("name");
    const quanta = document.getElementById("quanta");
    const cls = document.getElementById("className");

    if (!name.value.trim() || !quanta.value.trim() || !cls.value) {
        alert("Fill all fields");
        return;
    }

    const row = document.createElement("tr");
    row.className = "hover:bg-purple-50 transition";
    row.innerHTML = `<td class="p-3">${++idx}</td><td class="p-3 text-green-600 font-semibold">${name.value}</td><td class="p-3">${quanta.value}</td><td class="p-3">${cls.value}</td>`;
    document.querySelector("#table tbody").appendChild(row);

    // Clear inputs
    name.value = "";
    quanta.value = "";
    cls.value = "Select Class";
}

/* ===== CANVAS ANIMATION ===== */
const canvas = document.getElementById('network');
const ctx = canvas.getContext('2d');
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

const points = [];
const pointCount = 130;
let mouse = { x: -1000, y: -1000 };

// Custom Color: rgb(68, 70, 152)
const lineColor = "68, 70, 152";

for (let i = 0; i < pointCount; i++) {
    points.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8
    });
}

function drawGlow() {
    const glowRadius = 300;
    const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, glowRadius);
    gradient.addColorStop(0, `rgba(${lineColor}, 0.12)`); // Slightly stronger glow
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
}

function animate() {
    ctx.clearRect(0, 0, width, height);
    drawGlow();

    points.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        let dist = Math.sqrt((p.x - mouse.x) ** 2 + (p.y - mouse.y) ** 2);

        // Calculate Point Opacity: Base of 0.15, increasing to 1.0 near mouse
        let pointAlpha = 0.15;
        if (dist < 250) {
            pointAlpha = 0.15 + (1 - dist / 250) * 0.85;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${lineColor}, ${pointAlpha})`;
        ctx.fill();
    });

    for (let i = 0; i < pointCount; i++) {
        for (let j = i + 1; j < pointCount; j++) {
            const p1 = points[i];
            const p2 = points[j];
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                const mDist = Math.sqrt(((p1.x + p2.x) / 2 - mouse.x) ** 2 + ((p1.y + p2.y) / 2 - mouse.y) ** 2);

                // Calculate Line Opacity: Base visibility + Proximity boost
                let lineAlpha = (1 - distance / 100) * 0.1; // Light base connection

                if (mDist < 200) {
                    lineAlpha += (1 - mDist / 200) * 0.6; // Deepen when mouse is near
                }

                ctx.beginPath();
                ctx.strokeStyle = `rgba(${lineColor}, ${lineAlpha})`;
                ctx.lineWidth = 0.8;
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animate);
}

window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX; mouse.y = e.clientY;
});

window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
});

animate();
