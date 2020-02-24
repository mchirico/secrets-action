import * as core from '@actions/core'
import * as fs from 'fs'
import {wait} from './wait'
import {make} from './make'
import * as exec from '@actions/exec'

const startAsync = async (callback: {
  (text: string): void
  (arg0: string): void
}): Promise<void> => {
  const directory: string = core.getInput('directory')

  await exec.exec('mkdir', ['-p', directory])
  callback(`created: ${directory}`)

  const ms: string = core.getInput('milliseconds')
  await wait(parseInt(ms, 10))
  callback('Done wait')

  const idRsa: string = core.getInput('id_rsa')
  fs.writeFileSync(`${directory}/id_rsa`, `${idRsa}`)

  const user: string = core.getInput('user')
  fs.writeFileSync(`${directory}/USER`, user)

  const server: string = core.getInput('server')
  fs.writeFileSync(`${directory}/SERVER`, server)

  callback('Done server')
}

async function run(): Promise<void> {
  try {
    startAsync((text: string) => {
      core.debug(text)
    })
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
