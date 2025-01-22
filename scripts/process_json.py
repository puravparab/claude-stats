import sys
import ijson
from typing import Iterator, Dict, Any

def parse_conversations(file_path: str) -> Iterator[Dict[str, Any]]:
	with open(file_path, 'rb') as file:
		parser = ijson.items(file, 'item')
		for conversation in parser:
			yield {
				'conversation_id': conversation.get('uuid'),
				'name': conversation.get('name'),
				'created_at': conversation.get('created_at'),
				'account_id': conversation.get('account', {}).get('uuid'),
				'messages': [{
					'uuid': msg.get('uuid'),
					'sender': msg.get('sender'),
					'text': msg.get('text'),
					'created_at': msg.get('created_at')
				} for msg in conversation.get('chat_messages', [])]
			}

def analyze_conversations(file_path):
	conversation_count = 0
	total_messages = 0
	human_messages = 0
	assistant_messages = 0
	
	for conversation in parse_conversations(file_path):
		conversation_count += 1
		
		for message in conversation['messages']:
			total_messages += 1
			if message['sender'] == 'human':
				human_messages += 1
			elif message['sender'] == 'assistant':
				assistant_messages += 1
			
		# Print progress every 100 conversations
		if conversation_count % 100 == 0:
			print(f"Processed {conversation_count} conversations...")

	print("\nAnalysis Results:")
	print(f"Total conversations: {conversation_count}")
	print(f"Total messages: {total_messages}")
	print(f"Human messages: {human_messages}")
	print(f"Assistant messages: {assistant_messages}")
	print(f"Average messages per conversation: {total_messages/conversation_count:.1f}")

if __name__ == "__main__":
	if len(sys.argv) != 2:
		print("Usage: python script.py <json_file>")
		sys.exit(1)
		
	analyze_conversations(sys.argv[1])