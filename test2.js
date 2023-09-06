const fs = require('fs');

exports.handler = async (event, context) => {
    try {
        // Read a file using fs
        const data = fs.readFileSync('/path/to/your/file.txt', 'utf8');
        console.log('File content:', data);

        // You can perform other file operations as needed

        return {
            statusCode: 200,
            body: 'File content: ' + data,
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: 'Error: ' + error.message,
        };
    }
};
