     
// Donde me quedé?
document.addEventListener('DOMContentLoaded', () => {
    // Variables globales para los marcadores
    let localPartialScore = 0;
    let visitorPartialScore = 0;
    let firstServer = '1'; // Empieza con L1
    let secondServer = '1'; // Empieza con V1
    let firstServingTeam = 'local'; // El equipo local empieza sirviendo
    let servingTeam = 'local'; // Actualiza con el equipo que está sirviendo

    class TeamData {
        constructor(color, name) {
            // Colores de fondo más suaves
            this.color = color;
            this.name = name;
            this.setsWon = 0;
            this.setScores = []; // Almacenar puntajes de cada set
        }

        getScoreBackgroundColor() {
            // Colores suaves para los equipos
            if (this.color === 'blue') return '#a0c4ff'; // Azul claro
            if (this.color === 'red') return '#f9b8b8'; // Rojo claro
            return '#d0d0d0'; // Gris claro por defecto
        }

            // Registrar el puntaje final del set
        recordSetScore(score) {
            this.setScores.push(score);
        }

        incrementSetsWon() {
            this.setsWon++;
        }
        increaseSetResults(){
            this.sets[this.setsWon].push()
        }
    }

    const localTeam = new TeamData('blue', 'LOCAL');
    const visitorTeam = new TeamData('red', 'VISITOR');

    let serverOrder = setServerOrder(firstServer, secondServer,firstServingTeam);
    let actualServer = serverOrder[0];

    let matchHistory = [];
    /*let point = {
        set,
        number,
        server,
        winLose,
        type,
        shotType,
        player,
        winnerTeam,
        rally,
        dump,
        first,
    }*/

    // funcion que va llenando una matriz historica de cada uno de los puntos jugados
    function setPoint(point) {
        matchHistory.push(point);
    }

    document.getElementById('score-local').addEventListener('click', incrementLocalScore);
    document.getElementById('score-visitor').addEventListener('click', incrementVisitorScore);

    // funcion que rellena el arreglo de orden de servicio
    function setServerOrder(server1, server2, firstTeam) {
        let team1 = firstTeam;
        let team2 = team1 === 'local' ? 'visitor' : 'local';
        let server3 = server1 === '1' ? '2' : '1'; 
        let server4 = server2 === '1' ? '2' : '1';                          
        let tserver1 = {team: team1, server: server1};
        let tserver2 = {team: team2, server: server2};
        let tserver3 = {team: team1, server: server3};
        let tserver4 = {team: team2, server: server4};
        const order = [tserver1, tserver2, tserver3, tserver4];
        return order;
    }

    function checkSetWin() {// Verificar si se gana un set
        const isThirdSet = localTeam.setsWon === 1 && visitorTeam.setsWon === 1;
        const setPointLimit = isThirdSet ? 15 : 21;

        if ((localPartialScore >= setPointLimit || visitorPartialScore >= setPointLimit) &&
            Math.abs(localPartialScore - visitorPartialScore) >= 2) {
            
            if (localPartialScore > visitorPartialScore) {
                localTeam.incrementSetsWon();
                localTeam.recordSetScore(localPartialScore);
                visitorTeam.recordSetScore(visitorPartialScore);
            } else {
                visitorTeam.incrementSetsWon();
                localTeam.recordSetScore(localPartialScore);
                visitorTeam.recordSetScore(visitorPartialScore);
            }

            // Actualizar la interfaz con los puntajes finales
            updateDisplay();

            if (localTeam.setsWon === 2 || visitorTeam.setsWon === 2) {
                alert(`${localTeam.setsWon === 2 ? localTeam.name : visitorTeam.name} ha ganado el partido!`);
                document.getElementById('score-local').removeEventListener('click', incrementLocalScore);
                document.getElementById('score-visitor').removeEventListener('click', incrementVisitorScore);
                console.log(localTeam, visitorTeam);
                return;
            }

            localPartialScore = 0;
            visitorPartialScore = 0;
            updateDisplay();
        }
    }

    function updateScoreBackground(winner) {// Función para actualizar el color de fondo de los marcadores
        const localScoreElem = document.getElementById('score-local');
        const visitorScoreElem = document.getElementById('score-visitor');

        // Restablecer los colores de fondo a gris claro
        localScoreElem.style.backgroundColor = '#d0d0d0';
        visitorScoreElem.style.backgroundColor = '#d0d0d0';

        // Aplicar el color del equipo que ganó el punto
        if (winner === 'local') {
            localScoreElem.style.backgroundColor = localTeam.getScoreBackgroundColor();
        } else if (winner === 'visitor') {
            visitorScoreElem.style.backgroundColor = visitorTeam.getScoreBackgroundColor();
        }
    }

    function incrementLocalScore() {// Modificar las funciones incrementLocalScore e incrementVisitorScore para alternar el servidor
        localPartialScore++;
        updateDisplay();
        updateScoreBackground('local');
        checkSetWin();
        toggleServer('local');
        updateServerDisplay();
    }

    function incrementVisitorScore() {
        visitorPartialScore++;
        updateDisplay();
        updateScoreBackground('visitor');
        checkSetWin();
        toggleServer('visitor');
        updateServerDisplay();
    }

    function toggleServer(winner) {// Función para alternar el servidor cuando cambie el equipo sacador
        if (winner !== servingTeam) { // Solo cambiar el sacador si el equipo que ganó no tenía el saque
            servingTeam = winner; // Actualizar el equipo que obtiene el saque
            actualServer = updateNextServer(actualServer)
        }
    }

    function updateNextServer(server){
        let index = serverOrder.indexOf(server);
        index = (index + 1) % 4;  // index va cambiando de 0 a 3 en bucle para pasar por todos los sacadores
        server = serverOrder[index];
        return server;
    }

    function updateDisplay() {// Función para actualizar los marcadores visuales, incluyendo los sets finales
        document.getElementById('score-local').textContent = localPartialScore;
        document.getElementById('score-visitor').textContent = visitorPartialScore;
        document.getElementById('set-wins-local').textContent = localTeam.setsWon;
        document.getElementById('set-wins-visitor').textContent = visitorTeam.setsWon;

        // Actualizar los puntajes finales de cada set (si existen)
        if (localTeam.setScores.length > 0) {
            document.getElementById('final-set1-score-L').textContent = localTeam.setScores[0] || 0;
            document.getElementById('final-set1-score-V').textContent = visitorTeam.setScores[0] || 0;
        }
        if (localTeam.setScores.length > 1) {
            document.getElementById('final-set2-score-L').textContent = localTeam.setScores[1] || 0;
            document.getElementById('final-set2-score-V').textContent = visitorTeam.setScores[1] || 0;
        }
        if (localTeam.setScores.length > 2) {
            document.getElementById('final-set3-score-L').textContent = localTeam.setScores[2] || 0;
            document.getElementById('final-set3-score-V').textContent = visitorTeam.setScores[2] || 0;
        }
    }

    function updateServerDisplay() {
        const servicePlayerNumberL = document.getElementById('service-player-number-L');
        const servicePlayerNumberV = document.getElementById('service-player-number-V'); 
        const serviceImageL = document.getElementById('service-player-ball-L');
        const serviceImageV = document.getElementById('service-player-ball-V');

        // Limpiar la visibilidad de ambos jugadores
        servicePlayerNumberL.textContent = '';
        servicePlayerNumberV.textContent = '';
        serviceImageL.classList.remove('visible');
        serviceImageV.classList.remove('visible');


        // Mostrar el jugador que está sacando para el equipo local
        if (servingTeam === 'local') {
            servicePlayerNumberL.textContent = actualServer.server;
            serviceImageL.classList.add('visible');
        } 

        // Mostrar el jugador que está sacando para el equipo visitante
        if (servingTeam === 'visitor') {
            servicePlayerNumberV.textContent = actualServer.server;
            serviceImageV.classList.add('visible');
        } 
    }

});

