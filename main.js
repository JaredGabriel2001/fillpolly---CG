var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
// Classe para representar um ponto 2D
var Point = /** @class */ (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    return Point;
}());
// Classe para representar uma forma geométrica
var Shape = /** @class */ (function () {
    function Shape(vertices, fillColor, borderColor) {
        this.vertices = vertices;
        this.fillColor = fillColor;
        this.borderColor = borderColor;
    }
    return Shape;
}());
// Variáveis globais
var currentPoints = []; // Pontos da forma atual
var shapes = []; // Lista de formas criadas
var selectedShapeIndex = null; // Índice da forma selecionada
var fillColor = "#0000ff"; // Cor de preenchimento padrão
var borderColor = "#FFFF00"; // Cor da borda padrão
// Seleciona elementos HTML
var canvas = document.getElementById("drawingCanvas");
var context = canvas.getContext("2d");
var fillColorInput = document.getElementById("fillColor");
var borderColorInput = document.getElementById("borderColor");
var clearButton = document.getElementById("clearButton");
var endShapeButton = document.getElementById("endShapeButton");
var shapeList = document.getElementById("shapeList");
// Atualiza a cor de preenchimento e borda com base na seleção do usuário
fillColorInput.addEventListener("input", function () {
    if (selectedShapeIndex !== null) {
        shapes[selectedShapeIndex].fillColor = fillColorInput.value;
        drawAllShapes();
    }
});
borderColorInput.addEventListener("input", function () {
    if (selectedShapeIndex !== null) {
        shapes[selectedShapeIndex].borderColor = borderColorInput.value;
        drawAllShapes();
    }
});
// Função para desenhar todas as formas
function drawAllShapes() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    // Desenha todas as formas
    for (var _i = 0, shapes_1 = shapes; _i < shapes_1.length; _i++) {
        var shape = shapes_1[_i];
        fillPoly(context, shape.vertices, shape.fillColor, shape.borderColor);
    }
    // Desenha a forma atual (em progresso)
    drawCurrentVertices();
}
// Função para desenhar os vértices e linhas da forma atual
function drawCurrentVertices() {
    if (currentPoints.length === 0)
        return;
    context.beginPath();
    context.moveTo(currentPoints[0].x, currentPoints[0].y);
    for (var i = 1; i < currentPoints.length; i++) {
        context.lineTo(currentPoints[i].x, currentPoints[i].y);
    }
    context.strokeStyle = borderColor;
    context.lineWidth = 2;
    context.stroke();
    // Desenha os pontos individuais
    for (var _i = 0, currentPoints_1 = currentPoints; _i < currentPoints_1.length; _i++) {
        var point = currentPoints_1[_i];
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
    var newShape = new Shape(__spreadArray([], currentPoints, true), fillColor, borderColor);
    shapes.push(newShape);
    // Limpa os pontos atuais e redesenha tudo
    currentPoints = [];
    updateShapeList();
    drawAllShapes();
}
// Função para capturar cliques na tela e adicionar pontos ao polígono atual
canvas.addEventListener("click", function (event) {
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    currentPoints.push(new Point(x, y));
    drawAllShapes();
});
// Evento para o botão de encerrar a forma e criar a forma geométrica
endShapeButton.addEventListener("click", function () {
    createShape();
});
// Função para limpar o canvas e redefinir as formas
clearButton.addEventListener("click", function () {
    context.clearRect(0, 0, canvas.width, canvas.height);
    currentPoints = [];
    shapes = [];
    selectedShapeIndex = null;
    updateShapeList();
});
// Função para preencher um polígono com uma cor sólida
function fillPoly(context, vertices, fillColor, borderColor) {
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
    for (var i = 1; i < vertices.length; i++) {
        context.lineTo(vertices[i].x, vertices[i].y);
    }
    context.closePath();
    context.fill();
    context.stroke();
}
// Função para atualizar a lista de formas no menu
function updateShapeList() {
    shapeList.innerHTML = ""; // Limpa a lista atual
    shapes.forEach(function (shape, index) {
        var listItem = document.createElement("li");
        listItem.textContent = "Forma ".concat(index + 1);
        // Evento de clique para selecionar a forma
        listItem.addEventListener("click", function () {
            selectedShapeIndex = index;
            fillColorInput.value = shape.fillColor;
            borderColorInput.value = shape.borderColor;
            drawAllShapes();
        });
        shapeList.appendChild(listItem);
    });
}
