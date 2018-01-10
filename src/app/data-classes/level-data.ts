export class LevelData {
  tileTypes: any = {
    "grass": {
      walkable: true
    }, 
    "dirt": {
      walkable: true
    },
    "bridge": {
      walkable: true
    }
  }

  levels: any[] = [
    {
      title: "First level",
      connections: [
        {
          connectionId: 1,
          levelIndex: 1,
          pos: [10, 9],
          direction: 'left'
        },
        {
          connectionId: 2,
          levelIndex: 1,
          pos: [7, 12],
          direction: 'up'
        }
      ],
      tiles: [
        [["grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass"], ["dirt", "dirt", "dirt", "dirt", "dirt", "dirt", "dirt", "dirt", "dirt", "dirt", "dirt", "dirt", "dirt", "dirt", "dirt", "grass"], ["grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "dirt", "grass"], ["grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "dirt", "grass"], ["grass", "grass", "grass", "grass", "grass", "dirt", "dirt", "dirt", "dirt", "dirt", "dirt", "dirt", "dirt", "dirt", "dirt", "grass"], ["grass", "grass", "grass", "grass", "grass", "dirt", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass"], ["grass", "grass", "grass", "grass", "grass", "dirt", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass"], ["grass", "grass", "grass", "grass", "grass", "dirt", "grass", "dirt", "dirt", "dirt", "dirt", "grass", "grass", "grass", "grass", "grass"], ["grass", "grass", "dirt", "dirt", "dirt", "dirt", "dirt", "dirt", "dirt", "dirt", "dirt", "grass", "grass", "grass", "grass", "grass"], ["grass", "grass", "dirt", "grass", "grass", "grass", "grass", "dirt", "dirt", "dirt", "dirt", "grass", "grass", "grass", "grass", "grass"], ["grass", "grass", "dirt", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass"], ["grass", "grass", "dirt", "grass", "grass", "grass", "dirt", "dirt", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass"], ["grass", "grass", "dirt", "grass", "grass", "dirt", "dirt", "dirt", "dirt", "grass", "grass", "grass", "grass", "grass", "grass", "grass"], ["grass", "grass", "dirt", "grass", "grass", "dirt", "dirt", "dirt", "dirt", "grass", "grass", "grass", "grass", "grass", "grass", "grass"], ["grass", "grass", "grass", "grass", "grass", "grass", "dirt", "dirt", "dirt", "dirt", "dirt", "dirt", "dirt", "dirt", "dirt", "dirt"], ["grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass"]],
      ],
      objects: [
        {
          id: 1,
          type: 'hole',
          pos: [10, 9],
          needs: [3]
        },
        {
          id: 2,
          type: 'hole',
          pos: [7, 12]
        },
        {
          id: 3,
          type: 'key',
          pos: [2, 2],
          pickupable: true,
          name: 'Very special key'
        }
      ]
    },
    {
      title: "Test tunnel level with really long name",
      connections: [
        {
          connectionId: 1,
          levelIndex: 0,
          pos: [0, 0],
          direction: 'right'
        },
        {
          connectionId: 2,
          levelIndex: 0,
          pos: [7, 7],
          direction: 'up'
        }
      ],
      tiles: [
        [["dirt", "dirt", "dirt", "dirt", "dirt", "dirt", "dirt", "dirt"], ["dirt", "grass", "grass", "grass", "grass", "grass", "grass", "dirt"], ["dirt", "grass", "grass", "grass", "grass", "grass", "grass", "dirt"], ["dirt", "grass", "grass", "grass", "grass", "grass", "grass", "dirt"], ["dirt", "grass", "grass", "grass", "grass", "grass", "grass", "dirt"], ["dirt", "grass", "grass", "grass", "grass", "grass", "grass", "dirt"], ["dirt", "grass", "grass", "grass", "grass", "grass", "grass", "dirt"], ["dirt", "dirt", "dirt", "dirt", "dirt", "dirt", "dirt", "dirt"]]
      ],
      objects: [
        {
          id: 4,
          type: 'stairs',
          pos: [0, 0]
        },
        {
          id: 5,
          type: 'stairs',
          pos: [7, 7]
        }
      ]
    }
  ]
}