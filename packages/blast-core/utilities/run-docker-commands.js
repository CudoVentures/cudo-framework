const {
  spawnSync,
  spawn
} = require('child_process')
const BlastError = require('./blast-error')
const {
  getDockerComposeInitFile,
  getDockerComposeStartFile
} = require('./package-info')

const dockerComposeCmd = `docker-compose -f ${getDockerComposeStartFile()} -f ${getDockerComposeInitFile()} `
const DOCKER_RUN_CMD = 'docker run --rm '
const NODE_CMD = 'exec cudos-node cudos-noded '
const NODE_CMD_TTY = 'exec -T cudos-node cudos-noded '
const NODE_MULTI_CMD = 'exec cudos-node sh -c '
const NODE_MULTI_CMD_TTY = 'exec -T cudos-node sh -c '
const CHECK_DOCKER_STATUS = 'docker info 1> /dev/null'

const runCommand = function(cmd) {
  const childResult = spawnSync(cmd, {
    stdio: 'inherit',
    shell: true
  })
  if (childResult.status !== 0) {
    throw new BlastError(`An error occured while executing a command in docker container/local node: ${cmd}`)
  }
}

const runCommandAsync = function(cmd) {
  spawn(cmd, {
    stdio: 'inherit',
    shell: true
  })
}

const executeCompose = function(arg) {
  runCommand(dockerComposeCmd + arg)
}

const executeComposeAsync = function(arg) {
  runCommandAsync(dockerComposeCmd + arg)
}

const executeRun = function(arg) {
  runCommand(DOCKER_RUN_CMD + arg)
}

const executeNode = function(arg, enableTty = true) {
  const nodeCmd = enableTty ? NODE_CMD_TTY : NODE_CMD
  runCommand(dockerComposeCmd + nodeCmd + arg)
}

const executeNodeMultiCmd = function(arg, enableTty = true) {
  const nodeMultiCmd = enableTty ? NODE_MULTI_CMD_TTY : NODE_MULTI_CMD
  runCommand(dockerComposeCmd + nodeMultiCmd + `'${arg}'`)
}

const checkDockerStatus = async function() {
  try {
    await runCommand(CHECK_DOCKER_STATUS)
  } catch (error) {
    if (error instanceof BlastError) {
      throw new BlastError('Cannot connect to the Docker daemon. Is the docker daemon running?')
    }
  }
}

module.exports = {
  executeCompose: executeCompose,
  executeComposeAsync: executeComposeAsync,
  executeRun: executeRun,
  executeNode: executeNode,
  executeNodeMultiCmd: executeNodeMultiCmd,
  checkDockerStatus: checkDockerStatus
}
