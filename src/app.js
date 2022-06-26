const express = require('express')
const bodyParser = require('body-parser')
const { getProfile } = require('./middleware/getProfile')
const ContractService = require('./ContractService')

/*
  npm run test - to test the Business Logic
*/

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

app.get('/admin/best-profession?start=<date>&end=<date></date>', getProfile, async (req, res) => {
  const { start, end } = req.params

  /* 
    get contractors
  [
    id, profession1
    id, profession2
  ]

  Profession1 : ContractorId, id, id
  Profession2: ContractorId, id, id

  Profession1: Contracts id, id, id ... 
  Profession2: Contracts id, id, id ...

  Profession1: get jobs by Contract id ( where createdAt is in interval - stard/end) -> jobid id id ... ... returns SUM <paid>
  Profession2: get jobs by Contract id ( where createdAt is in interval - stard/end) -> jobid id id ... ... returns SUM <paid>

  key            value
  profession     total (SUM paid)
  profession2    total2

  create an array of the above key values objects .. [{profession: programmer, income: x}]
  sort array by income
  return the array
  */
  return true
})

app.get('/admin/best-clients?start=<date>&end=<date>&limit=<integer>', getProfile, async (req, res) => {
  const { start, end } = req.params

  /*
     with this limit taking in mind, it would be better to make this "get" explained in pseudocode above, done by SQL.
     without limit, the pseudo code above would work good enough, a lot of System - DB processing a lot, but it would be ok.
     with limit, would be also ok but not as great as using sql only

     About using sql only to get the most paid professions in an interval:
      - select contactors group by profession -> 
        -> sub query select * from contracts where contract id IN ..
          -> select jobs apply filters - returns somehow SUM(paid)
      .sort(by total)
      .limit(10)

      I might be wrong, it seems like to compute all of this, requires to load every resource therefore the db processing will be the same as described in the route before.

      I would sugest to make it work in a nodejs - js - db way, not using only one query . ( or ask a SQL EXPERT)

  */

  return true
})




module.exports = app
