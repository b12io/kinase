# Kinase
Kinase (pronounced ki·nase) is a pluggable browser extension allowing you to label content on the web and use it for a wide variety of machine learning and data collection applications. By providing a set of `annotations` and their corresponding schemas, you can use Kinase to select the content best representing these annotations.


## Concepts
### Annotations
Annotations represent the labels for which you’d like to select content. An annotation is represented by a string identifier (e.g., `products`) and a schema containing the fields and their types that can be mapped to the annotation (e.g., `name`, `description`, `photo`). The schema can optionally specify the `multiple` flag to indicate that multiple groupings of these fields can be mapped to the annotation.

The currently supported field types are text, rich-text, and image. Help us out and add more! Here is an example description of a schema for a collection of `products`:

```JSON
{
  "products": {
    "multiple": true,
    "fields": {
      "name": "text",
      "description": "rich-text",
      "photo": "image"
    }
  }
}
```

### Mappings
A mapping represents selected content for a given annotation. If `multiple` is specified in its schema, the annotation can have multiple mappings. The mappings for an annotation will be in array form, but without the `multiple` flag the array will always be of length 1.

Each mapped field in a mapping contains the content taken from the website (with any additional user edits) and the original source of that content (the URL of the website it was taken from, and a unique CSS selector specifying its container).

The mappings for our `products` annotation might look like this:
```JSON
{
  "products": [{
    "name": {
      "content": "Laptop 3000",
      "sources": [{
        "url": "https://laptop-world.com",
        "selector": ".laptops:nth-child(0) > h3"
      }]
    },
    "description": {
      "content": "<p>Our <em>top of the line</em> model, now yours for only $9999.99!</p>",
      "sources": [{
        "url": "https://laptop-world.com",
        "selector": ".laptops:nth-child(0) > .description"
      }]
    },
    "photo": {
      "content": "https://laptop-world.com/laptop-3000.jpg",
      "sources": [{
        "url": "https://laptop-world.com",
        "selector": ".laptops:nth-child(0) > .photo"
      }]
    }
  }]
}
```

### Contexts
In Kinase, annotations and their mappings are grouped together in a context. This context is keyed by an arbitrary string and might represent a specific user tagging content in the extension or a project that content is being tagged for. In this case, our user is doing research on both laptop and desktop vendors, and is using a context to represent each of those research projects:

```JSON
{
  "laptop-research": {
    "products": []
  },
  "desktop-research": {
    "products": []
  }
}
```
(The array corresponding to the `products` key for both contexts would contain the corresponding mappings to that annotation, like the JSON above.)

To switch contexts from another extension or webpage (e.g., if a user first reads an instruction page, you can set the project context from there), you can send a message to the extension with:

```Javascript
chrome.runtime.sendMessage(
  EXTENSION_ID, {
    data: {
      contextKey: 'project-1234',
    },
  },
);
```

Make sure you configure externally_connectable in your manifest overrides to accept messages from the sender extension or web page.

You can get your EXTENSION_ID from the Chrome store once you've published your extension, or generate your own for development purposes only.

By default, all mapped content is stored in a default context, so if you don't need to switch contexts you can ignore the concept entirely.

## Configuration
Check out [our example](https://github.com/b12io/kinase-example) and read more about the options below!

First, install Kinase with
```bash
npm install kinase
```

Then, you can create your own derived extension:
```Javascript
const Kinase = require(‘kinase’)
const extension = new Kinase(options)
```
This will create a zipfile of your extension at the path provided in `options.output` (required).

### Providing a Custom API
To use Kinase with your own data, you’ll need to provide `options.api_file`, the path to your custom API. This file should be written in ES6 and will be injected into Kinase’s webpack build to create your customized extension.

This file should export a `load` function which retrieves the desired annotation schemas and any previously mapped content, returning JSON of the form:
```JSON
{
  "schemas": {
    "products": {}
  },
  "mappings": {
    "products": []
  }
}
```
(The `products` schema and mappings would look like the JSON examples in the concepts section.)

This file should also export a `save` function which posts any updated annotation mappings (user edits, new content selection/sources) to your server. This means that only a subset of annotation mappings will be passed to your server for a given `save` call (to save network overhead).

Both `load` and `save` take the current context key as an argument, so if you’re using contexts you should namespace your saved data accordingly.

### Adding Custom Dependencies
If your custom API imports node modules that aren’t in Kinase, you’ll need to add them manually in `options.dependencies` with `package.json` syntax.

### Overriding the Manifest
You can override properties in the [Chrome manifest file](https://developer.chrome.com/extensions/manifest) by passing `options.manifestOverrides` to the Kinase constructor. Your custom properties will be [merged](https://lodash.com/docs/4.17.4#merge) with the existing Kinase manifest. If you want to set the context from outside the extension, be sure to configure  `externally_connectable` accordingly!


## Why Kinase?
Kinases are enzymes that add phosphate groups to other proteins, often as an activation mechanism for complex regulatory pathways. We hope that, by adding annotations, our Kinase can make web content a more active component of your own pipelines!
