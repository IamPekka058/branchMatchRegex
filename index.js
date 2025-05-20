const fs = require('fs');
const YAML = require('yaml');

const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
    try{

        // Regex can be provided as a yaml array. Either one element or multiple elements
        // Example:
        // regex: "regex1"
        //
        // Example 2:
        // regex:
        //   - "regex1"
        //   - "regex2"
        const regex = core.getInput('regex', { required: false, default: null });
        const pathToRegexFile = core.getInput('path', { required: false, default: null });
        
        // Check if the current branch is a pull request
        const context = github.context;
        if (!context.payload.pull_request) {
            core.setFailed('This action can only be run in the context of a pull request');
            return;
        }

        const branchName = context.payload.pull_request.head.ref;

        if(pathToRegexFile === null && regex === null) {
            core.setFailed('Either path or regex must be provided');
            return;
        } else if(pathToRegexFile !== null && regex !== null) {
            core.info('Only one of path or regex must be provided. Using path.');
            return;
        }

        const useFile = pathToRegexFile !== null;

        if (useFile && !fs.existsSync(pathToRegexFile)) {
            core.setFailed(`File "${pathToRegexFile}" does not exist.`);
            return;
        }
        
        let regexContent = [];
        
        if (useFile) {
            const file = fs.readFileSync(pathToRegexFile, 'utf8');
            regexContent = YAML.parse(file);
        } else {
            regexContent = YAML.parse(regex);
        }        

        for (const regex of regexContent) {
            
            const regexPattern = new RegExp(regex);
            
            if (regexPattern.test(branchName)) {
                core.info(`Branch name "${branchName}" matches the regex pattern "${regex}".`);
                return;
            }
        }

        core.setFailed(`Branch name "${branchName}" does not match any of the provided regex patterns.`);
    } catch (error) {
        core.setFailed(error.message);
    }
}