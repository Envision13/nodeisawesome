const express = require('express')
const bodyParser = require('body-parser')
const { getProfile } = require('./middleware/getProfile')
const ContractService = require('./ContractService')

const app = express()
app.use(bodyParser.json())
const contractService = new ContractService()

app.get('/contracts/:id', getProfile, async (req, res) => {
  const { id } = req.params
  const contract = await contractService.getContractById(req.profile.id, id)
  if (!contract) return res.status(404).end()
  res.json(contract)
})

app.get('/contracts', getProfile, async (req, res) => {
  const contracts = await contractService.getActiveContracts(req.profile.id)
  if (!contracts) return res.status(404).end()
  res.json(contracts)
})

app.get('/jobs/unpaid', getProfile, async (req, res) => {
  const jobs = await contractService.getActiveUnpaidJobs(req.profile.id)
  if (!jobs) return res.status(404).end()
  res.json(jobs)
})

app.post('/jobs/:job_id/pay', getProfile, async (req, res) => {
  const { job_id } = req.params
  const paymentStatus = await contractService.payJob(req.profile.id, job_id)
  res.json(paymentStatus)
})

app.post('/balances/deposit/:userId', getProfile, async (req, res) => {
  const { userId } = req.params
  if (parseInt(userId) !== req.profile.id) {
    res.json(false)
    return 
  }

  const makeDeposit = await contractService.makeDeposit(userId, req.body.deposit)
  res.json(makeDeposit)
})

module.exports = app
