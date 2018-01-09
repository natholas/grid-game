import { Vector } from './vector.class'
import { Level } from './level.class';


export class Connection {
  connectionId: number
  levelIndex: number
  levelPos: Vector
  direction: string

  constructor(connectionId: number, levelIndex: number, levelPos: Vector, direction: string) {
    this.connectionId = connectionId
    this.levelIndex = levelIndex
    this.levelPos = levelPos
    this.direction = direction
  }
}