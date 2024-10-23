//ponto 2D
class Point {
    constructor(public x: number, public y: number) {}
}

//forma geométrica
class Shape {
    constructor(public vertices: Point[], public fillColor: string, public borderColor: string) {}
}

let currentPoints: Point[] = []; // Pontos da forma atual
let shapes: Shape[] = []; // Lista de formas criadas
let selectedShapeIndex: number | null = null; // usada para funçao q limpa formas da tela

const defaultBorderColor = "#FFFF00"; 
const canvas = document.getElementById("drawingCanvas") as HTMLCanvasElement;
const context = canvas.getContext("2d")!;
const clearButton = document.getElementById("clearButton") as HTMLButtonElement;
const endShapeButton = document.getElementById("endShapeButton") as HTMLButtonElement;
const shapeList = document.getElementById("shapeList") as HTMLUListElement;

// desenhar no canvas
function drawAllShapes() {
    context.clearRect(0, 0, canvas.width, canvas.height); //primeiro garante que a area vai estar limpa
    for (const shape of shapes) {
        fillPoly(context, shape.vertices, shape.fillColor, shape.borderColor); // chama a função para pintar os poligonos/formas geometricas armazenadas na lista "shapes"
    }
    drawCurrentVertices(); // chama a funçao responsavel por desenhar as arestas e vertices
}

