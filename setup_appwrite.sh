#!/bin/zsh
ENDPOINT="https://sfo.cloud.appwrite.io/v1"
PROJECT_ID="69ea82ad0000d66347d5"
API_KEY="standard_c8ea335f78c1c8da655d3e475dede89d7b8e55a2e58a264eb654720de837f230e081462e8fefd99cc8ea3baf2fe99270bd626a83bcfa577a8361a3df43f95a290ef593543fddf0638034997f742f88b02da03659ff20d96334746290a506b94dd7887d2d0d580119f8789acef8161ccc2b2cb342573940c9a9be012623bb341b"
DB_ID="main"

function api() {
    curl -s -X POST "$ENDPOINT/$1"         -H "Content-Type: application/json"         -H "X-Appwrite-Project: $PROJECT_ID"         -H "X-Appwrite-Key: $API_KEY"         -d "$2"
}

echo "Configurando con el endpoint regional SFO..."

# 2. Players
echo "Creando colección 'players'..."
api "databases/$DB_ID/collections" "{\"collectionId\":\"players\", \"name\":\"Players\", \"permissions\":[\"read(\\"any\\")\", \"create(\\"users\\")\", \"update(\\"users\\")\"]}"
sleep 1
api "databases/$DB_ID/collections/players/attributes/string" "{\"key\":\"userId\", \"size\":255, \"required\":true}"
api "databases/$DB_ID/collections/players/attributes/string" "{\"key\":\"nickname\", \"size\":50, \"required\":true}"
api "databases/$DB_ID/collections/players/attributes/string" "{\"key\":\"grade\", \"size\":20, \"required\":false}"
api "databases/$DB_ID/collections/players/attributes/integer" "{\"key\":\"coins\", \"min\":0, \"default\":0, \"required\":false}"
api "databases/$DB_ID/collections/players/attributes/integer" "{\"key\":\"wins\", \"min\":0, \"default\":0, \"required\":false}"

# 3. Matches
echo "Creando colección 'matches'..."
api "databases/$DB_ID/collections" "{\"collectionId\":\"matches\", \"name\":\"Matches\", \"permissions\":[\"read(\\"any\\")\", \"create(\\"users\\")\", \"update(\\"users\\")\"]}"
sleep 1
api "databases/$DB_ID/collections/matches/attributes/string" "{\"key\":\"roomCode\", \"size\":10, \"required\":true}"
api "databases/$DB_ID/collections/matches/attributes/string" "{\"key\":\"status\", \"size\":20, \"required\":true}"
api "databases/$DB_ID/collections/matches/attributes/string" "{\"key\":\"player1_id\", \"size\":255, \"required\":true}"
api "databases/$DB_ID/collections/matches/attributes/string" "{\"key\":\"player2_id\", \"size\":255, \"required\":false}"
api "databases/$DB_ID/collections/matches/attributes/string" "{\"key\":\"equation\", \"size\":2000, \"required\":true}"
api "databases/$DB_ID/collections/matches/attributes/string" "{\"key\":\"winner_id\", \"size\":255, \"required\":false}"
api "databases/$DB_ID/collections/matches/attributes/string" "{\"key\":\"winner_name\", \"size\":50, \"required\":false}"
api "databases/$DB_ID/collections/matches/attributes/float" "{\"key\":\"time\", \"required\":false}"

# 4. Answers
echo "Creando colección 'answers'..."
api "databases/$DB_ID/collections" "{\"collectionId\":\"answers\", \"name\":\"Answers\", \"permissions\":[\"read(\\"any\\")\", \"create(\\"users\\")\"]}"
sleep 1
api "databases/$DB_ID/collections/answers/attributes/string" "{\"key\":\"matchId\", \"size\":255, \"required\":true}"
api "databases/$DB_ID/collections/answers/attributes/boolean" "{\"key\":\"isCorrect\", \"required\":true}"
api "databases/$DB_ID/collections/answers/attributes/float" "{\"key\":\"time\", \"required\":true}"

echo "\n✅ Proceso completado con éxito."
