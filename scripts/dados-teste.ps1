# Cria dados de teste (clientes, animais e atendimentos) no backend Mãos e Patas.
# Usa as próprias rotas da API, então os dados passam pelas mesmas validações das telas.
#
# Uso:  criar-dados-teste.cmd              (o backend precisa estar rodando)
#       dados-teste.ps1 -Aguardar          (espera o backend subir; usado pelo iniciar-backend.cmd)

param(
    [string]$Api = "http://localhost:8080",
    [switch]$Aguardar
)

$ErrorActionPreference = "Stop"
try { [Console]::OutputEncoding = [Text.Encoding]::UTF8 } catch { }

function Write-Titulo($texto) { Write-Host ""; Write-Host $texto -ForegroundColor Cyan }
function Write-Ok($texto) { Write-Host "  [ok] $texto" -ForegroundColor Green }
function Write-Pulo($texto) { Write-Host "  [--] $texto" -ForegroundColor DarkGray }
function Write-Erro($texto) { Write-Host "  [erro] $texto" -ForegroundColor Red }

function Finalizar($codigo) {
    Write-Host ""
    Read-Host "Pressione Enter para fechar" | Out-Null
    exit $codigo
}

# Backend respondendo? (qualquer resposta HTTP, mesmo 401, conta)
function Test-Backend {
    try {
        Invoke-WebRequest -Uri "$Api/api/dashboard" -UseBasicParsing -TimeoutSec 3 | Out-Null
        return $true
    } catch {
        if ($_.Exception.Response) { return $true }
        return $false
    }
}

# Chamada à API com corpo JSON em UTF-8 (necessário no PowerShell 5.1 por causa dos acentos)
function Invoke-Api([string]$Metodo, [string]$Caminho, $Corpo, [string]$Token) {
    $headers = @{}
    if ($Token) { $headers["Authorization"] = "Bearer $Token" }
    $parametros = @{ Uri = "$Api$Caminho"; Method = $Metodo; Headers = $headers; TimeoutSec = 30 }
    if ($null -ne $Corpo) {
        $json = ConvertTo-Json -InputObject $Corpo -Depth 10
        $parametros["Body"] = [Text.Encoding]::UTF8.GetBytes($json)
        $parametros["ContentType"] = "application/json; charset=utf-8"
    }
    try {
        # atribuir antes de devolver faz listas sairem item a item no PowerShell 5.1 e no 7
        $resultado = Invoke-RestMethod @parametros
        return $resultado
    } catch {
        $mensagem = $_.Exception.Message
        if ($_.ErrorDetails -and $_.ErrorDetails.Message) {
            try {
                $erro = $_.ErrorDetails.Message | ConvertFrom-Json
                if ($erro.fieldErrors) {
                    $mensagem = ($erro.fieldErrors.PSObject.Properties | ForEach-Object { $_.Value }) -join " "
                } elseif ($erro.message) {
                    $mensagem = $erro.message
                }
            } catch { $mensagem = $_.ErrorDetails.Message }
        }
        throw $mensagem
    }
}

# Data relativa a hoje, no formato LocalDateTime do Java
function Data-Atendimento([int]$dias, [int]$hora) {
    return (Get-Date).Date.AddDays($dias).AddHours($hora).ToString("yyyy-MM-dd'T'HH:mm:ss")
}

Write-Host "=== Mãos e Patas - dados de teste ===" -ForegroundColor Cyan

# 1. Backend no ar
if (-not (Test-Backend)) {
    if ($Aguardar) {
        Write-Host "Aguardando o backend subir em $Api (pode levar alguns minutos na primeira vez)..."
        $limite = (Get-Date).AddMinutes(10)
        while (-not (Test-Backend)) {
            if ((Get-Date) -gt $limite) {
                Write-Erro "O backend não respondeu em 10 minutos. Confira a janela do backend."
                Finalizar 1
            }
            Start-Sleep -Seconds 3
        }
        # dá tempo de o DataInitializer criar o administrador
        Start-Sleep -Seconds 3
    } else {
        Write-Erro "O backend não está respondendo em $Api."
        Write-Host "  Rode o iniciar-backend.cmd, espere aparecer 'Started MaosepatasApplication' e tente de novo."
        Finalizar 1
    }
}

