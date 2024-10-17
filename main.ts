// Classe para representar um ponto 2D
class Point {
    constructor(public x: number, public y: number) {}
}

// Classe para representar uma forma geométrica
class Shape {
    constructor(public vertices: Point[], public fillColor: string, public borderColor: string) {}
}

// Variáveis globais
let currentPoints: Point[] = []; // Pontos da forma atual
let shapes: Shape[] = []; // Lista de formas criadas
let selectedShapeIndex: number | null = null; // Índice da forma selecionada
let fillColor = "#0000ff"; // Cor de preenchimento padrão
let borderColor = "#FFFF00"; // Cor da borda padrão

// Seleciona elementos HTML
const canvas = document.getElementById("drawingCanvas") as HTMLCanvasElement;
const context = canvas.getContext("2d")!;
const fillColorInput = document.getElementById("fillColor") as HTMLInputElement;
const borderColorInput = document.getElementById("borderColor") as HTMLInputElement;
const clearButton = document.getElementById("clearButton") as HTMLButtonElement;
const endShapeButton = document.getElementById("endShapeButton") as HTMLButtonElement;
const shapeList = document.getElementById("shapeList") as HTMLUListElement;

// Atualiza a cor de preenchimento e borda com base na seleção do usuário
fillColorInput.addEventListener("input", () => {
    if (selectedShapeIndex !== null) {
        shapes[selectedShapeIndex].fillColor = fillColorInput.value;
        drawAllShapes();
    }
});

borderColorInput.addEventListener("input", () => {
    if (selectedShapeIndex !== null) {
        shapes[selectedShapeIndex].borderColor = borderColorInput.value;
        drawAllShapes();
    }
});

// Função para desenhar todas as formas
function drawAllShapes() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Desenha todas as formas
    for (const shape of shapes) {
        fillPoly(context, shape.vertices, shape.fillColor, shape.borderColor);
    }

    // Desenha a forma atual (em progresso)
    drawCurrentVertices();
}

// Função para desenhar os vértices e linhas da forma atual
function drawCurrentVertices() {
    if (currentPoints.length === 0) return;

    context.beginPath();
    context.moveTo(currentPoints[0].x, currentPoints[0].y);
    for (let i = 1; i < currentPoints.length; i++) {
        context.lineTo(currentPoints[i].x, currentPoints[i].y);
    }
    context.strokeStyle = borderColor;
    context.lineWidth = 2;
    context.stroke();

    // Desenha os pontos individuais
    for (const point of currentPoints) {
        context.beginPath();
        context.arc(point.x, point.y, 3, 0, 2 * Math.PI);
        context.fillStyle = borderColor;
        context.fill();
    }
}

// Função para encerrar a forma atual e adicionar à lista de formas
function createShape() {
    if (currentPoints.length < 3) {
        alert("A forma deve ter pelo menos três pontos.");
        return;
    }

    // Fecha a forma ligando o último ponto ao primeiro
    currentPoints.push(currentPoints[0]);

    // Adiciona a nova forma à lista de formas
    const newShape = new Shape([...currentPoints], fillColor, borderColor);
    shapes.push(newShape);

    // Limpa os pontos atuais e redesenha tudo
    currentPoints = [];
    updateShapeList();
    drawAllShapes();
}

// Função para capturar cliques na tela e adicionar pontos ao polígono atual
canvas.addEventListener("click", (event: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    currentPoints.push(new Point(x, y));
    drawAllShapes();
});

// Evento para o botão de encerrar a forma e criar a forma geométrica
endShapeButton.addEventListener("click", () => {
    createShape();
});

// Função para limpar o canvas e redefinir as formas
clearButton.addEventListener("click", () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    currentPoints = [];
    shapes = [];
    selectedShapeIndex = null;
    updateShapeList();
});

// Função para preencher um polígono com uma cor sólida
function fillPoly(context: CanvasRenderingContext2D, vertices: Point[], fillColor: string, borderColor?: string) {
    if (vertices.length < 3) {
        console.error("O polígono precisa ter pelo menos três vértices.");
        return;
    }

    // Define a cor de preenchimento
    context.fillStyle = fillColor;
    context.strokeStyle = borderColor || fillColor;

    // Desenha o polígono preenchido
    context.beginPath();
    context.moveTo(vertices[0].x, vertices[0].y);
    for (let i = 1; i < vertices.length; i++) {
        context.lineTo(vertices[i].x, vertices[i].y);
    }
    context.closePath();
    context.fill();
    context.stroke();
}

// Função para atualizar a lista de formas no menu
function updateShapeList() {
    shapeList.innerHTML = ""; // Limpa a lista atual
    shapes.forEach((shape, index) => {
        const listItem = document.createElement("li");
        listItem.textContent = `Forma ${index + 1}`;
        
        // Evento de clique para selecionar a forma
        listItem.addEventListener("click", () => {
            selectedShapeIndex = index;
            fillColorInput.value = shape.fillColor;
            borderColorInput.value = shape.borderColor;
            drawAllShapes();
        });
        
        shapeList.appendChild(listItem);
    });
}
