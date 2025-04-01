import { connectDB } from '../utils/db'
import '../models/team.model'
import '../models/tournament.model'
import '../models/match.model'

export default defineNitroPlugin(async () => {
  await connectDB()
})