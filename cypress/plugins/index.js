module.exports = (on, config) => {
  if (config.env.BACKEND_SCRIPTS_PATH) {
    on('task', {
      clearDb: () => {
        return require(config.env.BACKEND_SCRIPTS_PATH+'clear-collections.js')()
        .then(() => 'Database cleared!')
      },
      addUser: (data) => {
        return require(config.env.BACKEND_SCRIPTS_PATH+'add-user.js')(data)
        .then(() => 'User added!')
      },
      addTempUser: (data) => {
        return require(config.env.BACKEND_SCRIPTS_PATH+'add-tempuser.js')(data)
        .then(() => 'Temp User added!')
      },
      removeOperations: (data) => {
        return require(config.env.BACKEND_SCRIPTS_PATH+'remove-operations.js')(data)
        .then(() => 'Operations removed!')
      }
    })
  }
}