const { Contract, Job, Profile } = require('./model');
const { Op } = require('sequelize')
const { sequelize } = require('./model')

class ContractService {

  async getContractById(userId, contractId) {
    const contract = await Contract.findOne({
      where: {
        id: contractId,
        [Op.or]: [{ ContractorId: userId }, { ClientId: userId }]
      }
    })
    if (contract) return contract.dataValues
    return null
  }

  async getActiveContracts(userId) {
    const contracts = await Contract.findAll({
      where: {
        [Op.or]: [{ ContractorId: userId }, { ClientId: userId }],
        status: {
          [Op.or]: ['new', 'in_progress']
        }
      }
    })
    if (contracts) return contracts.map(contract => contract.dataValues)
    return null
  }

  async getActiveUnpaidJobs(userId) {
    const contracts = await Contract.findAll({
      include: { all: true },
      where: {
        [Op.or]: [{ ContractorId: userId }, { ClientId: userId }],
        status: {
          [Op.or]: ['new', 'in_progress']
        }
      }
    })
    const jobs = contracts.map(function(contract) {
      return contract.dataValues.Jobs.map(job => job.dataValues)
    })
    return Object.keys(jobs[0]).map(myKey => jobs[0][myKey])
  }

  async payJob(userId, jobId) {
    const job = await Job.findOne({
      include: { all: true },
      where: {
        id: jobId
      }
    })

    if (!job) return false
    const contract = job.dataValues.Contract

    if (contract.dataValues.ClientId !== userId) return false

    const client = await Profile.findOne({
      where: {
        id: contract.dataValues.ClientId
      }
    })
    if (!client) return false
    const contractor = await Profile.findOne({
      where: {
        id: contract.dataValues.ContractorId
      }
    })
    if (!contractor) return false

    if (client.balance < job.dataValues.price) return false
    const t = await sequelize.transaction();
    try {
      await sequelize.transaction(async (t) => {
        client.balance = client.balance - job.dataValues.price
        await client.save({ transaction: t })
        contractor.balance = contractor.balance + job.dataValues.price
        await contractor.save({ transaction: t })
      });

      await t.commit()
      // If the execution reaches this line, the transaction has been committed successfully
      // `result` is whatever was returned from the transaction callback (the `user`, in this case)
    } catch (error) {
      await t.rollback()
      // If the execution reaches this line, an error occurred.
      // The transaction has already been rolled back automatically by Sequelize!
    }
    
    job.paid = true
    job.paymentDate = new Date()
    await job.save()
    return true
  }
}

module.exports = ContractService