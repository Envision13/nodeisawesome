const Helper = require('./Helper')

var assert = require('assert')

describe('Contracts', function () {
  describe('Contracts', function () {
    it('should return the contract only if it belongs to the profile calling', async () => {
      const randomUser = await Helper.createProfile({})
      const client = await Helper.createProfile({})
      const contractor = await Helper.createProfile({ type: 'contractor'})
      const contract = await Helper.createContract({}, client.id, contractor.id)

      const getContractByIdClient = await Helper.getContractById(client.id, contract.id)

      delete getContractByIdClient.createdAt
      delete getContractByIdClient.updatedAt
      assert.deepStrictEqual(getContractByIdClient, {
        ClientId: client.id,
        ContractorId: contractor.id,
        id: contract.id,
        status: contract.status,
        terms: contract.terms,
      })

      getContractByIdContractor = await Helper.getContractById(contractor.id, contract.id)
      delete getContractByIdContractor.createdAt
      delete getContractByIdContractor.updatedAt
      assert.deepStrictEqual(getContractByIdContractor, {
        ClientId: client.id,
        ContractorId: contractor.id,
        id: contract.id,
        status: contract.status,
        terms: contract.terms,
      })

      const invalidClient = await Helper.getContractById(randomUser.id, contract.id)
      assert.deepStrictEqual(invalidClient, null, 'The user does not have permissions')
    })

    it('should return only active contracts of a user', async () => {
      const randomUser = await Helper.createProfile({})
      const client = await Helper.createProfile({})
      const contractor = await Helper.createProfile({ type: 'contractor'})
      const firstContract = await Helper.createContract({}, client.id, contractor.id)
      const secondContract = await Helper.createContract({}, randomUser.id, contractor.id)
      const thirdContract = await Helper.createContract({status: 'in_progress'}, client.id, randomUser.id)
      const fourthContract = await Helper.createContract({status: 'terminated'}, client.id, randomUser.id)

      const getActiveContracts = await Helper.getActiveContracts(randomUser.id)
      assert.deepStrictEqual(getActiveContracts.length, 2)

      delete getActiveContracts[0].createdAt
      delete getActiveContracts[0].updatedAt
      delete getActiveContracts[1].createdAt
      delete getActiveContracts[1].updatedAt
      assert.deepStrictEqual(getActiveContracts, [{
        ClientId: randomUser.id,
        ContractorId: contractor.id,
        id: secondContract.id,
        status: secondContract.status,
        terms: secondContract.terms,
      }, {
        ClientId: client.id,
        ContractorId: randomUser.id,
        id: thirdContract.id,
        status: thirdContract.status,
        terms: thirdContract.terms,
      }])
    })
  })

  describe('Jobs', function () {
    it('should return the jobs of active contracts of a user', async () => {
      const client = await Helper.createProfile({})
      const contractor = await Helper.createProfile({ type: 'contractor'})
      const contract = await Helper.createContract({}, client.id, contractor.id)
      const firstJob = await Helper.createJob({ description: 'security'}, contract.id)
      const secondJob = await Helper.createJob({}, contract.id)
      const thirdJob = await Helper.createJob({}, contract.id)
      const getActiveUnpaidJobs = await Helper.getActiveUnpaidJobs(client.id)
      assert.deepStrictEqual(getActiveUnpaidJobs.length, 3)
      delete getActiveUnpaidJobs[2].createdAt
      delete getActiveUnpaidJobs[2].updatedAt
      assert.deepStrictEqual(getActiveUnpaidJobs[2], {
        ContractId: contract.id,
        description: firstJob.description,
        id: firstJob.id,
        paid: firstJob.paid,
        paymentDate: firstJob.paymentDate,
        price: firstJob.price
      })

    })
  })
})