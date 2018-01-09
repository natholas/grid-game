export class RenderData {
  public tileSize: number = 16
  public spriteAnimationRate: number = 16
  levelTransitionTime: number = 500
  private notifyWhenLoaded: any[] = []

  private tileNames: string[][] = [
    ['center'],
    ['top-left'],
    ['top'],
    ['top-right'],
    ['right'],
    ['bottom-right'],
    ['bottom'],
    ['bottom-left'],
    ['left'],
    ['top-bottom'],
    ['right-left'],
    ['top-only'],
    ['right-only'],
    ['bottom-only'],
    ['left-only'],
    ['center-only'],
    ['top-left-inv-corner'],
    ['top-right-inv-corner'],
    ['bottom-right-inv-corner'],
    ['bottom-left-inv-corner'],
  ]

  public characterNames: string[][] = [
    ['idle-up'],
    ['idle-right'],
    ['idle-down'],
    ['idle-left'],
    ['walking-up_0', 'walking-up_1'],
    ['walking-right_0', 'walking-right_1'],
    ['walking-down_0', 'walking-down_1'],
    ['walking-left_0', 'walking-left_1'],
  ]

  public tileTypes: string[] = [
    'grass',
    'dirt',
    'bridge'
  ]
  public objectTypes: string[] = [
    'stairs',
    'hole',
    'key',
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
      for (let tileNames of this.tileNames) {
        let key = tileType + '_' + tileNames[0].split('_')[0]
        this.tileSprites[key] = []
        for (var tileName of tileNames) {
          loadCount ++
          let img = new Image()
          img.src = '/assets/sprites/' + tileType + '_' + tileName + '.png'
          img.onload = function() {
            loadCount --
            this.tileSprites[key].push(img)
            if (loadCount === 0) this.allLoaded()
          }.bind(this)
        }
      }
    })

    for (let characterNames of this.characterNames) {
      let key = 'character' + '-' + characterNames[0].split('_')[0]
      this.characterSprites[key] = []
      for (var characterName of characterNames) {
        loadCount++
        let img = new Image()
        img.src = '/assets/sprites/' + 'character' + '-' + characterName + '.png'
        img.onload = function () {
          loadCount--
          this.characterSprites[key].push(img)
          if (loadCount === 0) this.allLoaded()
        }.bind(this)
      }
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