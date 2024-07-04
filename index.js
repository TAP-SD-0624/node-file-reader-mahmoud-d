const { readFile } = require("fs/promises");

async function readJsonFile(filePath) {
  try {
    const data = await readFile(filePath, "utf8");
    const jsonData = JSON.parse(data);
    return jsonData.files;
  } catch (error) {
    console.error(`Error reading or parsing the file: ${error.message}`);
    return null;
  }
}

// Read the file
async function readFiles(files) {
  let data = [];
  for (const filePath of files) {
    try {
      const fileData = await readFile(filePath, "utf8");
      data.push(fileData);
    } catch (error) {
      console.error(`Got an error trying to read the file: ${error.message}`);
      data.push(null);
    }
  }
  return data;
}

function countWords(dataArray) {
  let wordCount = [];
  dataArray.forEach((fileData) => {
    if (fileData !== null) {
      wordCount.push(
        fileData.split(/\s+/).filter((word) => word.length > 0).length
      );
    } else {
      wordCount.push(null);
    }
  });

  return wordCount;
}

async function main() {
  let files = await readJsonFile("config.json");
  if (!Array.isArray(files)) {
    console.error("The JSON file does not contain a valid array of file paths");
    return;
  }
  let data = await readFiles(files);
  if (data.length === 0) {
    console.error("No data read from files");
    return;
  }
  const wordsCount = countWords(data);
  for (let i = 0; i < files.length; i++) {
    if (wordsCount[i] !== null) {
      console.log(`The file "${files[i]}" has ${wordsCount[i]} words`);
    } else {
      console.log(`The file "${files[i]}" doesn't exist!!`);
    }
  }
}

main();
