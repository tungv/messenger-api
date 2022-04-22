# messenger-api

## Getting started

```
npm i
```

```
## Run as production server
npm run build
npm start
```

It will start an HTTP server on port 3000.
You need to proxy your requests to the server if you use a separate domain.

# API documentation

| API prevpoint                                                          | description                            | sample data                 |
| ---------------------------------------------------------------------- | -------------------------------------- | --------------------------- |
| `GET /api/accounts`                                                    | Get list of accounts                   | `{ "accounts": Account[] }` |
| `GET /api/account/:account_id`                                         | Get current account                    | `Account`                   |
| `GET /api/account/:account_id/conversations`                           | get a list of conversations            | `Paginated<Conversation>`   |
| `POST /api/account/:account_id/conversations`                          | create a new conversation              | `Conversation`              |
| `GET /api/account/:account_id/conversation/:conversation_id`           | information of a specific conversation | `Conversation`              |
| `GET /api/account/:account_id/conversation/:conversation_id/messages`  | list of messages                       | `Paginated<Message>`        |
| `POST /api/account/:account_id/conversation/:conversation_id/messages` | create a new messages                  | `Message`                   |

## `GET /api/account/:account_id/conversations`

### Get first page

`GET /api/1/conversation?pageSize=2`

#### Response Get first page

```json
{
  "rows": [
    {
      "id": "1",
      "participants": [
        { "id": "1", "name": "Will Smith" },
        { "id": "2", "name": "Jada" }
      ],
      "lastMessage": {
        "id": "1000",
        "sender": { "id": "1", "name": "Will Smith" },
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
      "lastMessage": {
        "id": "1001",
        "sender": { "id": "1", "name": "Will Smith" },
        "text": "Don't do that again",
        "ts": 1612312312312
      }
    }
  ],
  "sort": "NEWEST_FIRST",
  "cursor_next": "eyJzb3J0IjoiT0xERVNUX0ZJUlNUIiwibGFzdFNlZW4iOiIxIn0=",
  "cursor_prev": "eyJzb3J0IjoiTkVXRVNUX0ZJUlNUIiwibGFzdFNlZW4iOiIyIn0="
}
```

### Get next page

`GET /api/1/conversation?pageSize=2&cursor=eyJzb3J0IjoiTkVXRVNUX0ZJUlNUIiwibGFzdFNlZW4iOiIyIn0=`

#### Response Get next page

```json
{
  "rows": [
    {
      "id": "5",
      "participants": [
        { "id": "1", "name": "Will Smith" },
        { "id": "3", "name": "Jaden" }
      ],
      "lastMessage": {
        "id": "1240",
        "sender": { "id": "3", "name": "Jaden" },
        "text": "You \"rock\"!!!",
        "ts": 1612312332312
      }
    }
  ],
  "sort": "NEWEST_FIRST",
  "cursor_next": "eyJzb3J0IjoiT0xERVNUX0ZJUlNUIiwibGFzdFNlZW4iOiI1In0=",
  "cursor_prev": "eyJzb3J0IjoiTkVXRVNUX0ZJUlNUIiwibGFzdFNlZW4iOiI1In0="
}
```

### `GET /api/account/:account_id/conversation/:conversation_id`

`GET /api/1/conversation/5`

#### Response Get conversation by id

```json
{
  "id": "5",
  "participants": [
    { "id": "1", "name": "Will Smith" },
    { "id": "3", "name": "Jaden" }
  ],
  "lastMessage": {
    "id": "1240",
    "sender": { "id": "3", "name": "Jaden" },
    "text": "You \"rock\"!!!",
    "ts": 1612312332312
  }
}
```

## `POST /api/account/:account_id/conversations`

`POST /api/account/1/conversations?with=2`

#### Response Get conversation by id

```json
{
  "id": "5",
  "participants": [
    { "id": "1", "name": "Will Smith" },
    { "id": "2", "name": "Jada" }
  ]
}
```

## `GET /api/account/:account_id/conversation/:conversation_id/messages`

### Get initial page

`GET /api/1/conversation/5/messages?pageSize=10`

#### Response

