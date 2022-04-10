# messenger-api

| API endpoint                                                   | description                            | sample data               |
| -------------------------------------------------------------- | -------------------------------------- | ------------------------- |
| `GET /api/:account_id/conversations`                           | get a list of conversations            | `Paginated<Conversation>` |
| `GET /api/:account_id/conversation/:conversation_id`           | information of a specific conversation | `Conversation`            |
| `GET /api/:account_id/conversation/:conversation_id/messages`  | list of messages                       | `Paginated<Message>`      |
| `POST /api/:account_id/conversation/:conversation_id/messages` | create a new messages                  | `Message`                 |

## `GET /api/:account_id/conversations`

### Get first page:

`GET /api/1/conversation?pageSize=2`

#### Response

```json
{
  "rows": [
    {
      "id": "1",
      "participants": [
        { "id": "1", "name": "Will Smith" },
        { "id": "2", "name": "Jada" }
      ],
      "last_message": {
        "id": "1000",
        "sent_by": { "id": "1", "name": "Will Smith" },
        "text": "I love you",
        "ts": 1612312312312
      }
    },
    {
      "id": "2",
      "participants": [
        { "id": "1", "name": "Will Smith" },
        { "id": "3", "name": "Chris Rock" }
      ],
      "last_message": {
        "id": "1001",
        "sent_by": { "id": "1", "name": "Will Smith" },
        "text": "Don't do that again",
        "ts": 1612312312312
      }
    }
  ],
  "sort": "NEWEST_FIRST",
  "cursor": "eyJzb3J0IjoiTkVXRVNUX0ZJUlNUIiwibGFzdFNlZW4iOiIyIn0="
}
```

### Get next page

`GET /api/1/conversation?pageSize=2&cursor=eyJzb3J0IjoiTkVXRVNUX0ZJUlNUIiwibGFzdFNlZW4iOiIyIn0=`

#### Response

```json
{
  "rows": [
    {
      "id": "5",
      "participants": [
        { "id": "1", "name": "Will Smith" },
        { "id": "3", "name": "Jaden" }
      ],
      "last_message": {
        "id": "1240",
        "sent_by": { "id": "3", "name": "Jaden" },
        "text": "You \"rock\"!!!",
        "ts": 1612312332312
      }
    }
  ],
  "sort": "NEWEST_FIRST",
  "cursor": "eyJzb3J0IjoiTkVXRVNUX0ZJUlNUIiwibGFzdFNlZW4iOiI1In0="
}
```

## `GET /api/:account_id/conversation/:conversation_id`

`GET /api/1/conversation/5`

#### Response

```json
{
  "id": "5",
  "participants": [
    { "id": "1", "name": "Will Smith" },
    { "id": "3", "name": "Jaden" }
  ],
  "last_message": {
    "id": "1240",
    "sent_by": { "id": "3", "name": "Jaden" },
    "text": "You \"rock\"!!!",
    "ts": 1612312332312
  }
}
```
