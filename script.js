// ===== MENU E SUBMENU (igual ao exemplo da professora, adaptado ao nosso menu) =====

// Seleciona os elementos do HTML
const btnSobre = document.getElementById('btn-sobre');
const menuVerticalSobre = document.getElementById('menu-vertical-sobre');
const btnContato = document.getElementById('btn-contato');
const menuVerticalContato = document.getElementById('menu-vertical-contato');

// Adiciona o evento de clique no botão "Sobre"
btnSobre.addEventListener('click', function(event) {
    abreMenu(event, menuVerticalSobre);
});

btnContato.addEventListener('click', function(event) {
    abreMenu(event, menuVerticalContato);
});

//Funcão geral para abrir/fechar TODOS OS menu vertical
function abreMenu(event, menu) {
    event.preventDefault(); // Evita que a página recarregue ao clicar no link
    // Liga/Desliga a classe 'active' do menu vertical
    menu.classList.toggle('active');
}

function fechaMenu(event, menu, btn) {
    if (!menu.contains(event.target) && event.target !== btn) {
        menu.classList.remove('active');
    }
}

// Opcional: Fecha o menu se o usuário clicar fora dele
document.addEventListener('click', function(event) {
    fechaMenu(event, menuVerticalSobre, btnSobre);
    fechaMenu(event, menuVerticalContato, btnContato);
});


// ===== SUBMENUS: dados de Empresa, Clientes, Telefone e Email =====
const linkEmpresa = document.getElementById('link-empresa');
const linkClientes = document.getElementById('link-clientes');
const linkTelefone = document.getElementById('link-telefone');
const linkEmail = document.getElementById('link-email');

// Empresa: mostra os dados da empresa
linkEmpresa.addEventListener('click', function(event) {
    event.preventDefault();
    alert('Empresa: Cine Club\nRede social para quem ama cinema. Aqui você descobre filmes, avalia e comenta com a galera.');
});

// Clientes: mostra quem usa o site
linkClientes.addEventListener('click', function(event) {
    event.preventDefault();
    alert('Nossos clientes:\nCinéfilos de todo o Brasil\nEscolas e professores de cinema\nClubes de cinema e produtoras independentes');
});

// Telefone: mostra o telefone de contato da empresa
linkTelefone.addEventListener('click', function(event) {
    event.preventDefault();
    alert('Telefones de contato do Cine Club:\n(00) 0000-0000\n(00) 90000-0000');
});

// Email: abre o Outlook (programa de email) já com o email do site e o assunto
linkEmail.addEventListener('click', function(event) {
    event.preventDefault();
    window.location.href = 'mailto:contato@cineclub.com.br?subject=Contato%20pelo%20site%20Cine%20Club';
});


// ===== DATA NO RODAPÉ (todas as páginas) =====
const dataAtual = document.getElementById('data-atual');
dataAtual.textContent = new Date().toLocaleDateString('pt-BR');


// ===== CADASTRO (só existe em cadastro.html) =====
const formCadastro = document.getElementById('form-cadastro');

