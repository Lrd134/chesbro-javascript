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
  // static canvas = Game.canvas;
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

  static restart(level = 1) {
    Game.player = new Player
    switch (level) 
    {
      case 1: {
        Game.enemies = [new Enemy, new Enemy(280, 100, 15)];
        break;
      }
      case 2: {
        Game.enemies = [new Enemy(10, 60, 15), new Enemy(250, 110, 15), new Enemy(250, 150, 30), new Enemy(200, 200, 30) ]
        break;  
      }
    }
    Game.over = false;
    Game.ctx.clearRect(0, 0, Game.canvas.width, Game.canvas.height);
    Game.draw();
  }
  static draw() { 
    const deltaTime = setTimeout(Game.draw, 30);
    Game.ctx.clearRect(0, 0, Game.canvas.width, Game.canvas.height);
    Game.drawPlayer();
    Game.drawEnemy();
    Game.ctx.beginPath();
    Game.ctx.fillStyle = "gold";
    Game.ctx.fillRect(Game.winBox.x, Game.winBox.y, Game.winBox.width, Game.winBox.height);
    Game.ctx.closePath();
    document.addEventListener('keydown', Game.player.move);
    for (const enemy of Game.enemies) {
      enemy.move();
    }
    if (Game.collisionWithWin() && !Game.over) {
      clearInterval(deltaTime);
      Game.nextLevelScreen()
    }
    else if (Game.collisionWithEnemy() && !Game.over) {
      clearInterval(deltaTime);
      const loginDiv = document.getElementById('user-hover');
      if (loginDiv) {
        console.log("trying to save");
        Game.save(loginDiv.innerText.split(" ")[0]);
        Game.over = true;
      }
      Game.gameOver();
    }
    else
      deltaTime;
  }

  static save(name) {
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

  static gameOver() {
    Game.ctx.beginPath();
    Game.ctx.clearRect(0, 0, Game.canvas.width, Game.canvas.height);
    Game.ctx.fillRect(Game.restartBox.x, Game.restartBox.y, Game.restartBox.width, Game.restartBox.height)
    Game.ctx.font = '20px Times New Roman';
    Game.ctx.textAlign = "center";
    Game.ctx.fillStyle = "white";
    Game.ctx.fillText("Restart", Game.restartBox.x + Game.restartBox.width / 2, Game.restartBox.y + Game.restartBox.height / 1.5);
    Game.ctx.font = '30px Times New Roman';
    Game.ctx.textAlign = "center";
    Game.ctx.fillStyle = "red";
    Game.ctx.fillText("GAME OVER", Game.canvas.width / 2, Game.canvas.height * 0.25)
    Game.ctx.closePath();
    Game.canvas.addEventListener('click', Game.gameOverEvent)
  }

  static gameOverEvent(e){
      let coords = Game.coordsInCanvas(e.clientX, e.clientY);
      if (Game.collisionWithRestart(coords, Game.restartBox)) {
        console.log("Trying to restart");
        Game.restart();
      }
      else
        Game.canvas.addEventListener('click', this.gameOverEvent);
  }

  static nextLevelScreen(){

    Game.ctx.beginPath();
    Game.ctx.clearRect(0, 0, Game.canvas.width, Game.canvas.height);
    Game.ctx.fillRect(Game.restartBox.x, Game.restartBox.y, Game.restartBox.width, Game.restartBox.height)
    Game.ctx.font = '20px Times New Roman';
    Game.ctx.textAlign = "center";
    Game.ctx.fillStyle = "blue";
    Game.ctx.fillText("Next", Game.restartBox.x + Game.restartBox.width / 2, Game.restartBox.y + Game.restartBox.height / 1.5);
    Game.ctx.font = '30px Times New Roman';
    Game.ctx.textAlign = "center";
    Game.ctx.fillStyle = "green";
    Game.ctx.fillText("Congrats!", Game.canvas.width / 2, Game.canvas.height * 0.25)
    Game.ctx.closePath();
    Game.canvas.addEventListener('click', Game.nextLevelEvent)
  }

  static nextLevelEvent(e){
    let coords = Game.coordsInCanvas(e.clientX, e.clientY);
    if (Game.collisionWithRestart(coords, Game.restartBox)) {
      console.log("Trying to advance level!");
      Game.level += 1;
      Game.restart(Game.level);
    }
    else
      Game.canvas.addEventListener('click', this.nextLevelEvent);
  } 
  static drawEnemy(interval) {
    for (let enemy of Game.enemies){
      Game.ctx.beginPath();
      Game.ctx.fillStyle = 'red';
      Game.ctx.fillRect(enemy.x, enemy.y, enemy.lw, enemy.lw);
      Game.ctx.closePath();
    }

  }
  static drawPlayer(){
    Game.ctx.beginPath();
    Game.ctx.arc(Game.player.x, Game.player.y, Game.player.radius, 0, Math.PI * 2, false);
    Game.ctx.fillStyle = 'blue';
    Game.ctx.fill();
    Game.ctx.closePath();
  }
  static collisionWithEnemy() {
    for (let enemy of Game.enemies){
      if (Game.player.x + Game.player.radius > enemy.x 
        && Game.player.y > enemy.y 
        && Game.player.x - Game.player.radius < enemy.x + enemy.lw 
        && Game.player.y - Game.player.radius < enemy.y + enemy.lw)
        return true;
    }
  }

  static collisionWithRestart(coords, restartBox) {
    let boundRect = Game.canvas.getBoundingClientRect();
    let boxCoords = Game.coordsInCanvas(restartBox.x + boundRect.left, restartBox.y + boundRect.top);
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

  static coordsInCanvas(clientX, clientY) {
    let boundRect = Game.canvas.getBoundingClientRect();
    return { x: clientX - boundRect.left * (Game.canvas.width / boundRect.x),
            y: clientY - boundRect.top * (Game.canvas.height / boundRect.y)
    }
    
  }
}