# 2. Login
Write-Titulo "Login"
$token = $null
$credenciais = @(@{ email = "admin@maosepatas.com.br"; senha = "admin123" })
foreach ($c in $credenciais) {
    try {
        $resposta = Invoke-Api "POST" "/api/auth/login" @{ email = $c.email; senha = $c.senha; lembrarDeMim = $false }
        $token = $resposta.token
        Write-Ok "Entrou como $($c.email)"
    } catch { }
}
while (-not $token) {
    Write-Host "  O administrador padrão (admin@maosepatas.com.br / admin123) não funcionou."
    $email = Read-Host "  E-mail do administrador (Enter para cancelar)"
    if (-not $email) { Finalizar 1 }
    $senha = Read-Host "  Senha"
    try {
        $resposta = Invoke-Api "POST" "/api/auth/login" @{ email = $email; senha = $senha; lembrarDeMim = $false }
        $token = $resposta.token
        Write-Ok "Entrou como $email"
    } catch { Write-Erro "$_" }
}

# 3. Dados (os mesmos do modo demonstração do frontend)
function Endereco($logradouro, $numero, $bairro, $complemento) {
    return @{ cep = "60000-000"; logradouro = $logradouro; numero = $numero; complemento = $complemento
              bairro = $bairro; cidade = "Fortaleza"; estado = "CE" }
}
function Contato($telefone, $whatsapp) { return @{ telefone = $telefone; whatsapp = $whatsapp } }
function Animal($nome, $sexo, $esterilizado, $especie, $raca, $pelagem, $nascimento) {
    return @{ nome = $nome; sexo = $sexo; esterilizado = $esterilizado; especie = $especie
              raca = $raca; pelagem = $pelagem; dataNascimento = $nascimento; microchip = $null; foto = $null }
}
function Atendimento($animal, $tipo, $dias, $descricao, $realizado) {
    return @{ animal = $animal; tipo = $tipo; dias = $dias; descricao = $descricao; realizado = $realizado }
}

$clientes = @(
    @{
        tutor = @{ nome = "Maria Oliveira"; cpf = "123.456.789-09"
                   endereco = (Endereco "Rua das Flores" "150" "Centro" "Apartamento 202")
                   contatos = @((Contato "(85) 99999-1234" $true), (Contato "(85) 3333-1234" $false)) }
        animais = @(
            (Animal "Mel" "FEMEA" $true "Cachorro" "Golden Retriever" "Dourada" "2022-06-15"),
            (Animal "Bidu" "MACHO" $false "Cachorro" $null $null $null)
        )
        atendimentos = @(
            (Atendimento "Mel" "CONSULTA" -3 "Avaliação de rotina" $true),
            (Atendimento "Bidu" "VACINA" -10 "Vacina V8" $true)
        )
    },
    @{
        tutor = @{ nome = "João Santos"; cpf = "529.982.247-25"
                   endereco = (Endereco "Av. Beira Mar" "1020" "Meireles" $null)
                   contatos = @((Contato "(85) 98888-4321" $true)) }
        animais = @((Animal "Luna" "FEMEA" $true "Gato" "Siamês" "Curta" "2023-02-10"))
        atendimentos = @((Atendimento "Luna" "VACINA" 2 "Vacina antirrábica" $false))
    },
    @{
        tutor = @{ nome = "Ana Costa"; cpf = "111.444.777-35"
                   endereco = (Endereco "Rua do Sol" "48" "Aldeota" $null)
                   contatos = @((Contato "(85) 99777-1111" $true)) }
        animais = @(
            (Animal "Thor" "MACHO" $false "Cachorro" "Labrador" "Preta" "2021-08-21"),
            (Animal "Nina" "FEMEA" $true "Gato" "SRD" "Rajada" "2024-03-05")
        )
        atendimentos = @(
            (Atendimento "Thor" "CONSULTA" 5 "Avaliação clínica" $false),
            (Atendimento "Nina" "VACINA" -1 "Vacina quádrupla felina" $true)
        )
    },
    @{
        # sem animais, para testar o filtro "Sem animais" e a exclusão de cliente
        tutor = @{ nome = "Carlos Almeida"; cpf = "390.533.447-05"
                   endereco = (Endereco "Rua das Acácias" "7" "Benfica" $null)
                   contatos = @((Contato "(85) 3222-9090" $false)) }
        animais = @()
        atendimentos = @()
    }
)

