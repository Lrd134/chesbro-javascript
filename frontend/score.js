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
  static fetchScores() {
    fetch(indexUrl + "/scores").
    then(resp => Helper.handleErrors(resp)).then(json => {
      json.data.forEach(e => {
        Score.fromJson(e);
      });
    }).catch(error => console.log(error));
    this.loadHighscoreEvent();
  }
  static bestTenScores() {
    const inDescending = Score.all.sort(function(a, b){return b.score - a.score})
    return inDescending.slice(0, 9);
    
  }
  static renderHighScores() {
    let bestScores = this.bestTenScores()
    const highscoreDiv = document.getElementsByClassName('highscore overlay')[0];
    const ul = document.createElement('ul');
    bestScores.forEach(e => {
      const li = document.createElement('li');
      li.classList.add('highscore-actual');
      li.innerText = `${User.find_by_id(e.user_id).name} has a high score of ${e.score}`;
      ul.appendChild(li);
    })
    Helper.removeChildElements(highscoreDiv);
    highscoreDiv.appendChild(ul);
  }
  static renderScores() {
    // Working on it
    
  }
  static loadHighscoreEvent() {
    const hs = document.getElementById("highscore-hover");
    hs.addEventListener("mouseenter", e => {
      const hsOverlay = document.getElementsByClassName('hidden overlay highscore')[0];
      hsOverlay.classList.remove("hidden");
      Score.renderHighScores()
      hsOverlay.addEventListener("mouseleave", e=> {
          hsOverlay.classList.add("hidden");
      })
    })
  }

}