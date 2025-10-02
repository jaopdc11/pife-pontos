$(document).ready(function() {
    class Player {
        constructor(nome, pontos) {
            this.nome = nome;
            this.pontos = pontos;
        }
    }

    const jogadores = carregarDados();

    // Função para atualizar a tabela
    function atualizarTabela() {
        const tbody = $('#tabelaJogadores');

        jogadores.sort((a, b) => b.pontos - a.pontos);

        tbody.empty();

        jogadores.forEach(jogador => {
            const tr = $('<tr>').addClass('hover:bg-gray-750 transition');
            const tdNome = $('<td>').addClass('px-4 py-3').text(jogador.nome);
            const tdPontos = $('<td>').addClass('px-4 py-3 font-semibold').text(jogador.pontos);

            const tdAcoes = $('<td>').addClass('px-4 py-3');
            const btnContainer = $('<div>').addClass('flex gap-2');

            // Botão Adicionar
            const btnAdd = $('<button>')
                .addClass('px-3 py-1 bg-green-600 hover:bg-green-700 rounded transition font-bold')
                .text('+')
                .click(() => adicionarPonto(jogador));

            // Botão Remover
            const btnRem = $('<button>')
                .addClass('px-3 py-1 bg-red-600 hover:bg-red-700 rounded transition font-bold')
                .text('-')
                .click(() => tirarPonto(jogador));

            // Botão Deletar
            const btnDel = $('<button>')
                .addClass('px-3 py-1 bg-yellow-600 hover:bg-yellow-700 rounded transition font-bold')
                .text('×')
                .click(() => deletarJogador(jogador));

            btnContainer.append(btnAdd, btnRem, btnDel);
            tdAcoes.append(btnContainer);

            tr.append(tdNome, tdPontos, tdAcoes);
            tbody.append(tr);
        });

        function adicionarPonto(jogador) {
            jogador.pontos++;
            atualizarTabela();
            salvarDados(jogadores);

            // Feedback visual suave
            Swal.fire({
                icon: 'success',
                title: 'Ponto adicionado!',
                text: `${jogador.nome} agora tem ${jogador.pontos} pontos`,
                timer: 1000,
                showConfirmButton: false,
                toast: true,
                position: 'top-end'
            });
        }

        function tirarPonto(jogador) {
            if (jogador.pontos >= 1) {
                jogador.pontos--;
                atualizarTabela();
                salvarDados(jogadores);

                Swal.fire({
                    icon: 'info',
                    title: 'Ponto removido!',
                    text: `${jogador.nome} agora tem ${jogador.pontos} pontos`,
                    timer: 1000,
                    showConfirmButton: false,
                    toast: true,
                    position: 'top-end'
                });
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Ops...',
                    text: 'Não é possível ter pontos negativos',
                    timer: 1500,
                    showConfirmButton: false,
                    toast: true,
                    position: 'top-end'
                });
            }
        }

        function deletarJogador(jogador) {
            Swal.fire({
                title: 'Tem certeza?',
                html: `Você está prestes a remover <strong>${jogador.nome}</strong> do jogo.`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#6b7280',
                confirmButtonText: 'Sim, remover!',
                cancelButtonText: 'Cancelar',
                background: '#1f2937',
                color: '#fff'
            }).then((result) => {
                if (result.isConfirmed) {
                    const index = jogadores.indexOf(jogador);
                    if (index !== -1) {
                        jogadores.splice(index, 1);
                        atualizarTabela();
                        salvarDados(jogadores);

                        Swal.fire({
                            title: 'Removido!',
                            text: `${jogador.nome} foi removido do jogo`,
                            icon: 'success',
                            timer: 1500,
                            showConfirmButton: false,
                            background: '#1f2937',
                            color: '#fff'
                        });
                    }
                }
            });
        }
    }

    // Submit do formulário
    $('form').on('submit', function(event) {
        event.preventDefault();

        const nome = $('#nome').val().trim();

        if (nome !== '') {
            // Verifica se jogador já existe
            const existe = jogadores.find(j => j.nome.toLowerCase() === nome.toLowerCase());
            if (existe) {
                Swal.fire({
                    icon: 'error',
                    title: 'Jogador já existe!',
                    text: `"${nome}" já está na lista de jogadores`,
                    confirmButtonText: 'OK',
                    background: '#1f2937',
                    color: '#fff'
                });
                return;
            }

            jogadores.push(new Player(nome, 0));
            salvarDados(jogadores);
            atualizarTabela();

            Swal.fire({
                icon: 'success',
                title: 'Jogador adicionado!',
                text: `${nome} entrou no jogo`,
                timer: 1500,
                showConfirmButton: false,
                toast: true,
                position: 'top-end'
            });

            $('#nome').val('').focus();
        }
    });

    // Enter no input adiciona jogador
    $('#nome').on('keypress', function(e) {
        if (e.which === 13) { // Enter key
            $('form').submit();
        }
    });

    function salvarDados(dados) {
        localStorage.setItem('jogadores', JSON.stringify(dados));
    }

    function carregarDados() {
        const dados = localStorage.getItem('jogadores');
        return dados ? JSON.parse(dados) : [];
    }

    // Inicializa a tabela
    atualizarTabela();
});