//desenha os vertices exibidos antes de encerrar o poligono
function drawCurrentVertices() {
    if (currentPoints.length === 0) return;
    context.beginPath(); //inicio da inserçaõ
    context.moveTo(currentPoints[0].x, currentPoints[0].y); //move o pincel para o primeiro ponto inserido 
    for (let i = 1; i < currentPoints.length; i++) {
        context.lineTo(currentPoints[i].x, currentPoints[i].y);  //desenha as linhas a partir dos pontos inseridos e os conecta
    }
    context.strokeStyle = defaultBorderColor; //cor da borda/arestas amarela
    context.lineWidth = 2; //2 pixels para a largura da linha
    context.stroke(); //traça as linhass
    for (const point of currentPoints) {
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
    const newShape = new Shape([...currentPoints], "#ffffff", defaultBorderColor); //adiciona o poligono atual na lista de poligonos criados
    shapes.push(newShape);
    currentPoints = []; //limpa para a criação de novos poligono
    updateShapeList();  //exibe na tela o novo poligono
    drawAllShapes(); //redesenha todas as formas criadas atualmente
}

canvas.addEventListener("click", (event: MouseEvent) => {
    const rect = canvas.getBoundingClientRect(); //retorna o tamanho e a posição do canvas em relação ao viewport
    const x = event.clientX - rect.left; //event.clientX é a coordenada x do clique do usuário relativa à janela do navegador, que subtrai a distância entre o lado esquerdo da janela e o lado esquerdo do canvas
    const y = event.clientY - rect.top;
    currentPoints.push(new Point(x, y)); //adiciona o ponto criado à lista de pontos
    drawAllShapes(); //redesenha todas as formas criadas atualmente
});

// encerrar forma geometrica, ligar ponto inicial ao final
endShapeButton.addEventListener("click", () => {
    createShape(); //cria o poligono atual para ser adicionada à lista de poligonos
});

// limpar o canvas, retirar todas as formas geometricas desenhadas 
clearButton.addEventListener("click", () => {
    context.clearRect(0, 0, canvas.width, canvas.height); //context.clearRect(x, y, width, height):
    currentPoints = [];
    shapes = [];
    selectedShapeIndex = null;
    updateShapeList();
});

//fillpoly para pintar os poligonos
function fillPoly(context: CanvasRenderingContext2D, vertices: Point[], fillColor: string, borderColor?: string) {
    if (vertices.length < 3) {
        console.error("O polígono precisa ter pelo menos três vértices.");
        return;
    }

    let minY = Infinity, maxY = -Infinity;      //define os extremos do poligono
    for (const vertex of vertices) {            //itera por cada vértice no array vertices
        if (vertex.y < minY) minY = vertex.y;   //atualiza minY se o y do vértice atual for menor
        if (vertex.y > maxY) maxY = vertex.y;   //atualiza maxY se o y do vértice atual for maior
    }

    //pintar linha por linha 
    for (let y = Math.ceil(minY); y <= Math.floor(maxY); y++) { //varre o polígono de minY até maxY e calcula as interseções dos segmentos do polígono com cada linha y
        let intersections: number[] = [];    //array que armazena as interseções dos segmentos do polígono com a linha y atual.
        for (let i = 0, len = vertices.length; i < len; i++) {
            const v1 = vertices[i];
            const v2 = vertices[(i + 1) % len]; //garante que o vertice inicial e final estao conectados

            if ((v1.y <= y && v2.y > y) || (v2.y <= y && v1.y > y)) {  //verifica se o segmento está entre os vertices e cruza y
                const intersectX = v1.x + ((y - v1.y) * (v2.x - v1.x)) / (v2.y - v1.y);  //onde x cruza a linha y
                intersections.push(intersectX);
            }
        }

        intersections.sort((a, b) => a - b); //ordenando da esquerda para direita para garantir o preenchimento correto

        context.fillStyle = fillColor;
        for (let i = 0; i < intersections.length; i += 2) {
            const xStart = Math.ceil(intersections[i]);
            const xEnd = Math.floor(intersections[i + 1]);
            context.fillRect(xStart, y, xEnd - xStart, 1); //context.fillRect(x, y, width, height), ou seja, a linha percorrida
        }
    }

    if (borderColor) {
        context.strokeStyle = borderColor;
        context.beginPath();   //inicia a pintura da borda
        context.moveTo(vertices[0].x, vertices[0].y);
        for (let i = 1, len = vertices.length; i < len; i++) {
            context.lineTo(vertices[i].x, vertices[i].y);  //desenha do ponto inicial ate o ultimo vertice
        }
        context.closePath(); //encerra a pintura
        context.stroke(); //aplica a cor definida, amarelo neste caso
    }
}

//atualiza a lista de formas exibidas na interface do usuário
function updateShapeList() {
    shapeList.innerHTML = ""; // Limpa a lista atual
    shapes.forEach((shape, index) => {
        const listItem = document.createElement("li");

        const shapeInfo = document.createElement("span"); //cria um span para o nome dos poligonos
        shapeInfo.textContent = `Forma ${index + 1}: `;

        const fillColorInput = document.createElement("input"); //cria um input de cor para cada poligono inserido
        fillColorInput.type = "color";
        fillColorInput.value = shape.fillColor;
        fillColorInput.addEventListener("input", () => { //possibilita ao usuario mudar a cor de preenchimento de cada poligono de forma individual 
            shape.fillColor = fillColorInput.value;
            drawAllShapes();
        });

        const borderColorInput = document.createElement("input"); //cria um input para alterar as arestas/bordas do poligono
        borderColorInput.type = "color";
        borderColorInput.value = shape.borderColor;
        borderColorInput.addEventListener("input", () => { //possibilita ao usuario mudar a cor de borda de cada poligono de forma individual 
            shape.borderColor = borderColorInput.value;
            drawAllShapes();
        });

        const deleteButton = document.createElement("button"); //cria um botao para deletar os poligonos de fomra individual
        deleteButton.textContent = "Excluir";
        deleteButton.addEventListener("click", () => { //ao clicar no botao, a forma/poligono é excluida da lista de poligonos e a list é atualizada
            shapes.splice(index, 1);
            updateShapeList();
            drawAllShapes();
        });

        listItem.appendChild(shapeInfo);         //é um elemento span que contém o texto com o índice e a descrição da forma (por exemplo, "Forma 1:")
        listItem.appendChild(fillColorInput);    //é um elemento input do tipo color que permite ao usuário selecionar a cor do preenchimento da forma
        listItem.appendChild(borderColorInput);  //é um elemento input do tipo color que permite ao usuário selecionar a cor da borda da forma
        listItem.appendChild(deleteButton);      //é um elemento button que permite ao usuário excluir a forma
        
        shapeList.appendChild(listItem); //Adiciona o item da lista (listItem), que agora contém todas as informações e controles para uma forma, ao elemento shapeList
    });
}
