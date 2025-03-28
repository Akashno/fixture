import { Match } from '~/server/models/match.model'
import { updateTournamentStats } from '~/server/utils/tournament'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)
    
    const { homeScore, awayScore } = body
    
    // Validate score data
    if (!homeScore || !awayScore) {
      throw createError({
        statusCode: 400,
        message: 'Both home and away scores are required'
      })
    }

    // Validate overs format
    const validateOvers = (overs: number): boolean => {
      if (overs < 0) return false
      const [wholePart, decimalPart] = overs.toString().split('.')
      if (decimalPart && parseInt(decimalPart) >= 6) return false
      return true
    }
    
    if (
      homeScore.wickets > 10 || 
      awayScore.wickets > 10 ||
      !validateOvers(homeScore.overs) ||
      !validateOvers(awayScore.overs)
    ) {
      throw createError({
        statusCode: 400,
        message: 'Invalid score data'
      })
    }
    
    // Find match and update scores
    const match = await Match.findById(id).populate('tournament')
    if (!match) {
      throw createError({
        statusCode: 404,
        message: 'Match not found'
      })
    }
    
    // Update match scores
    match.homeScore = homeScore
    match.awayScore = awayScore
    match.status = 'completed'
    
    // Determine winner
    if (homeScore.runs > awayScore.runs) {
      match.winner = match.homeTeam
    } else if (awayScore.runs > homeScore.runs) {
      match.winner = match.awayTeam
    }
    
    match.updatedAt = new Date()
    await match.save()

    // Update tournament stats
    if (match.tournament) {
      await updateTournamentStats(match.tournament._id)
    }
    
    return match
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Error updating match score'
    })
  }
})