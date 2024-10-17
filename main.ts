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

const defaultBorderColor = "#FFFF00"; // Cor da borda padrão

// Seleciona elementos HTML
const canvas = document.getElementById("drawingCanvas") as HTMLCanvasElement;
const context = canvas.getContext("2d")!;
const clearButton = document.getElementById("clearButton") as HTMLButtonElement;
const endShapeButton = document.getElementById("endShapeButton") as HTMLButtonElement;
const shapeList = document.getElementById("shapeList") as HTMLUListElement;

// Função para desenhar todas as formas
function drawAllShapes() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (const shape of shapes) {
        fillPoly(context, shape.vertices, shape.fillColor, shape.borderColor);
    }
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
    context.strokeStyle = defaultBorderColor;
    context.lineWidth = 2;
    context.stroke();
    for (const point of currentPoints) {
        context.beginPath();
        context.arc(point.x, point.y, 3, 0, 2 * Math.PI);
        context.fillStyle = defaultBorderColor;
        context.fill();
    }
}

// Função para encerrar a forma atual e adicionar à lista de formas
function createShape() {
    if (currentPoints.length < 3) {
        alert("A forma deve ter pelo menos três pontos.");
        return;
    }
    currentPoints.push(currentPoints[0]);
    const newShape = new Shape([...currentPoints], "#0000ff", defaultBorderColor);
    shapes.push(newShape);
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
    context.fillStyle = fillColor;
    context.strokeStyle = borderColor || fillColor;
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

        const shapeInfo = document.createElement("span");
        shapeInfo.textContent = `Forma ${index + 1}: `;

        const fillColorInput = document.createElement("input");
        fillColorInput.type = "color";
        fillColorInput.value = shape.fillColor;
        fillColorInput.addEventListener("input", () => {
            shape.fillColor = fillColorInput.value;
            drawAllShapes();
        });

        const borderColorInput = document.createElement("input");
        borderColorInput.type = "color";
        borderColorInput.value = shape.borderColor;
        borderColorInput.addEventListener("input", () => {
            shape.borderColor = borderColorInput.value;
            drawAllShapes();
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Excluir";
        deleteButton.addEventListener("click", () => {
            shapes.splice(index, 1);
            updateShapeList();
            drawAllShapes();
        });

        listItem.appendChild(shapeInfo);
        listItem.appendChild(fillColorInput);
        listItem.appendChild(borderColorInput);
        listItem.appendChild(deleteButton);
        
        shapeList.appendChild(listItem);
    });
}
