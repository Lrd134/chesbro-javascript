
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
}

document.addEventListener("DOMContentLoaded", e =>{
  addEvents();
  User.getUsers();
  addGameButton();
})
class Enemy {
  constructor(x = 150, y = 150, lw = 10) {
    this.x = x;
    this.y = y;
    this.lw = lw;
  }
}
class Player {
  // static canvas = Game.canvas;
  static current_player;
  constructor(x = 8, y = 8, radius= 4) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    
    Player.current_player = this;
  }
  move(e) {
    switch(e.key){

    case ('a'): {
      if (Player.current_player.x > 8)
        Player.current_player.x -= Game.dx;
      break;
    }
    
    case('d'): {
      if (Player.current_player.x < 472)
        Player.current_player.x += Game.dx;
      break;
    }

    case('w'): {
      if (Player.current_player.y > 8)
        Player.current_player.y -= Game.dy;
      break;
    }

    case('s'): {
      if (Player.current_player.y < 312)
        Player.current_player.y += Game.dy;
      break;
    }

    case('ArrowRight'): {
      if (Player.current_player.x < 472)
        Player.current_player.x += Game.dx;
      break;
    }

    case('ArrowLeft'): {
      if (Player.current_player.x > 8)
        Player.current_player.x -= Game.dx;
      break;
    }

    case('ArrowUp'): {
      if (Player.current_player.y > 8)
        Player.current_player.y -= Game.dy;
      break;
    }

    case('ArrowDown'): {
      if (Player.current_player.y < 312)
        Player.current_player.y += Game.dy;
      break;
    }
    default:
      console.log(e.key + " is not usable input.");
    }
  }

}

class Game {
  static canvas = document.getElementById('gameBackground');
  static ctx = Game.canvas.getContext('2d');
  static dx = 8;
  static dy = 8;
  static player = new Player();
  static enemies = [ new Enemy, new Enemy(280, 100, 15)];
  static thisGame;
  static restartBox = { x: Game.canvas.width / 2 - 40,
                      y: Game.canvas.height - 90,
                      width: 80,
                      height: 30
                    }
  constructor() {
    Game.draw();
    Game.thisGame = this
  }

  static draw() { 
    const deltaTime = setTimeout(Game.draw, 30);
    Game.ctx.clearRect(0, 0, Game.canvas.width, Game.canvas.height);
    Game.drawPlayer();
    Game.drawEnemy();
    document.addEventListener('keydown', Game.player.move);
    if (Game.collisionWithEnemy()) {
      clearInterval(deltaTime);
      Game.ctx.beginPath();
      Game.ctx.clearRect(0, 0, Game.canvas.width, Game.canvas.height);
      Game.ctx.fillRect(Game.restartBox.x, Game.restartBox.y, Game.restartBox.width, Game.restartBox.height)
      Game.ctx.closePath();
      Game.ctx.font = '30px Times New Roman';
      Game.ctx.textAlign = "center";
      Game.ctx.fillStyle = "red";
      Game.ctx.fillText("GAME OVER", Game.canvas.width / 2, Game.canvas.height * 0.25)
      Game.canvas.addEventListener('click', Game.gameOverEvent)
    }
    else
      deltaTime;
  }
  static gameOverEvent(e){
      let coords = Game.coordsInCanvas(e.clientX, e.clientY);
      if (Game.collisionWithRestart(coords, Game.restartBox)) {
        console.log("Trying to restart with coords " + coords);
        delete Game.thisGame
        new Game
      }
      else
        Game.canvas.addEventListener('click', this.gameOverEvent);
  }
  static drawEnemy(interval) {
    for (let enemy of Game.enemies){
      Game.ctx.beginPath();
      Game.ctx.fillStyle = 'red';
      Game.ctx.fillRect(enemy.x, enemy.y, enemy.lw, enemy.lw);
      Game.ctx.closePath();
    }

  }
  static drawPlayer(){
    Game.ctx.beginPath();
    Game.ctx.arc(Game.player.x, Game.player.y, Game.player.radius, 0, Math.PI * 2, false);
    Game.ctx.fillStyle = 'blue';
    Game.ctx.fill();
    Game.ctx.closePath();
  }
  static collisionWithEnemy() {
    for (let enemy of Game.enemies){
      if (Game.player.x + Game.player.radius > enemy.x 
        && Game.player.y > enemy.y 
        && Game.player.x - Game.player.radius < enemy.x + enemy.lw 
        && Game.player.y - Game.player.radius < enemy.y + enemy.lw)
        return true;
    }
  }

  static collisionWithRestart(coords, restartBox) {
    let boundRect = Game.canvas.getBoundingClientRect();
    let boxCoords = Game.coordsInCanvas(restartBox.x + boundRect.left, restartBox.y + boundRect.top);
    if (coords.x < boxCoords.x + restartBox.width &&
      coords.x > boxCoords.x &&
      coords.y < boxCoords.y + restartBox.height &&
      coords.y > boxCoords.y)
      return true;
  }

  static coordsInCanvas(clientX, clientY) {
    let boundRect = Game.canvas.getBoundingClientRect();
    return { x: clientX - boundRect.left * (Game.canvas.width / boundRect.x),
            y: clientY - boundRect.top * (Game.canvas.height / boundRect.y)
    }
    
  }
}

class User {

  static all = [];
  constructor(id, name = "Example", highscore = 0) {
    this.id = parseInt(id, 10);
    this.name = name;
    this.highscore = parseInt(highscore, 10);
    User.all.push(this);
  }

