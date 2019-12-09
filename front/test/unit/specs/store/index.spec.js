import { modules } from '@/store'

Object.keys(modules).forEach(e => {
  const module = modules[e]
  const NAME_MODULE = e
  describe(`Test Store module ${NAME_MODULE.toUpperCase()}`, () => {
    describe('initial state', () => {
      const { initialState } = module
      it(`${NAME_MODULE} should have initialState function`, () => {
        expect(typeof initialState).to.be.function
      })
      it(`${NAME_MODULE} should have initialState() return a Object`, () => {
        expect(typeof initialState()).to.be.an.object
      })
    })
    describe('state', () => {
      const { state } = module
      it(`${NAME_MODULE} should have state`, () => {
        expect(module.hasOwnProperty('state')).to.be.true
      })
      it(`${NAME_MODULE}.state should be a Object`, () => {
        expect(state).to.be.an.object
      })
      it(`users.state should be equivalent to initialState()`, () => {
        const initial = module.initialState()
        expect(JSON.stringify(initial) === JSON.stringify(state)).to.be.true
      })
    })
    describe('mutations', () => {
      const { mutations } = module
      it(`${NAME_MODULE} should have mutations`, () => {
        expect(module.hasOwnProperty('mutations')).to.be.true
      })
      it(`${NAME_MODULE}.mutations should be a Object`, () => {
        expect(typeof mutations).to.be.an.object
      })
      it(`${NAME_MODULE}.mutations should have reset property and it should be a function`, () => {
        expect(mutations.hasOwnProperty('reset')).to.be.true
        expect(typeof mutations.reset).to.be.function
      })
      describe(`${NAME_MODULE}.mutations.reset should reset state`, () => {
        it('Should reset all properties', () => {
          Object.keys(module.state).forEach(e => { module.state[e] = null })
          mutations.reset(module.state)
          const initial = module.initialState()
          expect(JSON.stringify(initial) === JSON.stringify(module.state)).to.be.true
        })
      })
    })
    describe('actions', () => {
      const { actions } = module
      it(`${NAME_MODULE} should have actions`, () => {
        expect(module.hasOwnProperty('actions')).to.be.true
      })
      it(`${NAME_MODULE}.actions should be a Object`, () => {
        expect(typeof actions).to.be.an.object
      })
    })
    describe('getters', () => {
      const { getters } = module
      it(`${NAME_MODULE} should have getters`, () => {
        expect(module.hasOwnProperty('getters')).to.be.true
      })
      it(`${NAME_MODULE}.getters should be a Object`, () => {
        expect(typeof getters).to.be.an.object
      })
    })
  })
})
