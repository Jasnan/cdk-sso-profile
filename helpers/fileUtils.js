const fs = require('fs');
const path = require('path');

/**
 * Lists all files in the specified directory, sorted by their modification time in descending order.
 * @param {string} directoryPath - The path of the directory.
 * @returns {string[]} - A list of file paths.
 */
const listFilesInDirectory = (directoryPath) => {
    let filePaths = [];
    if (fs.existsSync(directoryPath)) {
        filePaths = fs.readdirSync(directoryPath)
            .map(fileName => {
                return {
                    name: fileName,
                    time: fs.statSync(path.join(directoryPath, fileName)).mtime.getTime()
                };
            })
            .sort((a, b) => b.time - a.time)
            .map(v => path.join(directoryPath, v.name));
    }
    return filePaths;
};

/**
 * Reads the content of an INI-style configuration file and returns it as an object.
 * @param {string} filePath - The path of the file to read.
 * @returns {Object} - The parsed configuration content.
 */
const readConfigFile = (filePath) => {
    const content = fs.readFileSync(filePath, 'utf8');
    const config = {};
    const lines = content.split('\n');
    let currentSection = null;

    for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('[') && trimmedLine.endsWith(']')) {
            currentSection = trimmedLine.substring(1, trimmedLine.length - 1);
            config[currentSection] = {};
        } else if (currentSection && trimmedLine.includes('=')) {
            const [key, value] = trimmedLine.split('=').map(part => part.trim());
            config[currentSection][key] = value;
        }
    }

    return config;
};

/**
 * Writes the given configuration content to an INI-style file.
 * @param {string} filePath - The path of the file to write.
 * @param {Object} configContent - The configuration content to write.
 */
const writeConfigFile = (filePath, configContent) => {
    let content = '';
    for (const section in configContent) {
        content += `[${section}]\n`;
        for (const key in configContent[section]) {
            content += `${key} = ${configContent[section][key]}\n`;
        }
        content += '\n';
    }
    fs.writeFileSync(filePath, content.trim(), 'utf8');
};

module.exports = {
    listFilesInDirectory,
    readConfigFile,
    writeConfigFile
};
