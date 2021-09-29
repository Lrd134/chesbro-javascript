
const indexUrl = "http://localhost:3000/"

const addEvents = () => {
  document.getElementsByClassName('create-user')[0].addEventListener("submit", User.createUser)
}


document.addEventListener("DOMContentLoaded", e =>{
  addEvents();
  User.getUsers();
})


// 
// 

class User {

  constructor(id, name = "Example", highscore = 0) {
    this.id = id;
    this.name = name;
    this.highscore = highscore;
  }
  static fromJson(json) {
    return new User(parseInt(json.data.id, 10), json.data.attributes.name, json.data.attributes.highscore)
  }
  static getUsers() {
    fetch(indexUrl + "users").then(resp => resp.json()).then(json => User.renderUsers(json)).catch(error => error);
  }
  static updateUser(e) {
    let newName;
    for (let input of e.target.children) {
      if (input.type === "text") {
        newName = input.value;
      }
    }
    e.preventDefault();
    let userName = e.target.parentElement.innerText.split(" ")[0];
    fetch(indexUrl + `users/${userName}`, User.updateUserConfig(newName)).then(resp => resp.json()).then(json => User.fromJson(json).updateHighscore(userName))
  }
  static createUser(e) {
    e.preventDefault();
    let user;
    const userName = document.getElementsByClassName('new-user-name')[0].value;
    fetch(indexUrl + "users", User.createUserConfig(userName)).then(resp => resp.json()).then(json => User.fromJson(json).login()).catch(error => console.log("error" + error));
    User.getUsers()
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

  static createUserConfig(userName, userHighscore = 0) {
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

  static updateUserConfig(name = "", highscore = 0) {
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

  static destroyUserConfig(id) {

    return {
  
      headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
      },
      method: "DELETE",
      body: JSON.stringify({
              user: {
                      id: id
              }})
    }
    
  }

  login() {
    const loginDiv = document.getElementsByClassName('login')[0];
    let buttons = {
      editButton: document.createElement('button'),
      deleteButton: document.createElement('button'),
      logoutButton: document.createElement('button')
    };

    buttons.editButton.innerText = `Edit ${this.name}`;
    buttons.editButton.classList.add('edit');
    buttons.editButton.addEventListener('click', e => {
      let form = document.createElement('form');
      let userName = document.createElement('input');
      let submit = document.createElement('input');
      userName.type = "text";
      userName.placeholder = `${this.name}`;
      submit.type = "submit";
      submit.value = "Change Name";
      userName.classList.add('edit', 'user');
      submit.classList.add('edit', 'user');
      form.appendChild(userName);
      form.appendChild(submit);
      form.addEventListener('submit', User.updateUser);
      loginDiv.appendChild(form);

    })
    buttons.deleteButton.innerText = `Delete ${this.name}`;
    buttons.deleteButton.classList.add('delete');
    buttons.logoutButton.innerText = `Logout`;
    buttons.logoutButton.classList.add('logout');

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

        let [login, editButton, deleteButton, logoutButton ] = 
        [ document.getElementsByClassName('login')[0],
        Helper.createEditButton(this.name),
        Helper.createDeleteButton(this.name),
        document.createElement('button')
        ]
        logoutButton.classList.add('logout', 'user');
        logoutButton.innerText = "Logout";
        let loginTextSplit = login.innerText.replace('.', ' ').split(' ').slice(0, 5);
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


    // buttons.editButton.addEventListener('click', e => {
    //   fetch(indexUrl + `users/${this.id}`, updateUserConfig(this.id, this.name, this.highscore)).then(resp => resp.json).then(json => console.log(json));
    // });
class Helper {
  static removeChildElements(parent) {
    if (parent.children.length > 0){
      for (let int = 0; int < parent.children.length; int++)
      {
        parent.removeChild(parent.children[int]);
      }
    } 
  }

  static createDeleteButton(objectName) {
    let deleteButton = document.createElement('button');
    deleteButton.classList.add('delete');
    deleteButton.innerText = `Delete ${objectName}`;
    return deleteButton;
    

  }

  static createEditButton(objectName) {
    let editButton = document.createElement('button');
    editButton.classList.add('edit');
    editButton.innerText = `Edit ${objectName}`;
    return editButton;
  }
}