document.addEventListener('DOMContentLoaded', () => {
    const colors = ["#f76c6c", "#9af99a;", "#80acf7", "#f7f794", "#f98ef9", "#00FFFF", "#f7aaaa", "#66bd66", "#000080", "#fab83e", "#835b83", "#a9fcfc"];
    let selectedColorLocal = "#bed5fa";
    let selectedColorVisitor = "#f9caca";

    function togglePalette(paletteId) {
        const palette = document.getElementById(paletteId);
        if (palette) {
            palette.style.display = (palette.style.display === 'none' || palette.style.display === '') ? 'flex' : 'none';
        } else {
            console.error(`No se encontró la paleta con el ID: ${paletteId}`);
        }
    }

    function createColorPalette(paletteId, colorBoxId, opposingColor) {
        const palette = document.getElementById(paletteId);
        const colorBox = document.getElementById(colorBoxId);
        
        if (!palette) {
            console.error(`No se encontró la paleta con el ID: ${paletteId}`);
            return;
        }
        
        colors.forEach(color => {
            const colorDiv = document.createElement('div');
            colorDiv.style.backgroundColor = color;
            colorDiv.style.width = '30px';
            colorDiv.style.height = '30px';
            colorDiv.style.borderRadius = '5px';
            colorDiv.style.cursor = 'pointer';
            colorDiv.addEventListener('click', () => {
                if (color !== opposingColor) {
                    if (colorBox) {
                        colorBox.style.backgroundColor = color;
                    } else {
                        console.error(`No se encontró el cuadro de color con el ID: ${colorBoxId}`);
                    }
                    palette.style.display = 'none';
                    if (paletteId === 'color-palette-local') {
                        selectedColorLocal = color;
                    } else {
                        selectedColorVisitor = color;
                    }
                } else {
                    alert('Este color ya ha sido seleccionado por el otro equipo. Por favor, elige otro color.');
                }
            });
            palette.appendChild(colorDiv);
        });
    }

    createColorPalette('color-palette-local', 'team-local-color-box', selectedColorVisitor);
    createColorPalette('color-palette-visitor', 'team-visitor-color-box', selectedColorLocal);

    // Añadir un evento de clic al cuadro de color para mostrar la paleta de colores
    const localColorBox = document.getElementById('team-local-color-box');
    const visitorColorBox = document.getElementById('team-visitor-color-box');
    // Inicializar el color de cada equipo
    localColorBox.style.backgroundColor = "#bed5fa";
    visitorColorBox.style.backgroundColor = "#f9caca";

    if (localColorBox) {
        localColorBox.addEventListener('click', () => {
            togglePalette('color-palette-local');
        });
    } else {
        console.error('No se encontró el cuadro de color del equipo local.');
    }

    if (visitorColorBox) {
        visitorColorBox.addEventListener('click', () => {
            togglePalette('color-palette-visitor');
        });
    } else {
        console.error('No se encontró el cuadro de color del equipo visitante.');
    }
});




        