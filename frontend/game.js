class Enemy {
  constructor(x = 150, y = 150, lw = 15) {
    this.x = x;
    this.y = y;
    this.dx = lw;
    this.dy = lw;
    this.startX = x;
    this.startY = y;
    this.lw = lw;
    this.tick = 1;
    this.move = () => {
      if (this.tick === 3) {
        if (this.x < this.startX + 200 && this.x >= this.startX) {
          this.x += this.dx;
        }
        else if (this.x > this.startX + 200 || this.x < this.startX) {
          this.dx = this.dx * -1;
          this.x += this.dx;
        }
        this.tick = 1;
      } else if (this.tick <= 2)
        this.tick += 1;
    }
  }
}
class Player {
  static current_player;
  constructor(x = 8, y = 8, radius= 4) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    Player.current_player = this;
  }
  move(e) {
    switch(e.key){

    case ('a'): {
      if (Player.current_player.x > 8)
        Player.current_player.x -= Game.dx;
      break;
    }
    
    case('d'): {
      if (Player.current_player.x < 472)
        Player.current_player.x += Game.dx;
      break;
    }

    case('w'): {
      if (Player.current_player.y > 8)
        Player.current_player.y -= Game.dy;
      break;
    }

    case('s'): {
      if (Player.current_player.y < 312)
        Player.current_player.y += Game.dy;
      break;
    }

    case('ArrowRight'): {
      if (Player.current_player.x < 472)
        Player.current_player.x += Game.dx;
      break;
    }

    case('ArrowLeft'): {
      if (Player.current_player.x > 8)
        Player.current_player.x -= Game.dx;
      break;
    }

    case('ArrowUp'): {
      if (Player.current_player.y > 8)
        Player.current_player.y -= Game.dy;
      break;
    }

    case('ArrowDown'): {
      if (Player.current_player.y < 312)
        Player.current_player.y += Game.dy;
      break;
    }
    default:
      console.log(e.key + " is not usable input.");
    }
  }

}

class Game {
  static canvas = document.getElementById('gameBackground');
  static ctx = Game.canvas.getContext('2d');
  static dx = 8;
  static dy = 8;
  static player = new Player();
  static enemies = [ new Enemy, new Enemy(280, 100, 15)];
  static restartBox = { x: Game.canvas.width / 2 - 40,
                      y: Game.canvas.height - 90,
                      width: 80,
                      height: 30
                    }
  static winBox = { x: Game.canvas.width - 20,
                    y: Game.canvas.height - 20,
                    width: 10,
                    height: 10
                  }
  static over = false;
  static level = 1;
  constructor() {
    Game.draw();
  }

  static restart = (level = 1) => {
    this.player = new Player
    switch (level) 
    {
      case 1: {
        this.enemies = [new Enemy, new Enemy(280, 100, 15)];
        break;
      }
      case 2: {
        this.enemies = [new Enemy(10, 60, 15), new Enemy(250, 110, 15), new Enemy(250, 150, 30), new Enemy(200, 200, 30) ]
        break;  
      }
    }
    this.over = false;
    this.level = level;
    this.draw();
  }
  static draw = () => { 
    const ctx = this.ctx;
    const deltaTime = setTimeout(this.draw, 30);
    let collision = this.collision();
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawPlayer();
    this.drawEnemy();
    ctx.beginPath();
    ctx.fillStyle = "gold";
    ctx.fillRect(this.winBox.x, this.winBox.y, this.winBox.width, this.winBox.height);
    ctx.closePath();
    document.addEventListener('keydown', this.player.move);
    for (const enemy of this.enemies) {
      enemy.move();
    }
    if (collision){
      clearInterval(deltaTime);
      if (collision.type === "enemy") {
        this.gameOver();
      } else if (collision.type === "win") {
        this.nextLevelScreen();
      }
    }
    else if (!this.over) {
      deltaTime;
    }
  }

