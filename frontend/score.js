class Score {
  static all = [];
  constructor(score, user_id) {
    this.score = score;
    this.user_id = user_id;
    Score.all.push(this);
  }

  static renderHighscores() {

    const highscoreDiv = document.getElementsByClassName('highscore')[0];
    const ul = document.createElement('ul');
    users.map(e => {
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