import * as core from '@actions/core'
import * as github from '@actions/github'
import {wait} from './wait'

async function run(): Promise<void> {
  try {
    const token: string = core.getInput('githubToken')
    const octokit = new github.GitHub(token)
    const {repo, owner} = github.context.repo
    const openIssueResponse = await octokit.issues.listForRepo({
      repo,
      owner,
      state: 'open'
    })
    const openUnassignedIssueResponse = await octokit.issues.listForRepo({
      repo,
      owner,
      state: 'open',
      assignee: 'none'
    })
    const openIssues = openIssueResponse.data
    const openIssuesResp: any = openIssueResponse
    const openIssuesLink: string = openIssuesResp.url
    const openUnassignedIssues = openUnassignedIssueResponse.data
    core.setOutput('openIssues', `${openIssues.length}`)
    core.setOutput('openIssuesUnassigned', `${openUnassignedIssues.length}`)
    core.setOutput(
      'openIssuesLink',
      openIssuesLink.replace('api.github.com/repos/', 'github.com/')
    )
    core.setOutput(
      'openIssuesUnassignedLink',
      `${openIssuesLink.replace(
        'api.github.com/repos/',
        'github.com/'
      )}+no:assignee`
    )
    const ms: string = core.getInput('milliseconds')
    core.debug(`Waiting ${ms} milliseconds ...`)
    const myInput: string = core.getInput('myInput')
    core.debug(`myInput entered was: ${myInput}`)

    core.debug(new Date().toTimeString())
    await wait(parseInt(ms, 10))
    core.debug(new Date().toTimeString())

    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
