import { Vector } from './vector.class'

export class Tile {
  pos: Vector
  type: string
  cornerType: string = ''
  walkable: boolean

  constructor(pos: Vector, type: string) {
    this.pos = pos
    this.type = type
  }
}