if (formCadastro) {
    formCadastro.addEventListener('submit', function(event) {
        event.preventDefault(); // Evita que a página recarregue e perca os dados

        const nome = document.getElementById('nome').value;
        const cpf = document.getElementById('cpf').value;
        const endereco = document.getElementById('endereco').value;
        const email = document.getElementById('email-cadastro').value;
        const senha = document.getElementById('senha-cadastro').value;
        const confirmar = document.getElementById('confirmar-senha').value;
        const arquivoFoto = document.getElementById('foto-perfil').files[0];
        const msg = document.getElementById('msg-cadastro');

        if (senha !== confirmar) {
            msg.textContent = 'As senhas não coincidem.';
            return;
        }

        if (arquivoFoto && arquivoFoto.size > 1500000) {
            msg.textContent = 'A foto é muito grande. Escolha uma foto de até 1,5 MB.';
            return;
        }

        // Função que salva tudo (a foto chega aqui já convertida em texto)
        function salvaCadastro(foto) {
            // Salva no navegador (localStorage) usando JSON
            const usuario = { nome: nome, cpf: cpf, endereco: endereco, email: email, senha: senha, foto: foto };
            try {
                localStorage.setItem('usuario', JSON.stringify(usuario));
            } catch (erro) {
                msg.textContent = 'Não foi possível salvar a foto. Escolha uma foto menor.';
                return;
            }

            // Salva também em um arquivo .txt (baixa o arquivo cadastro.txt)
            const texto = 'Nome: ' + nome + '\n' +
                          'CPF: ' + cpf + '\n' +
                          'Endereço: ' + endereco + '\n' +
                          'Email: ' + email + '\n' +
                          'Senha: ' + senha;
            const arquivo = new Blob([texto], { type: 'text/plain' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(arquivo);
            link.download = 'cadastro.txt';
            link.click();

            msg.textContent = 'Cadastro realizado com sucesso! Arquivo cadastro.txt baixado. Indo para o login...';
            setTimeout(function() {
                window.location.href = 'login.html';
            }, 1500);
        }

        // Se escolheu foto, converte a imagem em texto (base64) antes de salvar
        if (arquivoFoto) {
            const leitor = new FileReader();
            leitor.onload = function() {
                salvaCadastro(leitor.result);
            };
            leitor.readAsDataURL(arquivoFoto);
        } else {
            salvaCadastro('');
        }
    });
}


// ===== LOGIN (só existe em login.html) =====
const formLogin = document.getElementById('form-login');

if (formLogin) {
    formLogin.addEventListener('submit', function(event) {
        event.preventDefault();

        const email = document.getElementById('email-login').value;
        const senha = document.getElementById('senha-login').value;
        const msg = document.getElementById('msg-login');
        const usuario = JSON.parse(localStorage.getItem('usuario'));

        if (usuario === null) {
            msg.textContent = 'Nenhum cadastro encontrado. Cadastre-se primeiro.';
        } else if (email === usuario.email && senha === usuario.senha) {
            window.location.href = 'pagina.html';
        } else {
            msg.textContent = 'Email ou senha incorretos.';
        }
    });
}


// ===== COMUNIDADE (só existe em pagina.html) =====
const nomeUsuario = document.getElementById('nome-usuario');
const fotoUsuario = document.getElementById('foto-usuario');
const formAvaliacao = document.getElementById('form-avaliacao');
const feed = document.getElementById('feed');

// Dados de quem se cadastrou (se ninguém se cadastrou, usa "Visitante" e a foto padrão)
let nomeLogado = 'Visitante';
let fotoLogado = 'perfil.jpg';
const usuarioSalvo = JSON.parse(localStorage.getItem('usuario'));

if (usuarioSalvo !== null) {
    nomeLogado = usuarioSalvo.nome;
    if (usuarioSalvo.foto) {
        fotoLogado = usuarioSalvo.foto;
    }
}

// Mostra o nome e a foto de perfil no topo da página
if (nomeUsuario && usuarioSalvo !== null) {
    nomeUsuario.textContent = nomeLogado;
}
if (fotoUsuario) {
    fotoUsuario.src = fotoLogado;
}

// Função que faz o formulário de comentário de um post funcionar
function ligaComentario(form) {
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const campo = form.querySelector('.campo-comentario');
        const lista = form.parentElement.querySelector('.lista-comentarios');

        const item = document.createElement('li');
        const autor = document.createElement('strong');
        autor.textContent = nomeLogado + ': ';
        item.appendChild(autor);
        item.appendChild(document.createTextNode(campo.value));
        lista.appendChild(item);

        form.reset();
    });
}

// Faz funcionar o comentário dos posts que já estão na página
if (feed) {
    const formsComentario = document.querySelectorAll('.form-comentario');
    for (let i = 0; i < formsComentario.length; i++) {
        ligaComentario(formsComentario[i]);
    }
}

// Publicar uma nova avaliação
if (formAvaliacao) {
    formAvaliacao.addEventListener('submit', function(event) {
        event.preventDefault();

        const titulo = document.getElementById('titulo-filme').value;
        const nota = Number(document.getElementById('nota-filme').value);
        const texto = document.getElementById('texto-avaliacao').value;
        const arquivoFilme = document.getElementById('foto-filme').files[0];

        // Função que monta o post na tela (a foto do filme chega aqui já convertida em texto)
        function criaPost(fotoFilme) {
            const post = document.createElement('article');
            post.className = 'post';
            post.innerHTML =
                '<div class="post-topo">' +
                    '<img class="foto-autor" alt="Foto do autor">' +
                    '<strong class="nome-autor"></strong>' +
                '</div>' +
                '<h3 class="titulo-post"></h3>' +
                '<img class="foto-post" alt="Foto do filme">' +
                '<p class="nota-post"></p>' +
                '<p class="texto-post"></p>' +
                '<div class="comentarios">' +
                    '<h4>Comentários</h4>' +
                    '<ul class="lista-comentarios"></ul>' +
                    '<form class="form-comentario">' +
                        '<input type="text" class="campo-comentario" placeholder="Escreva um comentário..." required>' +
                        '<button type="submit" class="botao">Comentar</button>' +
                    '</form>' +
                '</div>';

            // Preenche os dados (textContent evita que o texto vire HTML)
            post.querySelector('.foto-autor').src = fotoLogado;
            post.querySelector('.nome-autor').textContent = nomeLogado;
            post.querySelector('.titulo-post').textContent = titulo;
            post.querySelector('.nota-post').textContent = '★'.repeat(nota) + '☆'.repeat(5 - nota);
            post.querySelector('.texto-post').textContent = texto;

            // Foto do filme (se não escolheu foto, o post fica sem imagem)
            const imgFilme = post.querySelector('.foto-post');
            if (fotoFilme) {
                imgFilme.src = fotoFilme;
                imgFilme.alt = 'Foto do filme ' + titulo;
            } else {
                imgFilme.remove();
            }

            ligaComentario(post.querySelector('.form-comentario'));

            // Coloca o novo post no topo do feed
            feed.insertBefore(post, feed.querySelector('.post'));
            formAvaliacao.reset();
            post.scrollIntoView({ behavior: 'smooth' });
        }

        // Se escolheu foto do filme, converte a imagem em texto (base64) antes de postar
        if (arquivoFilme) {
            const leitor = new FileReader();
            leitor.onload = function() {
                criaPost(leitor.result);
            };
            leitor.readAsDataURL(arquivoFilme);
        } else {
            criaPost('');
        }
    });
}