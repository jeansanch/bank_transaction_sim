# bank_transaction_sim

This is a simulator of bank transactions. Due to it being a just a Demo, it won't have the correct structure that a software like this should have. But I feel necessary to document how the correct structure should look like as far as I know.

## Correct Structure

### Repository

- SHOULD HAVE been divided in issues/feats, branches for each and a validated and tested merge request.
- IS following the [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/)

### Project Structure

- DataBase Containing the data should be in a different instance. Since if one of the system fails the DB should always be running.

- Preferably in a container.



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