const Helper = require('./Helper')

var assert = require('assert')

describe('APP TEST', function () {
  describe('Contracts', function () {
    it('it should return the contract only if it belongs to the profile calling', async () => {
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
  })
})