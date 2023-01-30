# Sistema de loja

https://api-loja.onrender.com

### Sistema criado com o intuito de simular um ambiente de loja.

## Métodos - Admin
Requisições para a API devem seguir os padrões:
| Método | Descrição |
|---|---|
| `GET` - [Endereço da API](https://api-loja.onrender.com) | Verifica se a API está de pé. |
| `GET` - [Endereço da API](https://api-loja.onrender.com)/admin/:id-usuario/resumo/mes/ano | Admin utiliza para gerar um relatório sobre o sistema filtrado por mês e ano. |
| `POST` - [Endereço da API](https://api-loja.onrender.com)/admin/login| Admin utiliza para se logar na aplicação. |
|`POST` - [Endereço da API](https://api-loja.onrender.com)/admin/:id-usuario/cadastro| Admin utiliza para cadastrar um admin na aplicação. |

## Corpo das requisiões
### `POST` - [Endereço da API](https://api-loja.onrender.com)/admin/login

+ Request (application/json)

    + Body

            {
	            "emai": "emailadmin@email.com",
	            "senha": "senhaadmin",	            
            }
            
### `POST` - [Endereço da API](https://api-loja.onrender.com)/admin/id-usuario/cadastro - Necessita autenticação JWT.

+ Request (application/json)

    + Body
    
            {
	            "nome": "Nome",
	            "email": "emailadmin@email.com",
                "senha": "senhaadmin"
            }
            
            
 ## Métodos - Vendedores
Requisições para a API devem seguir os padrões:
| Método | Descrição |
|---|---|
| `GET` - [Endereço da API](https://api-loja.onrender.com)/vendedores/status | Lista o nome dos vendedores, e se está trabalhando ou não |
| `GET` - [Endereço da API](https://api-loja.onrender.com)/vendedores/:id-vendedor | Lista os dados do vendedor e um resumo sobre suas vendas |
| `POST` - [Endereço da API](https://api-loja.onrender.com)/vendedores/:id-usuario/cadastrar| Admin utiliza para cadastrar um vendedor. |
|`PATCH` - [Endereço da API](https://api-loja.onrender.com)/vendedores/editar/:id-vendedor/:id-usuario| Admin utiliza para editar um admin na aplicação. |

## Corpo das requisiões
### `POST` - [Endereço da API](https://api-loja.onrender.com)/vendedores/:id-usuario/cadastrar - Necessita autenticação JWT.

+ Request (application/json)

    + Body

           {
	            "nome": "Jorge",
	            "idade": 27,
	            "cidade": "Curitiba",
	            "email": "jorge@vendedor.com",
	            "senha": "jorge123",
	            "porcentagemComissao": 0.2
           }
            
### `PATCH` - [Endereço da API](https://api-loja.onrender.com)/vendedores/editar/:id-vendedor/:id-usuario - Necessita autenticação JWT.

+ Request (application/json)

    + Body
    
            {
	            "campoASerAlterado": "novoValor"         
	            
            }
            
  ## Métodos - Clientes
Requisições para a API devem seguir os padrões:
| Método | Descrição |
|---|---|
| `GET` - [Endereço da API](https://api-loja.onrender.com)/clientes/listar | Lista o nome dos clientes, dos vendedores, e a sua última compra. |
| `GET` - [Endereço da API](https://api-loja.onrender.com)/clientes/:id-cliente | Lista os dados do cliente, do seu vendedor, e todas as suas compras. |
| `POST` - [Endereço da API](https://api-loja.onrender.com)/clientes/cadastrar| Utiliza para cadastrar um cliente. |
|`PATCH` - [Endereço da API](https://api-loja.onrender.com)/clientes/editar/:id-cliente/:id-usuario| Admin utiliza para editar um cliente na aplicação. |

## Corpo das requisiões
### `POST` - [Endereço da API](https://api-loja.onrender.com)/clientes/cadastrar

+ Request (application/json)

    + Body

           {
	            "nome": "Nome sobrenome",
	            "idade": 41,
	            "email": "cliente@teste.com",
                "telefone": "41999999999",
                "cpf": "11111111111",
                "cep": "88888888",
                "vendedorId": "63ed3f4d3f626ce18b68cd7d"
           }
            
### `PATCH` - [Endereço da API](https://api-loja.onrender.com)/clientes/editar/:id-cliente/:id-usuario - Necessita autenticação JWT.

+ Request (application/json)

    + Body
    
            {
	            "campoASerAlterado": "novoValor"  
            }
            
## Métodos - Vendas
Requisições para a API devem seguir os padrões:
| Método | Descrição |
|---|---|
| `GET` - [Endereço da API](https://api-loja.onrender.com)/vendas/listatodos | Lista todas as vendas, nome do cliente, valor da venda e data. |
| `GET` - [Endereço da API](https://api-loja.onrender.com)/vendas/:id | Lista os dados da venda, dados do cliente e o nome do vendedor. |
| `POST` - [Endereço da API](https://api-loja.onrender.com)/vendas/cadastrar| Utiliza para cadastrar uma venda. |
|`PATCH` - [Endereço da API](https://api-loja.onrender.com)/vendas/editar/:id-venda/:id-usuario| Admin utiliza para editar uma venda na aplicação. |

## Corpo das requisiões
### `POST` - [Endereço da API](https://api-loja.onrender.com)/vendas/cadastrar

+ Request (application/json)

    + Body

           {
	            "clienteId": "63d67d5b536d1032779abfdc",
                "vendedorId": "63d18dc485b96060512117e9",
                "valorCompra": 10,
                "formaPagamento": "dinheiro"
           }
            
### `PATCH` - [Endereço da API](https://api-loja.onrender.com)/vendas/editar/:id-venda/:id-usuario - Necessita autenticação JWT.

+ Request (application/json)

    + Body
    
            {
	            "campoASerAlterado": "novoValor"  
            }
            


Tecnologias usadas:

* **Node.js**
* **npm/yarn**
* **Javascript**
* **Express.js**
* **MongoDB**
* **Mongoose**
* **Axios**
* **Celebrate**
* **Bcrypt**
* **Dotenv**
* **Moment**
* **Nodemon**
* **Json Web Token (JWT)**
