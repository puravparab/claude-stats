import { join } from 'path';
import { readFileSync, existsSync } from 'fs';
import type { Conversation } from './types';

interface ProcessedJSON {
  data?: Conversation[];
  error?: string;
	status: number;
}

const validateJson = (data: unknown): data is Conversation[] => {
	if (!Array.isArray(data)) return false;
  
  return data.every(item => 
    typeof item === 'object' &&
    item !== null &&
    'uuid' in item &&
    'chat_messages' in item
  );
}

const processJson = (): ProcessedJSON=> {
	try {
		// conversations.json should be in root/data/
		const currentDir = process.cwd();
		const filePath = join(currentDir, '../data/conversations.json');

		// Check if file exists
    if (!existsSync(filePath)) {
      return { 
        error: 'conversation.json file not found. Please ensure conversations.json exists in the data directory.',
				status: 404
      };
    }

		// Read conversations.json file
		const fileContent = readFileSync(filePath, 'utf-8');

		// Parse JSON
		try {
			const parsedContent = JSON.parse(fileContent);
			// Validate data structure
			if (!validateJson(parsedContent)) {
				return { 
					error: 'Invalid data structure in conversations.json', 
					status: 422 
				};
			}
			return { 
        data: parsedContent,
        status: 200
      };
		} catch (parseError) {
      return { 
        error: 'Invalid JSON format in conversations.json',
        status: 400
      };
    }
		
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Unknown error';
		return {
			error: `Failed to process conversations data: ${errorMessage}`,
			status: 500
		};
	}
}

export default processJson;