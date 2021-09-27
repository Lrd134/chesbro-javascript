const indexUrl = "http://localhost:3000/"

const addEvents = () => {
  document.getElementsByClassName('create-user')[0].addEventListener("submit", e => {
    e.preventDefault();
    const userName = document.getElementsByClassName('new-user-name')[0].value;
    console.log("Before Fetch")
    fetch(indexUrl + "users", User.createUserConfig(userName)).then(resp => resp.json()).then(json => console.log(json)).catch(error => console.log("error" + error));
    console.log("After fetch and before prevent default")
    
    console.log("After preventDefault");
  })
}
const fetchUsersIndex = () => {
  fetch(indexUrl + "users").then(resp => resp.json()).then(json => renderHighscores(User.createUsers(json))).catch(error => error);
}
const renderHighscores = (arrayOfUsers) => {
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
document.addEventListener("DOMContentLoaded", e =>{
  addEvents();
  fetchUsersIndex();
})


// 
// 

class User {
  constructor(id, name = "Example", highscore = 0) {
    this.id = id;
    this.name = name;
    this.highscore = highscore;
  }
  static createUsers(jsonUsers) {
    const users = [];
    jsonUsers.data.forEach(e =>{
      users.push(new User(e.id, e.attributes.name, e.attributes.highscore))
    });
    return users;
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
  static createDestroyUserConfig(id) {

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