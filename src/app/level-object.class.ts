import { Vector } from './vector.class'

export class LevelObject {
  pos: Vector
  type: string

  constructor(pos: Vector, type: string) {
    this.pos = pos
    this.type = type
  }
}