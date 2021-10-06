
const indexUrl = "http://localhost:3000/"

const addEvents = () => {
  document.getElementsByClassName('user')[0].addEventListener("submit", User.login)
}

const addGameButton = () => {
  let [newButton, endButton] = [document.createElement('button'), document.createElement('button')];
  newButton.innerText = "New Game";
  endButton.innerText = "End Game";
  newButton.addEventListener('click', e => {
    new Game
  });

  endButton.addEventListener('click', e => {
    Game.player.x = 160;
    Game.player.y = 160;
  });
  
  Game.canvas.parentNode.insertBefore(newButton, Game.canvas);
  
  Game.canvas.parentNode.insertBefore(endButton, Game.canvas);

  Game.canvas.addEventListener('click', e => {
    const boundCoords = Game.canvas.getBoundingClientRect();
    const coords = Game.coordsInCanvas(e.clientX, e.clientY)
    console.log(`X: ${coords.x}` + `\nY: ${coords.y}`);
    console.log(`X: ${e.clientX}` + `\nY: ${e.clientY}`)
  })
}

document.addEventListener("DOMContentLoaded", e =>{
  addEvents();
  
  Score.loadHighscoreEvent();
  // User.getUsers();
  addGameButton();
})



