
const indexUrl = "http://localhost:3000/"

const addEvents = () => {
  document.getElementsByClassName('create-user')[0].addEventListener("submit", User.createUser)
  document.getElementsByClassName('existing-user')[0].addEventListener("submit", User.login)
}


document.addEventListener("DOMContentLoaded", e =>{
  addEvents();
  User.getUsers();
})


class User {

  static all = [];
  constructor(id, name = "Example", highscore = 0) {
    this.id = id;
    this.name = name;
    this.highscore = highscore;
    User.all.push(this);
  }

  static fromJson(json) {
    return new User(parseInt(json.data.id, 10), json.data.attributes.name, json.data.attributes.highscore)
  }

  static getUsers() {
    fetch(indexUrl + "users").then(resp => resp.json()).then(json => User.renderUsers(json)).catch(error => error);
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
    
    fetch(indexUrl + `users/${userName}`, updateConfigObj(newName)).
    then(resp => resp.json()).then(json => User.fromJson(json).updateHighscore(userName))
  }

  static createUser(e) {
    e.preventDefault();
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
    let user;
    const userName = document.getElementsByClassName('new-user-name')[0].value;
    document.getElementsByClassName('new-user-name')[0].value = "";
    fetch(indexUrl + "users", createConfigObj(userName)).then(resp => resp.json()).then(json => User.fromJson(json).login()).catch(error => console.log("error" + error));
    User.getUsers()
  }

  static login(e) {
    e.preventDefault()
    let userName;
    for (let child of e.target.children){ 
      if ( child.classList.value === "existing-user-name" )  {
          userName = child.value;
      }
    }
    
    if (userName && userName !== '') {
      fetch(indexUrl + `users/${userName}`).then(resp => resp.json()).then(json => {
          if (json.data) {

            User.fromJson(json).login()
          }
        });
    }
    else
    {
      Helper.createAlert({
        message: "You must provide a username!"
      })
    }
  }

  static renderUsers(jsonUsers) {
    const users = [];
    jsonUsers.data.forEach(e =>{
      users.push(new User(e.id, e.attributes.name, e.attributes.highscore))
    });
    this.renderHighscores(users);
    return users;

  }

  static renderHighscores(arrayOfUsers) {

    const users = arrayOfUsers;
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
            User.getUsers();
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
  }
  
  updateHighscore(name) {
    let highscores = document.getElementsByClassName('highscore-actual');

    for (let highscore of highscores) {
      const hsInnerTextSplit = highscore.innerText.split(' ');
      if (highscore.innerText.split(" ")[0] === name) {

        hsInnerTextSplit.shift();
        hsInnerTextSplit.unshift(this.name);
        highscore.innerText = hsInnerTextSplit.join(" ");

        const login = document.getElementsByClassName('login')[0]
        const { editButton, deleteButton, logoutButton } = this.createUserButtons();
        const loginTextSplit = login.innerText.replace('.', ' ').split(' ').slice(0, 5);
        loginTextSplit.shift();
        loginTextSplit.unshift(this.name);
        login.innerText = loginTextSplit.join(' ') + '.';
        login.appendChild(editButton);
        login.appendChild(deleteButton);
        login.appendChild(logoutButton);

      }
    }
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