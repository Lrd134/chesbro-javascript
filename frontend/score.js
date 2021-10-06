class Score {
  static all = [];
  constructor(id, score, user_id) {
    this.id = id;
    this.score = score;
    this.user_id = user_id;
    Score.all.push(this);
  }
  static fromJson(info) {
    new Score(parseInt(info.id, 10), parseInt(info.attributes.score, 10), parseInt(info.attributes.user_id, 10));
  }
  static fetchHighscores() {
    fetch(indexUrl + "/scores").
    then(resp => Helper.handleErrors(resp)).then(json => {
      json.data.forEach(e => {
        Score.fromJson(e);
      });
    }).catch(error => console.log(error));
  }
  static renderHighscores() {
    const highscoreDiv = document.getElementsByClassName('highscore overlay')[0];
    const ul = document.createElement('ul');
    Score.all.forEach(e => {
      const li = document.createElement('li');
      li.classList.add('highscore-actual');
      
      ul.appendChild(li);
    })
    Helper.removeChildElements(highscoreDiv);
    highscoreDiv.appendChild(ul);
    
  }
  static loadHighscoreEvent() {
    const hs = document.getElementById("highscore-hover");
    hs.addEventListener("mouseenter", e => {
      const hsOverlay = document.getElementsByClassName('hidden overlay highscore')[0];
      hsOverlay.classList.remove("hidden");
      hsOverlay.addEventListener("mouseleave", e=> {
          hsOverlay.classList.add("hidden");
      })
    })
  }

}