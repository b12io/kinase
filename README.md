# Tent
Tent is an extension for Google Chrome allowing users to map web content to a list of annotations.

## Contexts
In Tent, content mapped to the provided annotations is grouped together in a context. This context is keyed by an arbitrary string in the redux state, and might represent a specific user tagging content in the extension or a project that content is being tagged for.

To switch contexts from another extension or webpage (e.g., if a user first reads an instruction page, you can set the project context from there), you can send a message to the extension with:

```
chrome.runtime.sendMessage(
  EXTENSION_ID, {
    data: {
      contextKey: 'project-1234',
    },
  },
);
```

Make sure you configure [`externally_connectable`](https://developer.chrome.com/extensions/manifest/externally_connectable) in `manifest.json` to accept messages from the sender extension or web page.

You can get your `EXTENSION_ID` [from the Chrome store](https://developer.chrome.com/webstore/publish#get-the-app-id) once you've published your extension, or [generate your own](http://stackoverflow.com/questions/23873623/obtaining-chrome-extension-id-for-development) for development purposes only.

**By default, all mapped content is stored in a default context, so if you don't need to switch contexts you can ignore the concept entirely.**

## Publishing
Create the extension zipfile with `yarn package` and follow the web store [instructions](https://developer.chrome.com/webstore/publish). If you want to upload a new extension zipfile, you'll need to bump the version accordingly with `yarn package -- (patch|minor|major)`.
