import { Match } from '~/server/models/match.model'

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
    
    if (homeScore.wickets > 10 || awayScore.wickets > 10) {
      throw createError({
        statusCode: 400,
        message: 'Wickets cannot be more than 10'
      })
    }
    
    // Find match and update scores
    const match = await Match.findById(id)
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
    
    return match
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Error updating match score'
    })
  }
})