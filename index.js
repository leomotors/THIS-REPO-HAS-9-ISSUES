const core = require("@actions/core");
const github = require("@actions/github");

async function run() {
    try {
        const GITHUBTOKEN = core.getInput("GITHUBTOKEN");
        const octokit = github.getOctokit(GITHUBTOKEN);

        console.log(octokit);

        const owner = "Leomotors";

        const { context = {} } = github;
        const { issue, repository } = context.payload;

        const issues_count = issue.number;

        const repourl = repository.url.split('/');
        const repo = repourl[repourl.length - 1];

        try {
            await octokit.issues.createComment({
                ...context.repo,
                issue_number: issue.number,
                body: "Roger that!"
            });
        }
        catch (err) {
            console.log(`Cannot comment because of ${err.message}`);
        }

        const name = `THIS-REPO-HAS-${issues_count}-ISSUES`;

        // Should not happen but in case it does
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
