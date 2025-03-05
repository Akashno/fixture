import { Tournament } from '~/server/models/tournament.model'

export default defineEventHandler(async (event) => {
  try {
    const tournaments = await Tournament.find().populate('selectedTeams').sort({ createdAt: -1 })
    return tournaments
  } catch (error) {
    console.error('Error fetching tournaments:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch tournaments'
    })
  }
})