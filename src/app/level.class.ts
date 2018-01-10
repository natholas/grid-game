import { Connection } from './connection.class'
import { Tile } from './tile.class'
import { LevelObject } from './level-object.class'
import { Vector } from './vector.class';
import { LevelData } from './data-classes/level-data';
import { Character } from './character.class';
import { Game } from './game.class';

export class Level {
  connections: Connection[] = []
  tiles: Tile[][][]
  objects: LevelObject[]
  levelData: LevelData = new LevelData()
  game: Game
  title: string

  constructor(data: any, game: Game) {
    this.processTiles(data)
    this.title = data.title
    this.processObjects(data.objects)
    this.processConnections(data.connections)
    this.game = game
  }

  public getConnectionFromPos(pos: Vector) {
    for (let i in this.connections) {
      if (this.connections[i].levelPos.equals(pos)) {
        return this.connections[i]
      }
    }
  }

  public getConnectionFromId(id: number) {
    for (let i in this.connections) {
      if (this.connections[i].connectionId === id) {
        return this.connections[i]
      }
    }
  }

  public processPos(character: Character) {
    let connection = this.getConnectionFromPos(character.pos)
    if (connection) {
      this.game.processConnection(connection)
    }
    this.checkPickupableObjects(character)
    this.updateNeedsMet(character)
  }

  public getTileFromPos(pos: Vector, layer: number) {
    if (!this.tiles[layer]) return false
    if (!this.tiles[layer][pos.y]) return false
    if (!this.tiles[layer][pos.y][pos.x]) return false
    return this.tiles[layer][pos.y][pos.x]
  }

  public tileWalkable(pos: Vector): boolean {
    for (let i = this.tiles.length - 1; i >= 0; i --) {
      let tile = this.getTileFromPos(pos, i)
      if (!tile) continue
      if (tile.walkable === undefined) continue
      return tile.walkable
    }
    return false
  }

  private checkPickupableObjects(character: Character) {
    let objects = this.getObjectsFromPos(character.pos).filter((obj: LevelObject) => {
      return obj.pickupable
    })
    for (let obj of objects) {
      this.game.ui.createText('picked-up-object', 'Picked up: ' + obj.name, 'centerBottom', 2)
      this.game.ui.removeText('picked-up-object', 2500)
    }
    character.pickUpObjects(objects)
    this.removeObjects(objects)
  }

  private updateNeedsMet(character: Character) {
    for (let obj of this.objects) {
      obj.needsMet = character.hasWhatObjectNeeds(obj)
    }
  }

  private removeObjects(objects: LevelObject[]) {
    for (let obj of objects) this.removeObject(obj)
  }

  private removeObject(object: LevelObject) {
    for (let i = 0; i < this.objects.length; i++) {
      if (object.id === this.objects[i].id) {
        this.objects.splice(i, 1)
        return
      }
    }
  }

  public getObjectsFromPos(pos: Vector): LevelObject[] {
    let objects = []
    for (let obj of this.objects) {
      if (obj.pos.equals(pos)) objects.push(obj)
    }
    return objects
  }

  private processObjects(data: any[]): void {
    this.objects = []
    for (var i in data) {
      let pos = new Vector(data[i].pos[0], data[i].pos[1])
      this.objects.push(new LevelObject(data[i].id, data[i].name, pos, data[i].type, !!data[i].pickupable, data[i].needs, data[i].unmetSuffix))
    }
  }

  private processConnections(data: any[]): void {
    data.forEach((data: any) => {
      this.connections.push(
        new Connection(data.connectionId, data.levelIndex, new Vector(data.pos[0], data.pos[1]), data.direction)
      )
    })
  }

  private processTiles(data: any): void {
    this.tiles = []
    for (let i = 0; i < data.tiles.length; i++) {
      this.tiles.push(this.processTilesLayer(data.tiles[i]))
    }
    for (let i = 0; i < this.tiles.length; i++) {
      this.addTileTypes(this.tiles[i], i)
    }
  }