  save = name => {
    fetch(indexUrl + `/users/${name}/scores`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
    },
    method: "POST",
    body: JSON.stringify({
            score: Game.level })
  
    }).
    then(resp => resp.json()).
    then(json => console.log(json)).
    catch(error => console.log(error))
  }

  static gameOver = () => {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.fillRect(this.restartBox.x, this.restartBox.y, this.restartBox.width, this.restartBox.height)
    ctx.font = '20px Times New Roman';
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.fillText("Restart", this.restartBox.x + this.restartBox.width / 2, this.restartBox.y + this.restartBox.height / 1.5);
    ctx.font = '30px Times New Roman';
    ctx.textAlign = "center";
    ctx.fillStyle = "red";
    ctx.fillText("GAME OVER", this.canvas.width / 2, this.canvas.height * 0.25)
    ctx.closePath();
    this.canvas.addEventListener('click', this.gameOverEvent)
  }

  static gameOverEvent = (e) => {
      let coords = this.coordsInCanvas(e.clientX, e.clientY);
      if (this.collisionWithRestart(coords, this.restartBox)) {
        console.log("Trying to restart");
        this.restart();
      }
      else
        this.canvas.addEventListener('click', this.gameOverEvent);
  }

  static nextLevelScreen = () => {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.fillRect(this.restartBox.x, this.restartBox.y, this.restartBox.width, this.restartBox.height)
    ctx.font = '20px Times New Roman';
    ctx.textAlign = "center";
    ctx.fillStyle = "blue";
    ctx.fillText("Next", this.restartBox.x + this.restartBox.width / 2, this.restartBox.y + this.restartBox.height / 1.5);
    ctx.font = '30px Times New Roman';
    ctx.textAlign = "center";
    ctx.fillStyle = "green";
    ctx.fillText("Congrats!", this.canvas.width / 2, this.canvas.height * 0.25)
    ctx.closePath();
    this.canvas.addEventListener('click', this.nextLevelEvent)
  }

  static nextLevelEvent = (e) => {
    let coords = this.coordsInCanvas(e.clientX, e.clientY);
    if (this.collisionWithRestart(coords, this.restartBox)) {
      console.log("Trying to advance level!");
      this.level += 1;
      this.restart(this.level);
    }
    else
      this.canvas.addEventListener('click', this.nextLevelEvent);
  } 
  static drawEnemy = (interval) => {
    const ctx = this.ctx;
    for (let enemy of this.enemies){
      ctx.beginPath();
      ctx.fillStyle = 'red';
      ctx.fillRect(enemy.x, enemy.y, enemy.lw, enemy.lw);
      ctx.closePath();
    }

  }
  static drawPlayer = () => {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.arc(this.player.x, this.player.y, this.player.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = 'blue';
    ctx.fill();
    ctx.closePath();
  }
  static collision = () => {

    const collisionWithEnemy = () => {

      for (let enemy of this.enemies){

        if (this.player.x + this.player.radius > enemy.x 
          && this.player.y > enemy.y 
          && this.player.x - this.player.radius < enemy.x + enemy.lw 
          && this.player.y - this.player.radius < enemy.y + enemy.lw) {
            this.over = true;
            return true;
        }

      }
    }
    
    const collisionWithWin = () => {
      if (this.player.x > this.winBox.x && this.player.y > this.winBox.y){
        this.over = true;
        return true;
      }
    }

    if (collisionWithEnemy()) return { type: "enemy" }
    else if (collisionWithWin()) return { type: "win" }
    else return null
    
  }



  static collisionWithRestart = (coords, restartBox) => {
    let boundRect = this.canvas.getBoundingClientRect();
    let boxCoords = this.coordsInCanvas(restartBox.x + boundRect.left, restartBox.y + boundRect.top);
    if (coords.x < boxCoords.x + restartBox.width &&
      coords.x > boxCoords.x &&
      coords.y < boxCoords.y + restartBox.height &&
      coords.y > boxCoords.y)
      return true;
  }

  static collisionWithWin() {
    if (this.player.x > this.winBox.x && this.player.y > this.winBox.y){
      return true;
    }
  }

  static coordsInCanvas = (clientX, clientY) => {
    let boundRect = this.canvas.getBoundingClientRect();
    return { x: clientX - boundRect.left * (this.canvas.width / boundRect.x),
            y: clientY - boundRect.top * (this.canvas.height / boundRect.y)
    }
    
  }
}
