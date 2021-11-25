
export default class Player {
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
    }
  }

}