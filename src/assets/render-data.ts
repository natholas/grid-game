export class RenderData {
  public tileSize: number = 16
  private notifyWhenLoaded: any[] = []

  private tileNames: string[] = [
    'center',
    'top-left',
    'top',
    'top-right',
    'right',
    'bottom-right',
    'bottom',
    'bottom-left',
    'left',
    'top-bottom',
    'right-left',
    'top-only',
    'right-only',
    'bottom-only',
    'left-only',
    'center-only',
    'top-left-inv-corner',
    'top-right-inv-corner',
    'bottom-right-inv-corner',
    'bottom-left-inv-corner',
  ]

  public characterNames: string[] = [
    'idle',
    'walking',
    'idle-inverted',
    'walking-inverted'
  ]

  public tileTypes: string[] = [
    'grass',
    'dirt',
    'bridge'
  ]
  public objectTypes: string[] = [
    'stairs',
    'hole',
  ]
  public tileSprites: any = {}
  public objectSprites: any = {}
  public characterSprites: any = {}
  public resolution: any = {
    width: 180
  }

  public loadedAllGraphics: boolean = false

  constructor() {
    let loadCount: number = 0
    this.tileTypes.forEach((tileType: string) => {
      for (let tileName of this.tileNames) {
        loadCount ++
        this.tileSprites[tileType + '_' + tileName] = new Image()
        this.tileSprites[tileType + '_' + tileName].src = '/assets/sprites/' + tileType + '_' + tileName + '.png'
        this.tileSprites[tileType + '_' + tileName].onload = function() {
          loadCount --
          if (loadCount === 0) this.allLoaded()
        }.bind(this)
      }
    })

    for (let characterName of this.characterNames) {
      loadCount++
      this.characterSprites['character-' + characterName] = new Image()
      this.characterSprites['character-' + characterName].src = '/assets/sprites/' + 'character-' + characterName + '.png'
      this.characterSprites['character-' + characterName].onload = function () {
        loadCount--
        if (loadCount === 0) this.allLoaded()
      }.bind(this)
    }

    this.objectTypes.forEach((objectType: string) => {
      loadCount ++
      this.objectSprites[objectType] = new Image()
      this.objectSprites[objectType].src = '/assets/sprites/' + objectType + '.png'
      this.objectSprites[objectType].onload = function () {
        loadCount--
        if (loadCount === 0) this.allLoaded()
      }.bind(this)
    })
  }

  public returnWhenLoaded(fun: Function) {
    if (this.loadedAllGraphics) fun()
    else this.notifyWhenLoaded.push(fun)
  }

  private allLoaded() {
    this.loadedAllGraphics = true
    this.notifyWhenLoaded.forEach((fun: Function) => {
      fun()
    })
  }
}