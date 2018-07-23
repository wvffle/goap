const { Action, Agent } = require('../index')

describe('lumberjack', function () {
  // Add actions
  const getAxe = new Action({ cost: 1, name: 'get_axe' })
    .effect((state, id) => state[id].has_axe = true)

  const chopLogs = new Action({ cost: 4, name: 'chop' })
    .precondition((state, id) => state[id].has_axe === true)
    .effect((state, id) => state[id].has_axe = false)
    .effect((state, id) => state[id].wood += 10)


  const gatherWood = new Action({ cost: 8, name: 'gather' })
    .effect((state, id) => state[id].wood += 15)

  it('plans', () => {

    // Initialize world state
    const state = {
      lumberjack: {
        wood: 0,
        has_axe: false,
      },
    }

    // Add agents
    const lumberjack = new Agent(state, 'lumberjack')


    lumberjack.action(chopLogs)
    lumberjack.action(getAxe)
    lumberjack.action(gatherWood)

    lumberjack.goal('get wood', (prevState, nextState, id) => prevState[id].wood < nextState[id].wood)

    const plan = lumberjack.plan().map(a => a.name).reverse()
    expect(plan).toEqual([ 'get_axe', 'chop' ])
  })

  it('plans again', () => {

    // Initialize world state
    const state = {
      lumberjack: {
        wood: 0,
        has_axe: false,
      },
    }

    // Add agents
    const lumberjack = new Agent(state, 'lumberjack')


    lumberjack.action(chopLogs)
    lumberjack.action(getAxe)
    lumberjack.action(gatherWood)

    lumberjack.goal('get wood', (prevState, nextState, id) => 25 <= nextState[id].wood)

    const plan = lumberjack.plan().map(a => a.name).reverse()
    expect(plan).toEqual([ 'get_axe', 'chop', 'gather' ])
  })
})
