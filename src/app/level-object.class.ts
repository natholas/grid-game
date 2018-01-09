import { Vector } from './vector.class'

export class LevelObject {
  id: number
  pos: Vector
  type: string
  pickupable: boolean

  constructor(id: number, pos: Vector, type: string, pickupable: boolean) {
    this.id = id
    this.pos = pos
    this.type = type
    this.pickupable = pickupable
  }
}