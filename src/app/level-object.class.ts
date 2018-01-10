import { Vector } from './vector.class'

export class LevelObject {
  id: number
  pos: Vector
  type: string
  pickupable: boolean
  name: string
  needs: number[]

  constructor(id: number, name: string, pos: Vector, type: string, pickupable: boolean, needs: number[] = []) {
    this.id = id
    this.name = name
    this.pos = pos
    this.type = type
    this.pickupable = pickupable
    this.needs = needs
  }
}