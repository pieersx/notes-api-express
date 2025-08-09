const app = require('./app')
const { PORT } = require('./config/database')
const logger = require('./middleware/logger')

app.listen(PORT, () => {
  logger.info(`\nServidor ejecutándose en http://localhost:${PORT}`)
})