```json
{
  "rows": [
    {
      "id": "1241",
      "sender": { "id": "3", "name": "Jaden" },
      "text": "You \"rock\"!!!",
      "ts": 1612312332312
    },
    {
      "id": "1240",
      "sender": { "id": "3", "name": "Jaden" },
      "text": "You \"rock\"!!!",
      "ts": 1612312332312
    }
  ],
  "sort": "NEWEST_FIRST",
  "cursor_next": "eyJzb3J0IjoiT0xERVNUX0ZJUlNUIiwibGFzdFNlZW4iOiIxMjQwIn0=",
  "cursor_prev": "eyJzb3J0IjoiTkVXRVNUX0ZJUlNUIiwibGFzdFNlZW4iOiIxMjQxIn0="
}
```

```ts
const { data, mutate } = useSWR(`/api/1/conversation/5/messages?pageSize=10`, fetcher);

// later, when optimistic update
// received newer messages
mutate({
  rows: [...newData.rows, ...data.rows],
  sort: "NEWEST_FIRST",
  cursor_next: newData.cursor_next,
  cursor_prev: data.cursor_prev,
});

// received older messages
mutate({
  rows: [...data.rows, [...newData.rows].reverse()],
  sort: "NEWEST_FIRST",
  cursor_next: data.cursor_next,
  cursor_prev: newData.cursor_next,
});
```

```json
// initial
[6, 5, 4]
next = NEWEST from 6
prev = OLDEST from 4

// newer
[8, 7]
next = NEWEST from 8
prev = OLDEST from 7

// older
[1, 2, 3]
next = OLDEST from 1
prev = NEWEST from 3
```

### Looking for newer messages

Add `cursor={cursor_prev}` from the last response

`GET /api/1/conversation/5/messages?pageSize=2&cursor=eyJzb3J0IjoiTkVXRVNUX0ZJUlNUIiwibGFzdFNlZW4iOiIxMjQxIn0=`

#### Response Looking for newer messages

```json
{
  "rows": [
    {
      "id": "1243",
      "sender": { "id": "3", "name": "Jaden" },
      "text": "You \"rock\"!!!",
      "ts": 1612312332312
    },
    {
      "id": "1242",
      "sender": { "id": "3", "name": "Jaden" },
      "text": "You \"rock\"!!!",
      "ts": 1612312332312
    }
  ],
  "sort": "NEWEST_FIRST",
  "cursor_next": "eyJzb3J0IjoiT0xERVNUX0ZJUlNUIiwibGFzdFNlZW4iOiIxMjQyIn0=",
  "cursor_prev": "eyJzb3J0IjoiTkVXRVNUX0ZJUlNUIiwibGFzdFNlZW4iOiIxMjQzIn0="
}
```

### Looking for older messages

Add `cursor={cursor_next}` from the last response

`GET /api/1/conversation/5/messages?pageSize=2&cursor=eyJzb3J0IjoiTkVXRVNUX0ZJUlNUIiwibGFzdFNlZW4iOiIxMjQzIn0=`

#### Response Looking for older messages

```json
{
  "rows": [
    {
      "id": "1238",
      "sender": { "id": "3", "name": "Jaden" },
      "text": "You \"rock\"!!!",
      "ts": 1612312332312
    },
    {
      "id": "1239",
      "sender": { "id": "3", "name": "Jaden" },
      "text": "You \"rock\"!!!",
      "ts": 1612312332312
    }
  ],
  "sort": "OLDEST_FIRST",
  "cursor_next": "eyJzb3J0IjoiT0xERVNUX0ZJUlNUIiwibGFzdFNlZW4iOiIxMjQyIn0=",
  "cursor_prev": "eyJzb3J0IjoiTkVXRVNUX0ZJUlNUIiwibGFzdFNlZW4iOiIxMjQzIn0="
}
```

## `POST /api/account/:account_id/conversation/:conversation_id/messages`

`POST /api/account/3/conversation/5/messages`

Body: `{ "text": "hi there" }`

#### Response

```json
{
  "id": "1245",
  "sender": { "id": "3", "name": "Jaden" },
  "text": "hi there",
  "ts": 1612312332312
}
```
