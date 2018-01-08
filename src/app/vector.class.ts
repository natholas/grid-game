export class Vector {
  public x: number
  public y: number

  constructor(x: number = 0, y: number = 0) {
    this.x = x
    this.y = y
  }

  public add(vec: Vector) {
    return new Vector(
      this.x + vec.x, 
      this.y + vec.y
    )    
  }

  public sub(vec: Vector) {
    return new Vector(
      this.x - vec.x,
      this.y - vec.y
    )
  }

  public multiply(amount: number) {
    return new Vector(
      this.x * amount,
      this.y * amount
    )
  }

  public devide(vec: Vector) {
    return new Vector(
      this.x / vec.x,
      this.y / vec.y
    )
  }

  public equals(vec: Vector) {
    return this.x === vec.x && this.y === vec.y
  }

  public copy() {
    return new Vector(this.x, this.y)
  }
}