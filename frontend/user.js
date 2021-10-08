class User {
  static current_user;
  static all = [];
  constructor(id, name = "Example") {
    this.id = parseInt(id, 10);
    this.name = name;
    User.all.push(this);
    this.createUserButtons = () => {

      const userEditFormEvent = (e) => {
        const sessionDiv = document.getElementsByClassName('user')[0];
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
        sessionDiv.appendChild(editForm);
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
        deleteButton.addEventListener('click', e => {      
          fetch(indexUrl + `users/${this.id}`, User.destroyConfigObj(userName)).then(resp => resp.json()).then(json => {
              Helper.createAlert(json);
              document.getElementsByClassName('user overlay')[0].classList.add('hidden');
              User.removeFromAll(userName);
          })
        })
        return deleteButton;
        
    
      }
  
      return {
        deleteButton: createDeleteButton(),
        editButton: createEditButton()
      }
  
    }
    
    this.renderProfile = (e) => {
      const profileOverlay = document.getElementsByClassName('overlay user')[0];
      profileOverlay.classList.remove('hidden');
      const buttons = this.createUserButtons();
      for (const button in buttons){
        profileOverlay.appendChild(buttons[button]);
      }
      profileOverlay.addEventListener('mouseleave', e=> {
        profileOverlay.innerText = "";
        profileOverlay.classList.add('hidden')
      })

    }
    
    this.logout = (e) => {
      const headerUl = document.getElementsByClassName('header')[1]
      const highscoreLi = headerUl.children[0];
      headerUl.innerText = "";
      let loginLi = document.createElement('li');
      loginLi.id = "login-hover";
      loginLi.innerText = "Login";
      headerUl.appendChild(highscoreLi);
      headerUl.appendChild(loginLi);
      User.loadLoginEvent();
    }

    this.login = () => {
      User.current_user = this;
      const header = document.getElementsByClassName('header')[0]
      const [userLi, scoresLi, logoutLi, ul] = [ document.createElement('li'),
      document.createElement('li'),
      document.createElement('li'),
      header.children[0] ];
      ul.children[1].remove();
      userLi.id = 'user-hover';
      userLi.setAttribute('data-id', this.id);
      scoresLi.id = 'scores-hover';
      scoresLi.setAttribute('data-user', this.id);
      logoutLi.id = 'logout';
      logoutLi.setAttribute('data-id', this.id)
      userLi.innerText = this.name;
      scoresLi.innerText = `${this.name}'s Scores`;
      logoutLi.innerText = "Logout";
      header.style.marginLeft = '70%';
      scoresLi.addEventListener('click', Score.renderScores)
      userLi.addEventListener('click', this.renderProfile)
      logoutLi.addEventListener('click', this.logout)
      ul.appendChild(scoresLi);
      ul.appendChild(userLi);
      ul.appendChild(logoutLi);

      // const sessionDiv = document.getElementsByClassName('session')[0];
      // let buttons = this.createUserButtons()
      // sessionDiv.innerText = `${this.name} is Currently Logged in.`
      // sessionDiv.classList.remove('hidden');
  
      // for (let button in buttons) {
      //   buttons[button].classList.add('user');
      //   sessionDiv.appendChild(buttons[button])
      // }
    }

  }

  static fromJson(json) {
    let user = User.all.find(e => parseInt(json.data.id, 10) === e.id)
    if (!user)
      return new User(json.data.id, json.data.attributes.name) 
    else
    {
      if(user.name === json.data.attributes.name)
        return user;
      else {
        User.removeFromAll(user.name)
        return new User(json.data.id, json.data.attributes.name)
      }
    }
    
  }

  static find_by_id(id) {
    const user = User.all.find(e => id === e.id)
    return user;
  }

  static getUsers() {
    fetch(indexUrl + "users").then(resp => Helper.handleErrors(resp)).then(json => {
      if (json.message)
      Helper.createAlert(json)
      else {
        json.data.forEach(e =>{
          new User(e.id, e.attributes.name)
        }); 
      }   
    }).catch(error => console.log("Unable to retrieve the users. Reason: " + error.message))
    User.loadLoginEvent();
  }

  static hideLogin(e) {
    const loginDiv = document.getElementsByClassName('overlay login')[0];
    loginDiv.classList.add('hidden');
  }

  static loadLoginEvent(){
    let loginHover = document.getElementById('login-hover');
    loginHover.addEventListener('click', e => {
      let loginDiv = document.getElementsByClassName('login overlay')[0];
      loginDiv.classList.remove('hidden');
      loginDiv.addEventListener('mouseleave', User.hideLogin)
    })
    document.getElementsByClassName('user')[1].addEventListener("submit", User.login)
    
  }

  static removeFromAll(name) {
    User.all = User.all.filter(e => {
      if (e.name !== name){
        e.logout();
        return e; 
      }
    })

  }

  static updateUser(e) {
    e.preventDefault();

    const updateConfigObj = (name = "") => {
      return {
                headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json"
                },
                method: "PATCH",
                body: JSON.stringify({
                      user: {
                              name: name
                      }})
              }
    }

    let newName;
    const uOverlay = document.getElementsByClassName('user overlay')[0];
    const dataId = document.getElementById('user-hover').getAttribute('data-id');
    for (let input of e.target.children) {
      if (input.type === "text") {
        newName = input.value;
      }
    }
    const updateAfterFetch = json => {
        if (json.message)
          Helper.createAlert(json)
        else {
          uOverlay.classList.add('hidden');
          User.fromJson(json).login();
        }
    }

    fetch(indexUrl + `users/${dataId}`, updateConfigObj(newName)).
    then(resp => Helper.handleErrors(resp)).
    then(json => updateAfterFetch(json))
  }

  static login(e) {

    e.preventDefault()
    const createConfigObj = (userName) => {
      return {
    
      headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
      },
      method: "POST",
      body: JSON.stringify({
              user: {
                      name: userName
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
      fetch(indexUrl + `users`, createConfigObj(userName)).then(resp => Helper.handleErrors(resp)).then(json => {
        if (json.message)
          Helper.createAlert(json)
        else {
          User.fromJson(json).login()
          User.hideLogin(e);
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



 
}