import mongoose from 'mongoose'

const teamStatsSchema = new mongoose.Schema({
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  points: {
    type: Number,
    default: 0
  },
  matchesPlayed: {
    type: Number,
    default: 0
  },
  matchesWon: {
    type: Number,
    default: 0
  },
  matchesLost: {
    type: Number,
    default: 0
  },
  matchesDrawn: {
    type: Number,
    default: 0
  },
  runsScored: {
    type: Number,
    default: 0
  },
  wicketsTaken: {
    type: Number,
    default: 0
  },
  oversFaced: {
    type: Number,
    default: 0
  },
  oversBowled: {
    type: Number,
    default: 0
  },
  runsConceded: {
    type: Number,
    default: 0
  }
})

const tournamentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  selectedTeams: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  }],
  matches: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Match'
  }],
  teamStats: [teamStatsSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

export const Tournament = mongoose.model('Tournament', tournamentSchema)