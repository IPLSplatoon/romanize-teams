# romanize-teams

A quick utility to add romaji alternatives to team and player names with Japanese characters.  
Uses the [ipl-overlay-controls](https://github.com/inkfarer/ipl-overlay-controls) tournament data format.

## Usage

- Install dependencies: `npm i`
- Run the program: `node index.js [path]`
- On completion, the output file name will be printed to the console.
- **The tokenizer may occasionally make mistakes when converting team names to romaji - Before using the output, 
  search for the string `undefined` inside it and manually fix any mistakes.**

View a sample input file in the `examples` directory of this repository.
