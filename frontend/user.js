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
  static find_by_id(id) {

  }

  static getUsers() {
    fetch(indexUrl + "users").then(resp => handleErrors(resp).json()).then(json => {
      json.data.forEach(e =>{
        new User(e.id, e.attributes.name, e.attributes.highscore)
      });    
    }).catch(error => console.log("Unable to retrieve the users. Reason: " + error.message))

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
            Score.renderHighscores();
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
    Score.renderHighscores();
  }
 
}