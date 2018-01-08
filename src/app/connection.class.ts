import { Vector } from './vector.class'
import { Level } from './level.class';


export class Connection {
  
  connectionId: number
  levelIndex: number
  levelPos: Vector

  constructor(connectionId: number, levelIndex: number, levelPos: Vector) {
    this.connectionId = connectionId
    this.levelIndex = levelIndex
    this.levelPos = levelPos
  }
}