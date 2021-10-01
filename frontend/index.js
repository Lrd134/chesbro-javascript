
const indexUrl = "http://localhost:3000/"

const addEvents = () => {
  document.getElementsByClassName('user')[0].addEventListener("submit", User.login)
}


document.addEventListener("DOMContentLoaded", e =>{
  addEvents();
  User.getUsers();
})

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
  constructor() {
    Game.draw();
  }


  static draw() { 
    Game.ctx.clearRect(0, 0, Game.canvas.width, Game.canvas.height);
    Game.drawPlayer()
    document.addEventListener('keydown', Game.player.move);
    setTimeout(Game.draw, 30)
  }

  static drawPlayer(){
    Game.ctx.beginPath();
    Game.ctx.arc(Game.player.x, Game.player.y, Game.player.radius, 0, Math.PI * 2, false);
    Game.ctx.fillStyle = 'blue';
    Game.ctx.fill();
    Game.ctx.closePath();
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