# bank_transaction_sim

For the README in portuguese refer to [README_PT-BR](./README_PT-BR.md)

This is a simulator of bank transactions. Due to it being a just a Demo, it won't have the correct structure that a software like this should have. But I feel necessary to document how the correct structure should look like as far as I know.

## Correct Structure

### Repository

- SHOULD HAVE been divided in issues/feats, branches for each and a validated and tested merge request.
- IS following the [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/)

### Project Structure

- DataBase Containing the data should be in a different instance. Since if one of the system fails the DB should always be running.

- Preferably in a container.

### Code

- SHOULD HAVE a better structure of logging. i.e.: Separate the data in something like a JSON with (Function, account_id, message). So we could use something like JSONata to filter the values.

- SHOULDN'T retry on common failures like "Account not found" but throw right away, however it is being used to simulate these type of failures.

## Usage

### Start the Server

To start the server, run the following command:

```sh
npx ts-node src/server.ts
```

### Create an Account

**Endpoint**: POST /accounts
**Description**: Creates a new account with an initial balance.
**Request Body:**
```json
{
    "balance": 100
}
```
**Example cURL Command:**

```bash
curl -X POST http://localhost:3000/accounts -H "Content-Type: application/json" -d "{\"balance\": 100}"
```

### Get Account Details

**Endpoint**: GET /accounts/:id
**Description**: Retrieves the details of an account by its ID.
**Example cURL Command:**

```bash
curl http://localhost:3000/accounts/1
```

### Deposit Money

**Endpoint:** POST /accounts/:id/deposit
**Description:** Deposits money into an account.
**Request Body:**
```json
{
    "amount": 50
}
```
**Example cURL Command:**
```bash
curl -X POST http://localhost:3000/accounts/1/deposit -H "Content-Type: application/json" -d "{\"amount\": 50}"
```

### Withdraw Money

**Endpoint:** POST /accounts/:id/withdraw
**Description:** Withdraws money from an account.
**Request Body:**
```json
{
    "amount": 30
}
```
**Example cURL Command:**
```bash
curl -X POST http://localhost:3000/accounts/1/withdraw -H "Content-Type: application/json" -d "{\"amount\": 30}"
```

### Transfer Money
**Endpoint:** POST /accounts/transfer
**Description:** Transfers money from one account to another.
**Request Body:**
```json
{
    "fromId": 1,
    "toId": 2,
    "amount": 20
}
```

Example cURL Command:
```bash
curl -X POST http://localhost:3000/accounts/transfer -H "Content-Type: application/json" -d "{\"fromId\": 1, \"toId\": 2, \"amount\": 20}"
```

## Testing

The tests should show the "use cases" requested. They are all self explanatory.

## Disclaimer about the development

- First of all, yes, I've used AI to help understand small details on how could I make this. I have previous knowledge with API's. AI's shouldn't be a problem if we use it as a tool to help us understand how everything works. But I'm still doing some things here for the first time.

- I haven't used AI on everything.

