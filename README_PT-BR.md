# bank_transaction_sim

Para o README em inglês, consulte [README](./README.md)

Este é um simulador de transações bancárias. Por ser apenas uma demonstração, ele não terá a estrutura correta que um software desse tipo deveria ter. Porém, considero necessário documentar como a estrutura correta deveria ser, conforme meu entendimento atual.

## Estrutura Correta

### Repositório

- **DEVERIA TER** sido dividido em issues/features, branches para cada uma delas e uma merge request validada e testada.
- **ESTÁ** seguindo os [commits convencionais](https://www.conventionalcommits.org/en/v1.0.0/).

### Estrutura do Projeto

- O banco de dados contendo as informações deveria estar em uma instância separada. Isso garante que, caso um dos sistemas falhe, o banco de dados continue funcionando.
- Preferencialmente em um container.

### Código

- **DEVERIA TER** uma estrutura melhor de logs. Exemplo: separar os dados em algo como um JSON com (função, account_id, mensagem). Assim, poderíamos usar algo como JSONata para filtrar os valores.
- **NÃO DEVERIA** fazer tentativas de repetição em falhas comuns como "Conta não encontrada". Deveria lançar a exceção imediatamente. Contudo, está sendo usado para simular esse tipo de falha.

## Uso

### Iniciar o Servidor

Para iniciar o servidor, execute o seguinte comando:

```sh
npx ts-node src/server.ts
```

### Criar uma Conta

**Endpoint:** POST /accounts
**Descrição:** Cria uma nova conta com um saldo inicial.
**Corpo da Requisição:**
```json
{
    "balance": 100
}
```
**Exemplo de comando cURL:**
```bash
curl -X POST http://localhost:3000/accounts -H "Content-Type: application/json" -d "{\"balance\": 100}"
```

### Obter Detalhes da Conta

**Endpoint:** GET /accounts/:id
**Descrição:** Retorna os detalhes de uma conta pelo seu ID.
**Exemplo de comando cURL:**
```bash
curl http://localhost:3000/accounts/1
```

### Depositar Dinheiro

**Endpoint:** POST /accounts/:id/deposit
**Descrição:** Deposita dinheiro em uma conta.
**Corpo da Requisição:**
```json
{
    "amount": 50
}
```

### Sacar Dinheiro

**Endpoint:** POST /accounts/:id/withdraw
**Descrição:** Realiza um saque em uma conta.
**Corpo da Requisição:**
```json
{
    "amount": 30
}
```
**Exemplo de comando cURL:**
```bash
curl -X POST http://localhost:3000/accounts/1/withdraw -H "Content-Type: application/json" -d "{\"amount\": 30}"
```

### Transferir Dinheiro

**Endpoint:** POST /accounts/transfer
**Descrição:** Transfere dinheiro de uma conta para outra.
**Corpo da Requisição:**
```json
{
    "fromId": 1,
    "toId": 2,
    "amount": 20
}
```
**Exemplo de comando cURL:**
```bash
curl -X POST http://localhost:3000/accounts/transfer -H "Content-Type: application/json" -d "{\"fromId\": 1, \"toId\": 2, \"amount\": 20}"
```

## Testes

Os testes devem demonstrar os "casos de uso" solicitados. Todos eles são autoexplicativos.

## Observações sobre o Desenvolvimento

- Primeiramente, sim, usei IA para entender pequenos detalhes sobre como eu poderia fazer isso. Tenho conhecimento prévio sobre APIs. Usar IA não deveria ser um problema se a utilizarmos como uma ferramenta para ajudar a entender como tudo funciona. Contudo, ainda estou fazendo algumas coisas aqui pela primeira vez.

- Não usei IA em tudo.

- Eu usei IA pra traduzir de Inglês para Português xD