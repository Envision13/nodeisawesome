const { Profile, Contract, Job } = require('../src/model');
const ContractService = require('../src/ContractService')
const contractService = new ContractService()

class Helper {
  static async createProfile (profile) {
    const profileToBeCreated = {
      firstName: 'John',
      lastName: 'Snow',
      profession: 'NightWatch',
      balance: 444,
      type: 'client',
      ...profile
    }
    const dbProfile = await Profile.create(profileToBeCreated)
    return dbProfile.dataValues
  }

  static async createContract (contract, clientId, contractorId) {
    const contractToBeCreated = {
      terms: 'hue hue hue',
      status: 'new',
      ClientId: clientId,
      ContractorId: contractorId,
      ...contract
    }

    const dbContract = await Contract.create(contractToBeCreated)
    return dbContract.dataValues
  }

  static async createJob (job, contractId) {
    const now = new Date()
    const jobToBeCreated = {
      description: 'fullstack',
      price: 40000,
      paid: false,
      paymentDate: now.toISOString(), 
      ContractId: contractId,
      ...job
    }

    const dbJob = await Job.create(jobToBeCreated)
    return dbJob.dataValues
  }

  static async getContractById (userId, contractId) {
    return contractService.getContractById(userId, contractId)
  }

  static async getActiveContracts (userId) {
    return contractService.getActiveContracts(userId)
  }

  static async getActiveUnpaidJobs (userId) {
    return contractService.getActiveUnpaidJobs(userId)
  }
}

module.exports = Helper