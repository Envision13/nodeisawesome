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


module.exports = app
