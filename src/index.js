const fs = require('fs');
const YAML = require('yaml');
const path = require('path');
const fetch = require('node-fetch');

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
        let regex = core.getInput('regex', { required: false, default: "" });
        const useDefaultPatterns = core.getBooleanInput('useDefaultPatterns', { required: false, default: false });
        const failOnUnmatchedRegex = core.getBooleanInput('failOnUnmatchedRegex', { required: false, default: true });
        const inputPath = core.getInput('inputPath', { required: false, default: "" });
        const useWildcard = core.getBooleanInput('useWildcard', { required: false, default: false });
        const branchName = core.getInput('branchName', { required: false, default: github.head_ref  });
        
        let pathToRegexFile = populateDefaultPatterns(inputPath, useDefaultPatterns);

        validateContext();

        validateInput(inputPath, regex, useDefaultPatterns);

        const useFile = pathToRegexFile && pathToRegexFile.strip !== '';

        if (useFile && !isUrl(pathToRegexFile) && !fs.existsSync(pathToRegexFile)) {
            core.setFailed(`File "${pathToRegexFile}" does not exist.`);
            return;
        }
        
        let regexContent = [];
        
        regexContent = await parseYAML(useFile, pathToRegexFile, regex);
        
        if (!Array.isArray(regexContent)) {
            regexContent = [regexContent];
        }

        for (regex of regexContent) {

            if (useWildcard) {
                core.info(`Using wildcard regex: "${regex}"`);
                regex = wildcardToRegex(regex);
                core.info(`Converted to regex: "${regex}"`);
            }
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
    let bothFilesSpecified = inputPath && useDefaultPatterns;
    let allInputsEmpty = !inputPath && !regex && !useDefaultPatterns;
    let bothInputAndRegexSpecified = inputPath && regex;
    
    if(bothFilesSpecified){
        core.setFailed('inputPath and useDefaultPatterns cannot be used together.');
        return;
    }

    if(allInputsEmpty){ 
        core.setFailed('Either inputPath, regex or useDefaultPatterns must be provided.');
        return;
    }

    if(bothInputAndRegexSpecified) {
        core.info('Only one of inputPath or regex must be provided. Using inputPath.');
    }
}

function populateDefaultPatterns(inputPath, useDefaultPatterns) {
    if (useDefaultPatterns) {
        return path.join(__dirname, '../assets/default-patterns.yml');
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

async function parseYAML(useFile, filePath, regex) {
    if (useFile) {
        if (isUrl(filePath)) {
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`Failed to fetch ${filePath}: ${response.status} ${response.statusText}`);
            }
            const body = await response.text();
            return YAML.parse(body);
        } else {
            const file = fs.readFileSync(filePath, 'utf8');
            return YAML.parse(file);
        }
    } else {
        return YAML.parse(regex);
    }
}

function wildcardToRegex(pattern) {
    // Escape regex special chars except *
    let regex = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
    // Replace * with .*
    regex = regex.replace(/\*/g, '.*');
    return `^${regex}`;
}

function isUrl(s) {
    return s.startsWith('http://') || s.startsWith('https://');
}

run();
