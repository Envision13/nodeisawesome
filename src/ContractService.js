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
}

module.exports = ContractService