# 4. Cadastro
try {
    $existentes = @(Invoke-Api "GET" "/api/tutores" $null $token)
} catch {
    Write-Erro "Não foi possível listar os clientes: $_"
    Finalizar 1
}
$cpfsExistentes = @{}
foreach ($t in $existentes) { if ($t.cpf) { $cpfsExistentes[$t.cpf] = $true } }

$totais = @{ clientes = 0; animais = 0; atendimentos = 0 }
$falhas = 0

foreach ($c in $clientes) {
    $nome = $c.tutor.nome
    Write-Titulo $nome

    if ($cpfsExistentes.ContainsKey($c.tutor.cpf)) {
        Write-Pulo "Já cadastrado (CPF $($c.tutor.cpf)), pulando"
        continue
    }

    try {
        $tutor = Invoke-Api "POST" "/api/tutores" $c.tutor $token
        $totais.clientes++
        Write-Ok "Cliente cadastrado"
    } catch {
        Write-Erro "Cliente: $_"
        $falhas++
        continue
    }

    $idsAnimais = @{}
    if ($c.animais.Count -gt 0) {
        $lote = @()
        foreach ($a in $c.animais) {
            $item = $a.Clone()
            $item["tutorId"] = $tutor.id
            $lote += $item
        }
        try {
            $criados = @(Invoke-Api "POST" "/api/animais/lote" @{ animais = $lote } $token)
            foreach ($animal in $criados) {
                $idsAnimais[$animal.nome] = $animal.id
                $totais.animais++
            }
            Write-Ok "Animais: $(($c.animais | ForEach-Object { $_.nome }) -join ', ')"
        } catch {
            Write-Erro "Animais: $_"
            $falhas++
        }
    }

    foreach ($at in $c.atendimentos) {
        $animalId = $idsAnimais[$at.animal]
        if (-not $animalId) { continue }
        $hora = 9
        if ($at.tipo -eq "VACINA") { $hora = 14 }
        $corpo = @{
            tipo = $at.tipo
            descricao = $at.descricao
            observacoes = $null
            dataAtendimento = (Data-Atendimento $at.dias $hora)
            realizado = $at.realizado
            animalId = $animalId
            tutorId = $tutor.id
        }
        try {
            Invoke-Api "POST" "/api/atendimentos" $corpo $token | Out-Null
            $totais.atendimentos++
            $situacao = "agendado"
            if ($at.realizado) { $situacao = "realizado" }
            Write-Ok "Atendimento: $($at.descricao) ($($at.animal), $situacao)"
        } catch {
            Write-Erro "Atendimento de $($at.animal): $_"
            $falhas++
        }
    }
}

Write-Titulo "Resumo"
Write-Host "  Clientes: $($totais.clientes)   Animais: $($totais.animais)   Atendimentos: $($totais.atendimentos)"
if ($falhas -gt 0) {
    Write-Host "  $falhas item(ns) com erro (veja acima)." -ForegroundColor Yellow
}
Write-Host ""
Write-Host "Abra http://localhost:5173 e entre com o administrador para ver os dados."
Finalizar 0
