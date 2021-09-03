const core = require("@actions/core");
const github = require("@actions/github");

async function run() {
    try {
        const GITHUBTOKEN = core.getInput("GITHUBTOKEN");
        const octokit = github.getOctokit(GITHUBTOKEN);

        const owner = "Leomotors";

        const { context = {} } = github;
        const { issue, repository } = context.payload;

        const issues_count = issue.number;

        const repourl = repository.url.split('/');
        const repo = repourl[repourl.length - 1];

        const name = `THIS-REPO-HAS-${issues_count}-ISSUES`;

        // * Should not happen but in case it does
        if (repo == name) { return; }

        await octokit.request("PATCH /repos/{owner}/{repo}", {
            owner,
            repo,
            name,
        });

        console.log(`Updated Repository Name to ${name}`);

    }
    catch (err) {
        core.setFailed(err.message);
    }
}

run();
