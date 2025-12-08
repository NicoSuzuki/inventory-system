require('dotenv').config()

const express = require('express')
const cors = require('cors')
const pool = require('./config/db')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => { res.send('API is up and running') })

const productsRouter = require('./routes/products');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');

app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/users', usersRouter);

app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ error: message });
});

const PORT = process.env.PORT || 3000
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

async function shutdown() {
    console.log('\nReceived shutdown signal, closing resources...')
    try {
        if (pool && pool.end) {
            await pool.end()
            console.log('DB pool closed')
        }
    } catch (err) {
        console.error('Error closing DB pool:', err)
    }

    server.close(() => {
        console.log('HTTP server closed')
        process.exit(0)
    })

    setTimeout(() => {
        console.error('Could not close connections in time, forcing exit')
        process.exit(1)
    }, 10000)
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)