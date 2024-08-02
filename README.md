# Obsidian Scripts
## Premise
I like to take notes because I like typing and I like to spare my brain of the burden of remembering so much. 
More importantly, I would like it if I can find the information again easily after I have painstakingly made notes on a subject.

## How to use this package
Clone this and run the init.sh. The first and only argument is the path to your obisidan vault. 
After that, perform the following:
- Install the templater plugin
- Point the template dir to "\_\_templates\_\_"
- Point the script dir to "\_\_scripts\_\_"
- Enable user scripts

The scripts will expect the following directory structure in your vault. 
It is essential for your vault to be structured this way in order for the scripts to work. 

```
.
├── full\_notes
├── tags
├── __scripts__
└── __templates__
```

**full_notes** 
- Where your notes will be stored. Each level supports multiple indices.
- Each level should include a `index.md`. This is the index page for that level.
- Children folders should mirror that structure. As long as a child folder has a `index.md`, it will be linked by its parent level index.

**tags** 
- Where your tag pages will be saved. Each tag page is a collection of notes that contain a tag. 
- These are auto generated. Do not write in them because the content you produce will be wiped the next time it is updated. 

**\_\_scripts\_\_** 
- Where your user scripts will be stored. 
- Functions here are accessible via `tp.user.${export_func}`. 

**\_\_templates\_\_**
- This is where the templater templates are stored.

## Using the templates
There are 3 templates. 

**full note**
- This is a template for regular full note (i.e. not a tag page and not a index).

**index**
- This is the template for the index page.
- Most of the time this should only be used directly upon creation of a new index page.

**update all** 
- This is the template script that updates everything (i.e. all indices and all tag pages). 
- This is needed because in obisidan graphs can only be built via static content. This means dynamically generated content (e.g. dataview queries) cannot be used to generate graphs.
- Run this templater once in a while to make sure the graphs are up to date.
