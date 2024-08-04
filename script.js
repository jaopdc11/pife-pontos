$(document).ready(function () {
    class player {
        constructor(nome, pontos) {
            this.nome = nome;
            this.pontos = pontos;
        }
    }

    const jogadores = carregarDados();

    // Função para atualizar a tabela
    function atualizarTabela() {
        const tbody = $('#tabelaJogadores tbody');

        jogadores.sort((a, b) => b.pontos - a.pontos);

        tbody.empty();

        jogadores.forEach(jogador => {
            const tr = $('<tr>');
            const tdNome = $('<td>').text(jogador.nome);
            const tdPontos = $('<td>').text(jogador.pontos);

            const tdAcoes = $('<td>').addClass('d-flex justify-content-space-around align-items-center');

            const btnContainer = $('<div>').addClass('d-flex gap-2');

            const btnAdd = $('<button>').addClass('btn btn-success').text('+').click(() => adicionarPonto(jogador));
            const btnRem = $('<button>').addClass('btn btn-danger').text('-').click(() => tirarPonto(jogador));
            const btnDel = $('<button>').addClass('btn btn-warning').text('X').click(() => deletarJogador(jogador));

            btnContainer.append(btnAdd, btnRem, btnDel);
            tdAcoes.append(btnContainer);

            tr.append(tdNome, tdPontos, tdAcoes);
            tbody.append(tr);
        });

        function adicionarPonto(jogador) {
            jogador.pontos++;
            atualizarTabela();
            salvarDados(jogadores);
        }

        function tirarPonto(jogador) {
            if (jogador.pontos >= 1) {
                jogador.pontos--;
                atualizarTabela();
                salvarDados(jogadores);
            } else {
                return;
            }
        }

        function deletarJogador(jogador) {
            const index = jogadores.indexOf(jogador);

            if (index !== -1) {
                jogadores.splice(index, 1);
                atualizarTabela();
                salvarDados(jogadores);
            }
        }
    }

    atualizarTabela();

    $('form').on('submit', function (event) {
        event.preventDefault();

        const nome = $('#nome').val();

        if (nome !== '') {
            jogadores.push(new player(nome, 0));
            salvarDados(jogadores);
        }

        atualizarTabela();

        $('#nome').val('');
    });

    $('#btnRefresh').on('click', function () {
        atualizarTabela();
    });

    function salvarDados(dados) {
        localStorage.setItem('jogadores', JSON.stringify(dados));
    }

    function carregarDados() {
        const dados = localStorage.getItem('jogadores');
        return dados ? JSON.parse(dados) : [];
    }
});