  static fromJson(json) {
    let user = User.all.find(e => {
      if (parseInt(json.data.id, 10) === e.id) return e;
      })
    if (!user){
      return new User(parseInt(json.data.id, 10), json.data.attributes.name, parseInt(json.data.attributes.highscore, 10)) 
    } else
    return user;
  }

  
  static getUsers() {

    fetch(indexUrl + "users").then(resp => resp.json()).then(json => {
      json.data.forEach(e =>{
        new User(e.id, e.attributes.name, e.attributes.highscore)
      });
      this.renderHighscores();
    }).catch(error => error);

  }

  static removeFromAll(name) {
    User.all = User.all.filter(e => {
      if (e.name !== name) return e; 
    })
  }

  static updateUser(e) {
    
    const updateConfigObj = (name = "", highscore = 0) => {
      
      return {
                headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json"
                },
                method: "POST",
                body: JSON.stringify({
                      user: {
                              newName: name,
                              highscore: highscore
                      }})
              }
                
    }
    
    let newName;
    
    for (let input of e.target.children) {
      if (input.type === "text") {
        newName = input.value;
      }
    }
    e.preventDefault();
    
    let userName = e.target.parentElement.innerText.split(" ")[0];
    User.removeFromAll(userName)
    
    fetch(indexUrl + `users/${userName}`, updateConfigObj(newName)).
    then(resp => resp.json()).then(json => {
      User.fromJson(json).login();
  })
  }

  static login(e) {

    e.preventDefault()
    const createConfigObj = (userName, userHighscore = 0) => {
      return {
    
      headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
      },
      method: "POST",
      body: JSON.stringify({
              user: {
                      name: userName,
                      highscore: userHighscore
              }})
      }
    }
    let userName;
    for (let child of e.target.children){ 
      if ( child.classList.value === "user-name" )  {
          userName = child.value;
      }
    }
    
    if (userName && userName !== '') {
      fetch(indexUrl + `users`, createConfigObj(userName)).then(resp => resp.json()).then(json => User.fromJson(json).login());
    }
    else
    {
      Helper.createAlert({
        message: "You must provide a username!"
      })
    }
  }

  static renderHighscores() {

    const users = this.all;
    const highscoreDiv = document.getElementsByClassName('highscore')[0];
    const ul = document.createElement('ul');
    users.map(e => {
      const li = document.createElement('li');
      li.classList.add('highscore-actual');
      li.innerText = `${e.name} has a highscore of ${e.highscore}.`
      ul.appendChild(li);
    })
    Helper.removeChildElements(highscoreDiv);
    highscoreDiv.appendChild(ul);
    
  }
  
  static destroyConfigObj(name) {

    return {
  
      headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
      },
      method: "DELETE",
      body: JSON.stringify({
              user: {
                      name: name
              }})
    }
    
  }

  createUserButtons() {

    const userEditFormEvent = (e) => {
      const loginDiv = document.getElementsByClassName('login')[0];
      const editForm = document.createElement('form');
      const nameInput = document.createElement('input');
      const nameSubmit = document.createElement('input');
      nameInput.type = "text";
      nameInput.placeholder = `${this.name}`;
      nameSubmit.type = "submit";
      nameSubmit.value = "Change Name";
      nameInput.classList.add('edit', 'user');
      nameSubmit.classList.add('edit', 'user');
      editForm.appendChild(nameInput);
      editForm.appendChild(nameSubmit);
      editForm.addEventListener('submit', User.updateUser);
      loginDiv.appendChild(editForm);
    }

    const createLogoutButton = () => {
      let logoutButton = document.createElement('button');
      logoutButton.innerText = `Logout`;
      logoutButton.classList.add('logout');
      logoutButton.addEventListener('click', e => {
        document.getElementsByClassName('login')[0].classList.add('hidden');
      })
      return logoutButton
    }

    const createEditButton = () => {
      let editButton = document.createElement('button');
      editButton.classList.add('edit');
      editButton.innerText = `Edit ${this.name}`;
      editButton.addEventListener('click', userEditFormEvent);
      return editButton;
    }

    const createDeleteButton = () => {
      let userName = this.name;
      let deleteButton = document.createElement('button');
      deleteButton.classList.add('delete');
      deleteButton.innerText = `Delete ${userName}`;
      deleteButton.addEventListener('click', function(e){      
        fetch(indexUrl + `users/${userName}`, User.destroyConfigObj(userName)).then(resp => resp.json()).then(json => {
            Helper.createAlert(json);
            document.getElementsByClassName('login')[0].classList.add('hidden');
            User.removeFromAll(userName);
            User.renderHighscores();
        })
      })
      return deleteButton;
      
  
    }

    return {
      deleteButton: createDeleteButton(),
      editButton: createEditButton(),
      logoutButton: createLogoutButton()
    }

  }

  login() {
    const loginDiv = document.getElementsByClassName('login')[0];
    let buttons = this.createUserButtons()

    loginDiv.innerText = `${this.name} is Currently Logged in.`
    loginDiv.classList.remove('hidden');

    for (let button in buttons) {
      buttons[button].classList.add('user');
      loginDiv.appendChild(buttons[button])
    }
    User.renderHighscores();
  }
 
}

class Helper {

  static removeChildElements(parent) {
    if (parent.children.length > 0){
      for (let int = 0; int < parent.children.length; int++)
      {
        parent.removeChild(parent.children[int]);
      }
    } 
  }
  static createAlert(objectWithMessage = {
    message: "Error has occured."
  }) {
    const alert = document.getElementsByClassName('alert')[0]
    alert.classList.remove('hidden');
    alert.innerText = objectWithMessage.message
    setTimeout(e => {
      alert.classList.add('hidden')
    }, 7500)
  }
}