  private addTileTypes(tiles: Tile[][], layerIndex: number) {
    tiles.forEach((row: Tile[]) => {
      row.forEach((tile: Tile) => {
        tile.cornerType = this.getCornerType(tile, layerIndex)
      })
    })
  }

  private processTilesLayer(tiles: Tile[]): Tile[][] {
    let output: Tile[][] = []
    let x = 0
    let y = 0

    tiles.forEach((rowData: any) => {
      let row: Tile[] = []
      rowData.forEach((tileData: string) => {
        let pos = new Vector(x, y)
        let tile = new Tile(pos, tileData)
        if (this.levelData.tileTypes[tileData]) {
          tile.walkable = this.levelData.tileTypes[tileData].walkable
        }
        row.push(tile)
        x++
      })
      output.push(row)
      y++
      x = 0
    })
    return output
  }

  private getCornerType(tile: Tile, layerIndex: number): string {
    let top = this.getTileFromPos(tile.pos.add(new Vector(0, -1)), layerIndex)
    let right = this.getTileFromPos(tile.pos.add(new Vector(1, 0)), layerIndex)
    let bottom = this.getTileFromPos(tile.pos.add(new Vector(0, 1)), layerIndex)
    let left = this.getTileFromPos(tile.pos.add(new Vector(-1, 0)), layerIndex)

    let topSameType, rightSameType, bottomSameType, leftSameType

    if (!top || top.type === tile.type) topSameType = true
    if (!right || right.type === tile.type) rightSameType = true
    if (!bottom || bottom.type === tile.type) bottomSameType = true
    if (!left || left.type === tile.type) leftSameType = true

    if (!topSameType && !rightSameType && !bottomSameType && !leftSameType) return 'center-only'
    if (!topSameType && !rightSameType && bottomSameType && !leftSameType) return 'top-only'
    if (!topSameType && !rightSameType && !bottomSameType && leftSameType) return 'right-only'
    if (topSameType && !rightSameType && !bottomSameType && !leftSameType) return 'bottom-only'
    if (!topSameType && rightSameType && !bottomSameType && !leftSameType) return 'left-only'

    if (topSameType && bottomSameType && !leftSameType && !rightSameType) return 'right-left'
    if (!topSameType && !bottomSameType && leftSameType && rightSameType) return 'top-bottom'

    if (!topSameType && rightSameType && leftSameType) return 'top'
    if (!topSameType && !rightSameType && leftSameType) return 'top-right'
    if (!topSameType && rightSameType && !leftSameType) return 'top-left'

    if (!bottomSameType && rightSameType && leftSameType) return 'bottom'
    if (!bottomSameType && !rightSameType && leftSameType) return 'bottom-right'
    if (!bottomSameType && rightSameType && !leftSameType) return 'bottom-left'

    if (!rightSameType && topSameType && bottomSameType) return 'right'
    if (!leftSameType && topSameType && bottomSameType) return 'left'

    let topLeft = this.getTileFromPos(tile.pos.add(new Vector(-1, -1)), layerIndex)
    let topRight = this.getTileFromPos(tile.pos.add(new Vector(1, -1)), layerIndex)
    let bottomRight = this.getTileFromPos(tile.pos.add(new Vector(1, 1)), layerIndex)
    let bottomLeft = this.getTileFromPos(tile.pos.add(new Vector(-1, 1)), layerIndex)

    let topRightSameType, bottomRightSameType, bottomLeftSameType, topLeftSameType
    
    if (!topLeft || topLeft.type === tile.type) topLeftSameType = true
    if (!topRight || topRight.type === tile.type) topRightSameType = true
    if (!bottomRight || bottomRight.type === tile.type) bottomRightSameType = true
    if (!bottomLeft || bottomLeft.type === tile.type) bottomLeftSameType = true

    if (!topLeftSameType) return 'top-left-inv-corner'
    if (!topRightSameType) return 'top-right-inv-corner'
    if (!bottomRightSameType) return 'bottom-right-inv-corner'
    if (!bottomLeftSameType) return 'bottom-left-inv-corner'

    return 'center'
  }

}