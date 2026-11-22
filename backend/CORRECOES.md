# Correções para o backend subir (sobre o commit 7fee1f3 da develop)

Sem as três primeiras, a aplicação não inicia.

1. **`mapper/AnimalMapper.java`: faltava `@Component`.** O `AtendimentoMapper` (que é `@Component`)
   e os services dependem dele. Sem a anotação, o Spring não cria o bean e a inicialização falha
   ("required a bean of type AnimalMapper that could not be found").

2. **`application.yaml`: o segredo do JWT estava dentro de `spring:`.** Com a indentação antiga, a
   chave virava `spring.api.security.token.secret`, e o `@Value("${api.security.token.secret}")` do
   `TokenService` não encontrava o valor. O bloco `api:` foi movido para a raiz do arquivo.

3. **`config/DataInitializer.java`: não existia, embora o README fale dele.** Como as senhas usam
   BCrypt, um `INSERT` com a senha em texto não permite login. A classe cria
   `admin@maosepatas.com.br` / `admin123` (com `passwordEncoder.encode`) quando a tabela de
   administradores está vazia.

4. **`entity/Endereco.java`: adicionado `@Embeddable`**, porque a classe é usada com `@Embedded` em `Tutor`.

## README desatualizado

Alguns pontos do README não batem com o código:

| README | Código |
| --- | --- |
| Banco `maosepatas_db`, usuário e senha `root` / `root` (via `DB_USER` / `DB_PASSWORD`) | Banco `maosepatas`, senha `1234`, fixos no `application.yaml` |
| Stack "Spring Boot 3+" | Spring Boot 4.1.2 |
| `AnimalLoteRequestDTO` com "`tutorId` + lista de animais" | O DTO só tem a lista `animais`; cada item leva o seu `tutorId` |

## Banco já existente com administrador antigo

Se a tabela `tb_administrador` já tiver um administrador com a senha em texto puro, o
`DataInitializer` não roda (a tabela não está vazia) e o login falha. Para corrigir, troque a senha
pelo hash BCrypt de `admin123`:

```sql
UPDATE maosepatas.tb_administrador
SET email = 'admin@maosepatas.com.br',
    senha = '$2a$10$Z7NrwL2FgXwVxW0uaDhQgO83UujnI0OG5wodcKw.ZRK0DzRfQ.Jc6';
```
