# Claude Stats

Get heatmaps and statistics of your claude conversations

## Setup

### Export data
Follow these instructions to export your conversation data from claude:

1. Go to [https://claude.ai/settings/account](https://claude.ai/settings/account)
2. Select "Export Data"
3. Wait for the email with your data export
4. Download and extract the ZIP file
5. Place the `conversations.json` file in the `data/` [directory](/data)

### Get Heatmaps
Follow these instructions to get heatmaps and other stats:

1. Clone the repository
	```
	git clone git@github.com:puravparab/claude-stats.git
	```

2. Change directory
	```
	cd claude-stats
	```
3. Install packages
	```
	npm install --legacy-peer-deps
	```

4. Run project
	```
	npm run dev
	```

5. Go to the [website](http://localhost:3000/)