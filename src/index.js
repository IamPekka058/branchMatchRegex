const fs = require('fs');
const YAML = require('yaml');
const path = require('path');

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
        const regex = core.getInput('regex', { required: false, default: "" });
        const useDefaultPatterns = core.getInput('useDefaultPatterns', { required: false, default: false });
        const failOnUnmatchedRegex = core.getInput('failOnUnmatchedRegex', { required: false, default: true });
        const inputPath = core.getInput('path', { required: false, default: "" });
        const branchName = core.getInput('branchName', { required: false, default: github.head_ref  });
        

        let pathToRegexFile = populateDefaultPatterns(inputPath, useDefaultPatterns);

        validateContext();

        validateInput(inputPath, regex, useDefaultPatterns);

        const useFile = pathToRegexFile && pathToRegexFile.strip !== '';

        if (useFile && !fs.existsSync(pathToRegexFile)) {
            core.setFailed(`File "${pathToRegexFile}" does not exist.`);
            return;
        }
        
        let regexContent = [];
        
        regexContent = parseYAML(useFile, pathToRegexFile, regex);
        
        if (!Array.isArray(regexContent)) {
            regexContent = [regexContent];
        }

        for (const regex of regexContent) {
            const regexPattern = new RegExp(regex);
            
            if (regexPattern.test(branchName)) {
                core.info(`Branch name "${branchName}" matches the regex pattern "${regex}".`);
                return;
            }
        }

        unmatchedRegex(branchName, failOnUnmatchedRegex);

    } catch (error) {
        core.setFailed(error.message);
    }
}

function validateInput(inputPath, regex, useDefaultPatterns) {
    let bothFilesSpecified = inputPath && (useDefaultPatterns === true || useDefaultPatterns === "true");
    let allInputsEmpty = !inputPath && !regex && !useDefaultPatterns;
    let bothInputAndRegexSpecified = inputPath && regex;
    
    if(bothFilesSpecified){
        core.setFailed('Path and useDefaultPatterns cannot be used together.');
        return;
    }

    if(allInputsEmpty){ 
        core.setFailed('Either path, regex or useDefaultPatterns must be provided.');
        return;
    }

    if(bothInputAndRegexSpecified) {
        core.info('Only one of path or regex must be provided. Using path.');
    }
}

function populateDefaultPatterns(inputPath, useDefaultPatterns) {
    if(useDefaultPatterns === true){
        return 'default-patterns.yml';
    }

    return inputPath;

}

function unmatchedRegex(branchName, failOnUnmatchedRegex) {
    if (failOnUnmatchedRegex) {
        core.setFailed(`Branch name "${branchName}" does not match any of the provided regex patterns.`);
        return;
    } else {
        // TODO: Comment on
    }
}

function validateContext(branchName) {
    const context = github.context;
    let branchNameUndefined = branchName === undefined || branchName === null || branchName.strip() === '';
    
    if (branchNameUndefined && !context.payload.pull_request) {
        core.setFailed('If branchName is not provided, the action must be run in a pull request context.');
        return;
    }
}

function parseYAML(useFile, filePath, regex) {
    if (useFile === true || useFile === 'true') {
        const file = fs.readFileSync(filePath, 'utf8');
        return YAML.parse(file);
    } else {
        return YAML.parse(regex);
    }
}

run();