import { LevelData } from './data-classes/level-data'
import { Vector } from './vector.class'

export class GameData {
  levelData: LevelData
  startingLevel: number = 0
  startingPos: Vector = new Vector(0,1)

  constructor() {
    this.levelData = new LevelData()
  }
}