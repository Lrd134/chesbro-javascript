
export default class Player {
  static current_player;

  constructor(x = 8, y = 8, radius = 4) {
    this.x = x;
    this.y = y;
    this.dx = 8;
    this.dy = 8;
    this.radius = radius;
    Player.current_player = this;
  }
  move(e) {
    switch(e.key){

    case ('a' || 'ArrowLeft'): {
      if (Player.current_player.x > 8)
        Player.current_player.x -= this.dx;
      break;
    }
    
    case('d' || 'ArrowRight'): {
      if (Player.current_player.x < 472)
        Player.current_player.x += this.dx;
      break;
    }

    case('w' || 'ArrowUp'): {
      if (Player.current_player.y > 8)
        Player.current_player.y -= this.dy;
      break;
    }

    case('s' || 'ArrowDown'): {
      if (Player.current_player.y < 312)
        Player.current_player.y += this.dy;
      break;
    }
    }
  }
}