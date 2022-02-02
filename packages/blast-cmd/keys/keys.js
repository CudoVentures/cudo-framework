const {
  executeNode,
  executeNodeMultiCmd
} = require('../../blast-utilities/run-docker-commands')
const { checkNodeOnline } = require('../../blast-utilities/get-node-status')

const keysListCmd = async function() {
  await checkNodeOnline()
  executeNode('keys list')
}

const keysAddCmd = async function(argv) {
  await checkNodeOnline()
  executeNodeMultiCmd(`cudos-noded keys add ${argv.name} && ` + transferTokensByNameCommand(
    'faucet', argv.name, '1000000000000000000'), argv.tty)
}

const keysRmCmd = async function(argv) {
  await checkNodeOnline()
  if (argv.force) {
    executeNode(`keys delete ${argv.name} --yes`)
    return
  }
  executeNode(`keys delete ${argv.name}`, false)
}

const keysFundCmd = async function(argv) {
  await checkNodeOnline()
  executeNodeMultiCmd(transferTokensByNameCommand('faucet', argv.name, argv.tokens))
}

function transferTokensByNameCommand(fromName, toName, amount) {
  return `cudos-noded tx bank send ${fromName} $(cudos-noded keys show ${toName} -a) ${amount}acudos ` +
    '--chain-id cudos-network --yes'
}

module.exports = {
  keysListCmd: keysListCmd,
  keysAddCmd: keysAddCmd,
  keysRmCmd: keysRmCmd,
  keysFundCmd: keysFundCmd
}
