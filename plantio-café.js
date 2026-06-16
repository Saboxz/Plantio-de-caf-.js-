//- Plantio de Café
// Versão em JavaScript / Node.js
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
    
const QUANTIDADE_MEDIDAS = 100;

let medidas = [];

// =========================
// FUNÇÕES AUXILIARES
// =========================

function perguntar(mensagem) {
    return new Promise((resolve) => {
        rl.question(mensagem, (resposta) => {
            resolve(resposta.trim());
        });
    });
}

function gerarNumeroAleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function lerNumero(mensagem, min = null, max = null) {
    while (true) {
        const resposta = await perguntar(mensagem);
        const numero = Number(resposta);

        if (!Number.isInteger(numero)) {
            console.log("Digite apenas números inteiros.");
            continue;
        }

        if (min !== null && numero < min) {
            console.log(`O número precisa ser maior ou igual a ${min}.`);
            continue;
        }

        if (max !== null && numero > max) {
            console.log(`O número precisa ser menor ou igual a ${max}.`);
            continue;
        }

        return numero;
    }
}

function pausar() {
    return perguntar("\nPressione ENTER para continuar...");
}

function linha() {
    console.log("=".repeat(70));
}

function limparTela() {
    console.clear();
}

// =========================
// GERAÇÃO DOS DADOS
// =========================

function gerarMedidas() {
    medidas = [];

    for (let i = 0; i < QUANTIDADE_MEDIDAS; i++) {
        const medida = {
            id: i + 1,
            latitude: gerarNumeroAleatorio(0, 1000),
            longitude: gerarNumeroAleatorio(0, 1000),
            producao: gerarNumeroAleatorio(0, 100),
            acidez: gerarNumeroAleatorio(0, 1000)
        };

        medidas.push(medida);
    }
}

// =========================
// EXIBIÇÃO
// =========================

function mostrarTitulo(titulo) {
    limparTela();
    linha();
    console.log(titulo.toUpperCase().padStart((70 + titulo.length) / 2));
    linha();
}

function mostrarMedida(medida) {
    console.log(`ID: ${medida.id}`);
    console.log(`Latitude: ${medida.latitude}`);
    console.log(`Longitude: ${medida.longitude}`);
    console.log(`Produção: ${medida.producao}`);
    console.log(`Acidez: ${medida.acidez}`);
}

function mostrarTabela(lista) {
    console.log(
        "POS".padEnd(6) +
        "ID".padEnd(6) +
        "LATITUDE".padEnd(12) +
        "LONGITUDE".padEnd(12) +
        "PRODUÇÃO".padEnd(12) +
        "ACIDEZ"
    );

    console.log("-".repeat(70));

    lista.forEach((medida, index) => {
        console.log(
            String(index + 1).padEnd(6) +
            String(medida.id).padEnd(6) +
            String(medida.latitude).padEnd(12) +
            String(medida.longitude).padEnd(12) +
            String(medida.producao).padEnd(12) +
            String(medida.acidez)
        );
    });
}

// =========================
// ORDENAÇÕES / RANKINGS
// =========================

function rankingPorProducao() {
    return [...medidas].sort((a, b) => {
        if (b.producao !== a.producao) {
            return b.producao - a.producao;
        }

        return b.acidez - a.acidez;
    });
}

function rankingPorAcidez() {
    return [...medidas].sort((a, b) => {
        if (b.acidez !== a.acidez) {
            return b.acidez - a.acidez;
        }

        return b.producao - a.producao;
    });
}

// =========================
// FUNCIONALIDADES DO MENU
// =========================

async function listarTodasMedidas() {
    mostrarTitulo("Todas as Medidas Geradas");
    mostrarTabela(medidas);
    await pausar();
}

async function mostrarClassificacaoPorProducao() {
    mostrarTitulo("Classificação Geral por Produção");

    const ranking = rankingPorProducao();
    mostrarTabela(ranking);

    await pausar();
}

async function mostrarClassificacaoPorAcidez() {
    mostrarTitulo("Classificação Geral por Acidez");

    const ranking = rankingPorAcidez();
    mostrarTabela(ranking);

    await pausar();
}

async function buscarPosicaoPorProducao() {
    mostrarTitulo("Buscar Posição por Produção");

    const posicao = await lerNumero(
        `Digite a posição do ranking de produção entre 1 e ${QUANTIDADE_MEDIDAS}: `,
        1,
        QUANTIDADE_MEDIDAS
    );

    const ranking = rankingPorProducao();
    const medida = ranking[posicao - 1];

    console.log(`\n${posicao}º lugar no ranking de produção:\n`);
    mostrarMedida(medida);

    await pausar();
}

async function buscarPosicaoPorAcidez() {
    mostrarTitulo("Buscar Posição por Acidez");

    const posicao = await lerNumero(
        `Digite a posição do ranking de acidez entre 1 e ${QUANTIDADE_MEDIDAS}: `,
        1,
        QUANTIDADE_MEDIDAS
    );

    const ranking = rankingPorAcidez();
    const medida = ranking[posicao - 1];

    console.log(`\n${posicao}º lugar no ranking de acidez:\n`);
    mostrarMedida(medida);

    await pausar();
}

