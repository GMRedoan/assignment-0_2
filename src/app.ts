import express, { type Application, type Request, type Response } from 'express'
import { authRoutes } from './module/auth/auth.route'

const app: Application = express()

app.use(express.json())

app.get('/', (req: Request, res: Response) => {    
    res.send('Server is running!')
})

app.use('/api/auth', authRoutes)

export default app