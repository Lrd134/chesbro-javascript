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
const fetchIndex = () => {
  return fetch(indexUrl + "users").then(resp => resp.json()).then(json => json).catch(error => error);
}
const renderHighscores = () => {
  const highscoreDiv = document.getElementsByClassName('highscores')[0];
  const ul = document.createElement('ul');
  
}
document.addEventListener("DOMContentLoaded", e =>{
  addEvents();
  renderHighscores();
})


// 
// 

