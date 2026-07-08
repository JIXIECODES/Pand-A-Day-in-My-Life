\# Required Startup Behavior

Before making any code changes, the assistant must read this file first.

For every task:  
1\. Read \`AGENTS.md\`.  
2\. Review \`package.json\`, \`README.md\`, and the relevant files in \`src/\`.  
3\. Explain which files are relevant to the user’s request.  
4\. Make focused changes only.  
5\. Summarize the changed files after editing.

# **Project Agent Rules**

These rules explain how an AI assistant should work with this repository.

## **Main Goal**

Before making changes, always understand the project structure, current files, and existing design patterns. Do not make random changes without first checking how the project is already built.

## **First Step: Scan the Repository**

Whenever asked to work on this repo, first review the important files and folders, including:

* `package.json`  
* `README.md`  
* `src/`  
* `src/components/`  
* `src/pages/`  
* `src/styles/`  
* `src/assets/`  
* any existing configuration files  
* any files related to routing, layout, state, or styling

After scanning, briefly explain what the project appears to be, what framework it uses, and which files are most relevant to the requested task.

## **Follow Existing Style**

Match the existing project style instead of rewriting everything.

Follow the current patterns for:

* component structure  
* file naming  
* folder organization  
* CSS or styling approach  
* colors and theme  
* spacing and layout  
* animations  
* imports and exports

Do not introduce a new library unless it is clearly necessary.

## **Make Focused Changes**

Only change files that are needed for the request.

Avoid:

* unnecessary rewrites  
* deleting working code  
* changing unrelated features  
* renaming files without a clear reason  
* replacing the entire app structure unless asked

When editing, preserve existing functionality unless the request specifically says to remove or change it.

## **Explain What Changed**

After making changes, summarize:

* which files were changed  
* what was added  
* what was removed  
* what was improved  
* any known issues or next steps

Keep the explanation beginner-friendly.

## **React \+ Vite Project Expectations**

If this is a React \+ Vite project, follow these expectations:

* Use functional React components.  
* Keep components reusable and organized.  
* Prefer clear prop names.  
* Keep state simple unless a more advanced solution is needed.  
* Avoid overengineering.  
* Make the UI responsive for desktop and mobile.  
* Keep accessibility in mind with readable contrast, proper buttons, labels, and semantic HTML.

## **UI/UX Rules**

When working on the design:

* Keep layouts clean, modern, and polished.  
* Use consistent spacing.  
* Avoid clutter.  
* Make cards, sections, and buttons feel visually balanced.  
* Make important actions easy to find.  
* Use hover states and smooth transitions when appropriate.  
* Preserve the app’s existing personality and theme.

## **Code Quality Rules**

Code should be:

* readable  
* organized  
* beginner-friendly  
* easy to modify later  
* free of unused imports  
* free of console errors  
* consistent with the rest of the project

Avoid overly complex solutions.

## **GitHub Pages / Deployment Awareness**

If the project is deployed with GitHub Pages, be careful with:

* Vite `base` configuration  
* asset paths  
* routing issues  
* broken links  
* case-sensitive file names  
* missing build files

Before suggesting deployment fixes, inspect the relevant configuration files.

## **When the User Gives a Task**

When the user asks for a change, follow this process:

1. Identify which files are relevant.  
2. Inspect those files before editing.  
3. Make the smallest complete change needed.  
4. Check for broken imports or syntax issues.  
5. Summarize the work clearly.  
6. Suggest the next useful improvement if appropriate.

## **Do Not Assume**

Do not assume the project structure, styling method, or dependencies without checking the files first.

If something is unclear, make the best reasonable choice based on the existing repo and explain the assumption.

## **Beginner-Friendly Support**

The user may still be learning web development. Explain important decisions in simple terms when helpful.

Avoid unnecessary jargon. When using technical terms, explain them briefly.

## **Priority Order**

When making decisions, prioritize:

1. Keeping the app working  
2. Matching the user’s request  
3. Preserving existing design and features  
4. Improving organization only when useful  
5. Keeping the code easy to understand

