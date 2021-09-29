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
  
  static getUsers() {
    fetch(indexUrl + "users").then(resp => resp.json()).then(json => User.renderUsers(json)).catch(error => error);
  }

  static createUser(e) {
    e.preventDefault();
    const userName = document.getElementsByClassName('new-user-name')[0].value;
    fetch(indexUrl + "users", User.createUserConfig(userName)).then(resp => resp.json()).then(json => User.getUsers()).catch(error => console.log("error" + error));
  }

  static renderUsers(jsonUsers) {
    debugger;
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
      li.classList.add('highscore-actual')
      li.innerText = `${e.name} has a highscore of ${e.highscore}.`
      ul.appendChild(li);
    })
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

  static updateUserConfig(id, name = "", highscore) {
        return {
  
      headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
      },
      method: "POST",
      body: JSON.stringify({
              user: {
                      id: id,
                      name: name,
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
}