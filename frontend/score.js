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

}