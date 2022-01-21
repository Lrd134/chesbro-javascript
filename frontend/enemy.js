export default class Enemy {
  
  constructor(x = 150, y = 150, lw = 15, mvAmnt = 15) {
    this.x = x;
    this.y = y;
    this.dx = mvAmnt;
    this.dy = mvAmnt;
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
