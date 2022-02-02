const {
  executeCompose,
  executeAttach
} = require('../../blast-utilities/run-docker-commands')
const {
  getNodeStatus,
  checkNodeOnline,
  checkNodeOffline
} = require('../../blast-utilities/get-node-status')
const { getAdditionalAccounts } = require('../../blast-utilities/config-utils')
const { handleAdditionalAccountCreation } = require('../../blast-utilities/account-utils')
const { delay } = require('../../blast-utilities/blast-helper')

const startNodeCmd = async function(argv) {
  await checkNodeOffline()

  executeCompose('up --build -d')

  while (true) {
    const nodeStatus = await getNodeStatus()
    if (nodeStatus.isConnected) {
      break
    }
    await delay(2)
  }
  // In order to wait the first block to be mined we have to wait additional ±4 seconds.
  await delay(4)

  const additionalAccounts = getAdditionalAccounts()
  if (additionalAccounts) {
    handleAdditionalAccountCreation(additionalAccounts)
  }

  if (!argv.daemon) {
    executeAttach()
  }
}

const stopNodeCmd = async function() {
  await checkNodeOnline()
  executeCompose('down')
}

const nodeStatusCmd = async function() {
  const nodeStatus = await getNodeStatus()
  console.log(nodeStatus.info)
}

module.exports = {
  startNodeCmd: startNodeCmd,
  stopNodeCmd: stopNodeCmd,
  nodeStatusCmd: nodeStatusCmd
}
