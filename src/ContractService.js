const { Contract } = require('./model');
const { Op } = require('sequelize')

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
    console.log('SERVICE HERE\n', contracts)
    if (contracts) return contracts.map(contract => contract.dataValues)
    return null
  }
}

module.exports = ContractService