async function alterarMedidaPorLatitudeLongitude() {
    mostrarTitulo("Alterar Dados de uma Medida");

    const latitude = await lerNumero("Digite a latitude da medida: ", 0, 1000);
    const longitude = await lerNumero("Digite a longitude da medida: ", 0, 1000);

    const medida = medidas.find((m) => {
        return m.latitude === latitude && m.longitude === longitude;
    });

    if (!medida) {
        console.log("\nNenhuma medida encontrada com essa latitude e longitude.");
        await pausar();
        return;
    }

    console.log("\nMedida encontrada:\n");
    mostrarMedida(medida);

    const novaProducao = await lerNumero("\nDigite a nova produção entre 0 e 100: ", 0, 100);
    const novaAcidez = await lerNumero("Digite a nova acidez entre 0 e 1000: ", 0, 1000);

    medida.producao = novaProducao;
    medida.acidez = novaAcidez;

    console.log("\nDados alterados com sucesso!\n");
    mostrarMedida(medida);

    await pausar();
}

async function buscarMedidaPorID() {
    mostrarTitulo("Buscar Medida por ID");

    const id = await lerNumero(
        `Digite o ID da medida entre 1 e ${QUANTIDADE_MEDIDAS}: `,
        1,
        QUANTIDADE_MEDIDAS
    );

    const medida = medidas.find((m) => m.id === id);

    console.log("\nMedida encontrada:\n");
    mostrarMedida(medida);

    await pausar();
}

async function mostrarResumo() {
    mostrarTitulo("Resumo das Medidas");

    const maiorProducao = rankingPorProducao()[0];
    const menorProducao = rankingPorProducao()[QUANTIDADE_MEDIDAS - 1];

    const maiorAcidez = rankingPorAcidez()[0];
    const menorAcidez = rankingPorAcidez()[QUANTIDADE_MEDIDAS - 1];

    const somaProducao = medidas.reduce((soma, m) => soma + m.producao, 0);
    const somaAcidez = medidas.reduce((soma, m) => soma + m.acidez, 0);

    const mediaProducao = somaProducao / QUANTIDADE_MEDIDAS;
    const mediaAcidez = somaAcidez / QUANTIDADE_MEDIDAS;

    console.log("Maior produção:");
    mostrarMedida(maiorProducao);

    console.log("\nMenor produção:");
    mostrarMedida(menorProducao);

    console.log("\nMaior acidez:");
    mostrarMedida(maiorAcidez);

    console.log("\nMenor acidez:");
    mostrarMedida(menorAcidez);

    console.log("\nMédias gerais:");
    console.log(`Média de produção: ${mediaProducao.toFixed(2)}`);
    console.log(`Média de acidez: ${mediaAcidez.toFixed(2)}`);

    await pausar();
}

async function gerarNovasMedidas() {
    mostrarTitulo("Gerar Novas Medidas");

    const confirmar = await perguntar(
        "Isso apagará as medidas atuais. Deseja continuar? (s/n): "
    );

    if (confirmar.toLowerCase() === "s") {
        gerarMedidas();
        console.log("\nNovas medidas geradas com sucesso!");
    } else {
        console.log("\nOperação cancelada.");
    }

    await pausar();
}

// =========================
// MENU PRINCIPAL
// =========================

function mostrarMenu() {
    limparTela();
    linha();
    console.log("SISTEMA DE ANÁLISE DE PLANTIO DE CAFÉ".padStart(54));
    linha();

    console.log("1 - Listar todas as medidas");
    console.log("2 - Buscar posição no ranking por produção");
    console.log("3 - Buscar posição no ranking por acidez");
    console.log("4 - Mostrar classificação geral por produção");
    console.log("5 - Mostrar classificação geral por acidez");
    console.log("6 - Alterar produção e acidez por latitude/longitude");
    console.log("7 - Buscar medida por ID");
    console.log("8 - Mostrar resumo geral");
    console.log("9 - Gerar novas medidas");
    console.log("0 - Sair");

    linha();
}

async function iniciarPrograma() {
    gerarMedidas();

    let opcao;

    do {
        mostrarMenu();

        opcao = await lerNumero("Escolha uma opção: ", 0, 9);

        switch (opcao) {
            case 1:
                await listarTodasMedidas();
                break;

            case 2:
                await buscarPosicaoPorProducao();
                break;

            case 3:
                await buscarPosicaoPorAcidez();
                break;

            case 4:
                await mostrarClassificacaoPorProducao();
                break;

            case 5:
                await mostrarClassificacaoPorAcidez();
                break;

            case 6:
                await alterarMedidaPorLatitudeLongitude();
                break;

            case 7:
                await buscarMedidaPorID();
                break;

            case 8:
                await mostrarResumo();
                break;

            case 9:
                await gerarNovasMedidas();
                break;

            case 0:
                limparTela();
                console.log("Programa encerrado.");
                break;
        }

    } while (opcao !== 0);

    rl.close();
}

iniciarPrograma();