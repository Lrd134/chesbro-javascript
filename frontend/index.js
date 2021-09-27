const indexUrl = "http://localhost:3000/"

const createUserConfig = (userName, userHighscore = 0) => {
  return userConfigObj = {

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

const addEvents = () => {
  document.getElementsByClassName('create-user')[0].addEventListener("submit", e => {
    e.preventDefault();
    const userName = document.getElementsByClassName('new-user-name')[0].value;
    console.log("Before Fetch")
    fetch(indexUrl + "users", createUserConfig(userName)).then(resp => resp.json()).then(json => console.log(json)).catch(error => console.log("error" + error));
    console.log("After fetch and before prevent default")
    
    console.log("After preventDefault");
  })
}
const createUsers = () => {

}
const fetchUsersIndex = () => {
  let users;
  fetch(indexUrl + "users").then(resp => resp.json()).then(json => users = User.createUsers(json)).catch(error => error);
  return users;
}
const renderHighscores = () => {
  const users = fetchUsersIndex()
  const highscoreDiv = document.getElementsByClassName('highscores')[0];
  const ul = document.createElement('ul');
  
}
document.addEventListener("DOMContentLoaded", e =>{
  addEvents();
  renderHighscores();
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
    jsonUsers.data.map(e =>{
      if (e.type === "user") return new User(e.id, e.attributes.name, e.attributes.highscore)
    });
    return jsonUsers.data;
  }
  
}