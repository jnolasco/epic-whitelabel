export default {
  state: {
    value: null
  },
  reducers: {
    sample: (state, payload) => {
      return {
        ...state,
        value: payload
      }
    }
  },
  effects: dispatch => ({

  })
}
