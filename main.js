var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
//ponto 2D
var Point = /** @class */ (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    return Point;
}());
//forma geométrica
var Shape = /** @class */ (function () {
    function Shape(vertices, fillColor, borderColor) {
        this.vertices = vertices;
        this.fillColor = fillColor;
        this.borderColor = borderColor;
    }
    return Shape;
}());
var currentPoints = []; // Pontos da forma atual
var shapes = []; // Lista de formas criadas
var selectedShapeIndex = null; // usada para funçao q limpa formas da tela
var defaultBorderColor = "#FFFF00";
var canvas = document.getElementById("drawingCanvas");
var context = canvas.getContext("2d");
var clearButton = document.getElementById("clearButton");
var endShapeButton = document.getElementById("endShapeButton");
var shapeList = document.getElementById("shapeList");
// desenhar no canvas
function drawAllShapes() {
    context.clearRect(0, 0, canvas.width, canvas.height); //primeiro garante que a area vai estar limpa
    for (var _i = 0, shapes_1 = shapes; _i < shapes_1.length; _i++) {
        var shape = shapes_1[_i];
        fillPoly(context, shape.vertices, shape.fillColor, shape.borderColor); // chama a função para pintar os poligonos/formas geometricas armazenadas na lista "shapes"
    }
    drawCurrentVertices(); // chama a funçao responsavel por desenhar as arestas e vertices
}
//desenha os vertices exibidos antes de encerrar o poligono
function drawCurrentVertices() {
    if (currentPoints.length === 0)
        return;
    context.beginPath(); //inicio da inserçaõ
    context.moveTo(currentPoints[0].x, currentPoints[0].y); //move o pincel para o primeiro ponto inserido 
    for (var i = 1; i < currentPoints.length; i++) {
        context.lineTo(currentPoints[i].x, currentPoints[i].y); //desenha as linhas a partir dos pontos inseridos e os conecta
    }
    context.strokeStyle = defaultBorderColor; //cor da borda/arestas amarela
    context.lineWidth = 2; //2 pixels para a largura da linha
    context.stroke(); //traça as linhass
    for (var _i = 0, currentPoints_1 = currentPoints; _i < currentPoints_1.length; _i++) {
        var point = currentPoints_1[_i];
        context.beginPath();
        context.arc(point.x, point.y, 3, 0, 2 * Math.PI); //tamanho do ciruculo dos pontos, 3 pixels
        context.fillStyle = defaultBorderColor; //define a cor como amarela
        context.fill(); //preenche o circulo com a cor amarela
    }
}
// valida o poligono e caso for valido, insere na lista de poligonos/formas
function createShape() {
    if (currentPoints.length < 3) {
        alert("A forma deve ter pelo menos três pontos.");
        return;
    }
    currentPoints.push(currentPoints[0]); //conecta o ultimo ponto atual ao primeiro
    var newShape = new Shape(__spreadArray([], currentPoints, true), "#ffffff", defaultBorderColor); //adiciona o poligono atual na lista de poligonos criados
    shapes.push(newShape);
    currentPoints = []; //limpa para a criação de novos poligono
    updateShapeList(); //exibe na tela o novo poligono
    drawAllShapes(); //redesenha todas as formas criadas atualmente
}
canvas.addEventListener("click", function (event) {
    var rect = canvas.getBoundingClientRect(); //retorna o tamanho e a posição do canvas em relação ao viewport
    var x = event.clientX - rect.left; //event.clientX é a coordenada x do clique do usuário relativa à janela do navegador, que subtrai a distância entre o lado esquerdo da janela e o lado esquerdo do canvas
    var y = event.clientY - rect.top;
    currentPoints.push(new Point(x, y)); //adiciona o ponto criado à lista de pontos
    drawAllShapes(); //redesenha todas as formas criadas atualmente
});
// encerrar forma geometrica, ligar ponto inicial ao final
endShapeButton.addEventListener("click", function () {
    createShape(); //cria o poligono atual para ser adicionada à lista de poligonos
});
// limpar o canvas, retirar todas as formas geometricas desenhadas 
clearButton.addEventListener("click", function () {
    context.clearRect(0, 0, canvas.width, canvas.height); //context.clearRect(x, y, width, height):
    currentPoints = [];
    shapes = [];
    selectedShapeIndex = null;
    updateShapeList();
});
//fillpoly para pintar os poligonos
function fillPoly(context, vertices, fillColor, borderColor) {
    if (vertices.length < 3) {
        console.error("O polígono precisa ter pelo menos três vértices.");
        return;
    }
    var minY = Infinity, maxY = -Infinity; //define os extremos do poligono
    for (var _i = 0, vertices_1 = vertices; _i < vertices_1.length; _i++) { //itera por cada vértice no array vertices
        var vertex = vertices_1[_i];
        if (vertex.y < minY)
            minY = vertex.y; //atualiza minY se o y do vértice atual for menor
        if (vertex.y > maxY)
            maxY = vertex.y; //atualiza maxY se o y do vértice atual for maior
    }
    for (var y = Math.ceil(minY); y <= Math.floor(maxY); y++) { //varre o polígono de minY até maxY e calcula as interseções dos segmentos do polígono com cada linha y
        var intersections = []; //array que armazena as interseções dos segmentos do polígono com a linha y atual.
        for (var i = 0, len = vertices.length; i < len; i++) {
            var v1 = vertices[i];
            var v2 = vertices[(i + 1) % len]; //garante que o vertice inicial e final estao conectados
            if ((v1.y <= y && v2.y > y) || (v2.y <= y && v1.y > y)) { //verifica se o segmento está entre os vertices e cruza y
                var intersectX = v1.x + ((y - v1.y) * (v2.x - v1.x)) / (v2.y - v1.y); //onde x cruza a linha y
                intersections.push(intersectX);
            }
        }
        intersections.sort(function (a, b) { return a - b; }); //ordenando da esquerda para direita para garantir o preenchimento correto
        //pintar pixel a pixel
        context.fillStyle = fillColor;
        for (var i = 0; i < intersections.length; i += 2) {
            var xStart = Math.ceil(intersections[i]);
            var xEnd = Math.floor(intersections[i + 1]);
            for (var k = xStart; k < xEnd; k++) {
                context.fillRect(k, y, 1, 1); //context.fillRect(x, y, width, height), ou seja, pintando pixel a pixel
            }
        }
        //metodo de pintar linha a linha
        //context.fillStyle = fillColor;
        //for (let i = 0; i < intersections.length; i += 2) {
        //    const xStart = Math.ceil(intersections[i]);
        //   const xEnd = Math.floor(intersections[i + 1]);
        //    context.fillRect(xStart, y, xEnd - xStart, 1); //context.fillRect(x, y, width, height), ou seja, a linha percorrida
        //}
    }
    if (borderColor) {
        context.strokeStyle = borderColor;
        context.beginPath(); //inicia a pintura da borda
        context.moveTo(vertices[0].x, vertices[0].y);
        for (var i = 1, len = vertices.length; i < len; i++) {
            context.lineTo(vertices[i].x, vertices[i].y); //desenha do ponto inicial ate o ultimo vertice
        }
        context.closePath(); //encerra a pintura
        context.stroke(); //aplica a cor definida, amarelo neste caso
    }
}
//atualiza a lista de formas exibidas na interface do usuário
function updateShapeList() {
    shapeList.innerHTML = ""; // Limpa a lista atual
    shapes.forEach(function (shape, index) {
        var listItem = document.createElement("li");
        var shapeInfo = document.createElement("span"); //cria um span para o nome dos poligonos
        shapeInfo.textContent = "Forma ".concat(index + 1, ": ");
        var fillColorInput = document.createElement("input"); //cria um input de cor para cada poligono inserido
        fillColorInput.type = "color";
        fillColorInput.value = shape.fillColor;
        fillColorInput.addEventListener("input", function () {
            shape.fillColor = fillColorInput.value;
            drawAllShapes();
        });
        var borderColorInput = document.createElement("input"); //cria um input para alterar as arestas/bordas do poligono
        borderColorInput.type = "color";
        borderColorInput.value = shape.borderColor;
        borderColorInput.addEventListener("input", function () {
            shape.borderColor = borderColorInput.value;
            drawAllShapes();
        });
        var deleteButton = document.createElement("button"); //cria um botao para deletar os poligonos de fomra individual
        deleteButton.textContent = "Excluir";
        deleteButton.addEventListener("click", function () {
            shapes.splice(index, 1);
            updateShapeList();
            drawAllShapes();
        });
        listItem.appendChild(shapeInfo); //é um elemento span que contém o texto com o índice e a descrição da forma (por exemplo, "Forma 1:")
        listItem.appendChild(fillColorInput); //é um elemento input do tipo color que permite ao usuário selecionar a cor do preenchimento da forma
        listItem.appendChild(borderColorInput); //é um elemento input do tipo color que permite ao usuário selecionar a cor da borda da forma
        listItem.appendChild(deleteButton); //é um elemento button que permite ao usuário excluir a forma
        shapeList.appendChild(listItem); //Adiciona o item da lista (listItem), que agora contém todas as informações e controles para uma forma, ao elemento shapeList
    });
}
