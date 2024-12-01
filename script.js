const rangeInput = document.getElementById('velocity-range');
const valorDisplay = document.getElementById('velocity-valor');

rangeInput.addEventListener('input', () => {
  valorDisplay.textContent = `${rangeInput.value} m/s`;
});

document.querySelectorAll('.config-item').forEach((item) => {
  const rangeInput = item.querySelector('input[type="range"]');
  const textInput = item.querySelector('.text-input');

  rangeInput.addEventListener('input', () => {
    textInput.value = rangeInput.value;
  });

  textInput.addEventListener('input', () => {
    const value = parseFloat(textInput.value);
    if (!isNaN(value)) {
      rangeInput.value = Math.min(rangeInput.max, Math.max(rangeInput.min, value));
      textInput.value = rangeInput.value;
    } else {
      textInput.value = rangeInput.value;
    }
  });
});

const radioButtons = document.querySelectorAll('input[name="simulation-type"]');

const radioInputs = document.querySelectorAll('input[name="simulation-type"]');
const labels = document.querySelectorAll('.radio-group label');

function updateLabelStyles() {
  labels.forEach((label) => label.classList.remove('active'));
  const selectedInput = document.querySelector('input[name="simulation-type"]:checked');
  const selectedLabel = selectedInput.closest('label');
  selectedLabel.classList.add('active');
}

radioInputs.forEach((input) => {
  input.addEventListener('change', updateLabelStyles);
});

updateLabelStyles();

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const img = new Image();
img.src = "./assets/bola.svg";

let posicoes = [];
let escala = 50.5;
let canvasWidth, canvasHeight;
let totalDistance = 0;
let alturaMaxima = 0;
let targetHit = false;
let ballVisible = true;

function resizeCanvas() {
  canvasWidth = window.innerWidth - 22;
  canvasHeight = window.innerHeight - 22;
  
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
}

function desenharCenario() {
  // ctx.beginPath();
  // ctx.moveTo(0, canvasHeight - 80);
  // ctx.lineTo(canvasWidth, canvasHeight - 80);
  // ctx.strokeStyle = "#000";
  // ctx.stroke();

  // Poste da bandeira
  ctx.beginPath();
  ctx.moveTo(canvasWidth - 145, canvasHeight - 88);
  ctx.lineTo(canvasWidth - 145, canvasHeight - 200);
  ctx.lineWidth = 6;
  ctx.strokeStyle = "#C6C6C6"; // Cor marrom para o poste
  ctx.stroke();

  // Bandeira
  ctx.beginPath();
  ctx.moveTo(canvasWidth - 149, canvasHeight - 210);
  ctx.lineTo(canvasWidth - 106, canvasHeight - 190);
  ctx.lineTo(canvasWidth - 149, canvasHeight - 170);
  ctx.closePath();
  ctx.fillStyle = "red";
  ctx.fill();

  // Buraco (elipse)
  ctx.beginPath();
  ctx.ellipse(canvasWidth-175, canvasHeight-88, 30, 5, 0, 0, 2 * Math.PI);
  ctx.fillStyle = "black";
  ctx.fill();
}

function verificarColisaoAlvo(x, y) {
  const alvoX = canvasWidth - 175;
  const alvoY = canvasHeight - 88;
  
  const distancia = Math.sqrt(
    Math.pow(x - alvoX, 2) + 
    Math.pow(y - alvoY, 2)
  );
  
  return distancia < 35;
}

function desenharSombra(x, y, altura) {
  // Desenha uma elipse como sombra
  ctx.beginPath();
  // A sombra fica no "chão" e seu tamanho varia com a altura
  let shadowWidth = 30 * (1 - altura / 500);  // Reduz o tamanho da sombra com a altura
  const shadowOpacity = 0.3 * (1 - altura / 500);  // Reduz a opacidade com a altura
  
  if (shadowWidth < 0) shadowWidth = 0;

  ctx.ellipse(x + 15, canvasHeight - 70, shadowWidth, 5, 0, 0, 2 * Math.PI);
  ctx.fillStyle = `rgba(0, 0, 0, ${shadowOpacity})`;
  ctx.fill();
}

