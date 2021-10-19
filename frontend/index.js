
const indexUrl = "http://localhost:3000/"

const addGameButton = () => {
  
  let newButton = document.createElement('button');

  newButton.innerText = "New Game";

  newButton.addEventListener('click', e => {
    new Game
  });

  Game.canvas.parentNode.insertBefore(newButton, Game.canvas);
}

document.addEventListener("DOMContentLoaded", e =>{
  
  Score.fetchScores();
  User.getUsers();
  
  addGameButton();
})



