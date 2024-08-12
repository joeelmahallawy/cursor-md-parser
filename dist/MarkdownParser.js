"use strict";
const blogpostMarkdown = `# control

*humans should focus on bigger problems*

## Setup

\`\`\`bash
git clone git@github.com:anysphere/control
\`\`\`

\`\`\`bash
./init.sh
\`\`\`

## Folder structure

**The most important folders are:**

1. \`vscode\`: this is our fork of vscode, as a submodule.
2. \`milvus\`: this is where our Rust server code lives.
3. \`schema\`: this is our Protobuf definitions for communication between the client and the server.

Each of the above folders should contain fairly comprehensive README files; please read them. If something is missing, or not working, please add it to the README!

Some less important folders:

1. \`release\`: this is a collection of scripts and guides for releasing various things.
2. \`infra\`: infrastructure definitions for the on-prem deployment.
3. \`third_party\`: where we keep our vendored third party dependencies.

## Miscellaneous things that may or may not be useful

##### Where to find rust-proto definitions

They are in a file called \`aiserver.v1.rs\`. It might not be clear where that file is. Run \`rg --files --no-ignore bazel-out | rg aiserver.v1.rs\` to find the file.

## Releasing

Within \`vscode/\`:

- Bump the version
- Then:

\`\`\`
git checkout build-todesktop
git merge main
git push origin build-todesktop
\`\`\`

- Wait for 14 minutes for gulp and ~30 minutes for todesktop
- Go to todesktop.com, test the build locally and hit release
`;
let currentContainer = null;
// Do not edit this method
function runStream() {
    currentContainer = document.getElementById("markdownContainer");
    // this randomly split the markdown into tokens between 2 and 20 characters long
    // simulates the behavior of an ml model thats giving you weirdly chunked tokens
    const tokens = [];
    let remainingMarkdown = blogpostMarkdown;
    while (remainingMarkdown.length > 0) {
        const tokenLength = Math.floor(Math.random() * 18) + 2;
        const token = remainingMarkdown.slice(0, tokenLength);
        tokens.push(token);
        remainingMarkdown = remainingMarkdown.slice(tokenLength);
    }
    const toCancel = setInterval(() => {
        const token = tokens.shift();
        if (token) {
            addToken(token);
        }
        else {
            clearInterval(toCancel);
        }
    }, 20);
}
// dont be afraid of using globals for state
/*YOUR CODE HERE
this does token streaming with no styling right now
your job is to write the parsing logic to make the styling work
*/
let isInCodeBlock = false;
let isInInlineCode = false;
let buffer = "";
let currentElement = null;
function addToken(token) {
    if (!currentContainer)
        return;
    buffer += token;
    while (buffer.length > 0) {
        if (isInCodeBlock) {
            // inside a code block, look for the closing triple backticks
            const endCodeBlockIndex = buffer.indexOf("```");
            if (endCodeBlockIndex !== -1) {
                // add content to the current code block
                currentElement.innerText += buffer.slice(0, endCodeBlockIndex);
                buffer = buffer.slice(endCodeBlockIndex + 3);
                isInCodeBlock = false;
                currentElement = null; // End the code block
            }
            else {
                // no closing triple backticks, append all buffer content to the code block
                currentElement.innerText += buffer;
                buffer = "";
            }
        }
        else if (isInInlineCode) {
            // inside an inline code block, look for the closing single backtick
            const endInlineCodeIndex = buffer.indexOf("`");
            if (endInlineCodeIndex !== -1) {
                // append content to the current inline code block
                currentElement.innerText += buffer.slice(0, endInlineCodeIndex);
                buffer = buffer.slice(endInlineCodeIndex + 1);
                isInInlineCode = false;
                currentElement = null; // end inline code block
            }
            else {
                // no closing single backtick, append all buffer content to the inline code block
                currentElement.innerText += buffer;
                buffer = "";
            }
        }
        else {
            // check for the start of code blocks or inline code
            if (buffer.startsWith("```")) {
                isInCodeBlock = true;
                buffer = buffer.slice(3);
                // start a new code block
                currentElement = document.createElement("pre");
                currentContainer.appendChild(currentElement);
            }
            else if (buffer.startsWith("`")) {
                isInInlineCode = true;
                buffer = buffer.slice(1);
                // start a new inline code block
                currentElement = document.createElement("code");
                currentContainer.appendChild(currentElement);
            }
            else {
                // normal text handling, find the next special character
                const nextSpecialCharIndex = Math.min(...["`", "```"].map((s) => buffer.indexOf(s)).filter((i) => i !== -1));
                // append text up to the next special character or the entire buffer
                const textContent = nextSpecialCharIndex !== -1
                    ? buffer.slice(0, nextSpecialCharIndex)
                    : buffer;
                // handle "pre" blocks or normal text
                if (currentElement &&
                    (currentElement.tagName === "SPAN" ||
                        currentElement.tagName === "PRE")) {
                    currentElement.innerText += textContent;
                }
                else {
                    currentElement = document.createElement("span");
                    currentElement.innerText = textContent;
                    currentContainer.appendChild(currentElement);
                }
                buffer = buffer.slice(textContent.length);
            }
        }
    }
}
//# sourceMappingURL=MarkdownParser.js.map