

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
document.addEventListener("keydown", e =>{
  fetch("http://localhost:3000/users", createNewUserConfig("Faux name for now")).then(resp => resp.json()).then(json => console.log(json)).catch(error => console.log("error" + error));
})