function lancar() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  desenharCenario();
  targetHit = false;
  ballVisible = true;

  const v_zero = document.getElementById('velocity-range').value;
  const angulo = document.getElementById('angulo').value;

  const theta = (angulo * Math.PI) / 180;
  const v_zero_x = v_zero * Math.cos(theta);
  const v_zero_y = v_zero * Math.sin(theta);

  const diametro = document.getElementById('diametro').value;
  const rho = 1.225;
  const A = Math.PI * Math.pow(diametro / 2, 2);
  const C_a = 0.8;
  const m = document.getElementById('massa').value;

  const gravidade = document.getElementById('gravidade').value;
  const dt = 0.001;

  posicoes = [];
  totalDistance = 0;
  alturaMaxima = 0;

  let tempo = 0;
  let pos_x = 0;
  let pos_y = 0;
  let v_x = v_zero_x;
  let v_y = v_zero_y;

  while (pos_y >= 0) {
    posicoes.push({ x: pos_x, y: pos_y });

    alturaMaxima = Math.max(alturaMaxima, pos_y);

    const v = Math.sqrt(v_x ** 2 + v_y ** 2);
    const F_a = 0.5 * rho * v ** 2 * A * C_a;

    const a_x = (-F_a * v_x) / (m * v);
    const a_y = -gravidade - (F_a * v_y) / (m * v);

    v_x += a_x * dt;
    v_y += a_y * dt;

    pos_x += v_x * dt;
    pos_y += v_y * dt;

    tempo += dt;

    if (posicoes.length > 1) {
      const lastPos = posicoes[posicoes.length - 2];
      const distanceIncrement = Math.sqrt(
        Math.pow(pos_x - lastPos.x, 2) + Math.pow(pos_y - lastPos.y, 2)
      );
      totalDistance += distanceIncrement;
    }
  }
  pos_y = 0.0001;
  posicoes.push({ x: pos_x, y: pos_y });
  escala = 50.5;

  function desenharRastro(frameIndex) {
    ctx.beginPath();
    ctx.setLineDash([5, 5]);
    ctx.moveTo(150, canvasHeight - 80);

    for (let i = 0; i <= frameIndex; i++) {
      const pos = posicoes[i];
      const x = pos.x * escala + 150;
      const y = canvasHeight - 80 - pos.y * escala;
      ctx.lineTo(x, y);
    }

    ctx.strokeStyle = "#999";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.setLineDash([]);
  }

  function mostrarInformacoes() {
    ctx.font = "16px Roboto";
    ctx.fillStyle = "#FFF";
    ctx.textAlign = "left";
    
    ctx.fillText(`Altura máxima: ${alturaMaxima.toFixed(2)} m`, 220, canvasHeight - 20);
    
    ctx.fillText(`Distância percorrida: ${totalDistance.toFixed(2)} m`, 220, canvasHeight - 50);
  }

  function mostrarMensagemAlvo() {
    ctx.font = "30px Roboto";
    ctx.fillStyle = "#FFF";
    ctx.textAlign = "center";
    ctx.fillText("Nice Shot!", canvasWidth / 2, canvasHeight / 2);
  }

  let frameIndex = 0;
  const frameStep = Math.ceil(posicoes.length / 100);

  function animate() {
    if (frameIndex >= posicoes.length) {
      mostrarInformacoes();
      if (targetHit) mostrarMensagemAlvo();
      return;
    }

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    desenharCenario();

    desenharRastro(frameIndex);

    const pos = posicoes[frameIndex];
    const x = pos.x * escala + 135;
    const y = canvasHeight - 95 - pos.y * escala;
    
    if (verificarColisaoAlvo(x, y)) {
      targetHit = true;
      ballVisible = false;
    }

    if (ballVisible) {
      desenharSombra(x, y, pos.y * escala);
      ctx.drawImage(img, x, y, 30, 30);
    }

    frameIndex += frameStep;
    setTimeout(animate, 16);

    if (frameIndex >= posicoes.length) {
      mostrarInformacoes();
      if (targetHit) mostrarMensagemAlvo();
    }
  }

  animate();
}

function handleResize() {
  resizeCanvas();
  desenharCenario();
  ctx.drawImage(img, 150, canvasHeight - 105, 30, 30);
}

resizeCanvas();

img.onload = () => {
  desenharCenario();
  ctx.drawImage(img, 150, canvasHeight - 105, 30, 30);
};

window.addEventListener('resize', handleResize);
