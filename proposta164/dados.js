// =====================================================================
// PROPOSTA 164 — DADOS EDITÁVEIS
// Mude valores e datas AQUI. Todos os totais da página são calculados
// a partir destes números (nada é digitado à mão no HTML).
// =====================================================================
window.PROPOSTA = {
  numero: '164',
  data: '2026-10-15',            // data de emissão (AAAA-MM-DD)
  validadeDias: 15,
  cliente: 'Plataforma GED/GRD',   // aparece na capa, no campo "Projeto"
  referencia: 'Concorrência Energisa — projeto de subestação (civil e eletromecânico)',
  contato: {
    nome: 'Luis Almeida',
    email: 'contato@sysalmeida.com.br',
    whatsapp: '5565998007684',   // mesmo número usado no site
  },
  manutencaoMensal: 850,
  servidorMensal: 650,           // VPS dedicada no Brasil
  mesesContrato: 12,
  compra: {
    desenvolvimento: 58000,
    entrada: 16000,
    parcelas: [14000, 14000, 14000], // pagas nos dias 30, 60 e 90
  },
  licenca: {
    aporte: 24000,
    entrada: 9000,
    parcelas: [5000, 5000, 5000],    // pagas nos dias 30, 60 e 90
    licencaMensal: 1500,
    descontoAnualAntecipado: 0.30,   // mesmo desconto do Bitrix24 no plano anual
    usuariosIncluidos: 100,
  },
  bitrix24: {                        // preços públicos consultados em 14/10/2026
    consultadoEm: '14/10/2026',
    cotacaoDolar: 5.04,
    professionalMensalUSD: 289,
    professionalAnualUSD: 199,
    enterpriseMensalUSD: 579,
    enterpriseAnualUSD: 399,
  },
  dimensionamento: {
    usuariosPrevistos: 35, usuariosEquipe: 25, usuariosEnergisa: 10,
    documentos: 350, documentosProjeto: 250, documentosFabricantes: 100,
    emissoesAno: 1050, grdsAno: 200, atasAno: 52, armazenamentoGB: 50,
  },
  // Cronograma: dias contados a partir da assinatura + entrada (Dia 0)
  cronograma: [
    { dia: 0,  titulo: 'Assinatura e entrada', texto: 'Assinatura do contrato e pagamento da entrada. Início do desenvolvimento.' },
    { dia: 15, titulo: 'Funcionalidades principais em uso', texto: 'Acesso e perfis, lista mestra, repositório com revisões e GRD básica. A equipe já começa a subir documentos.' },
    { dia: 30, destaque: true, parcela: 1, titulo: 'Liberação oficial para uso no projeto', texto: 'Força-tarefa da SyS Almeida para este marco: fluxo de aprovação, comentários e GRD completa. A equipe da Energisa passa a operar na plataforma.' },
    { dia: 45, titulo: 'Atas e notificações', texto: 'Atas de reunião com pendências e notificações por e-mail.' },
    { dia: 60, parcela: 2, titulo: 'Auditoria e acompanhamento', texto: 'Trilha de auditoria e painel de acompanhamento.' },
    { dia: 75, titulo: 'Visualizador e segurança completa', texto: 'Visualizador de PDF/DWG, segurança completa e ajustes pedidos pelas equipes.' },
    { dia: 90, parcela: 3, titulo: 'Versão completa', texto: 'Homologação, treinamento e manual. Entrega da versão completa.' },
  ],
  funcionalidades: [
    ['Acesso e perfis', 'Empresas, usuários e permissões por disciplina e por empresa, incluindo a Energisa', 'Dia 15'],
    ['Lista mestra de documentos', 'Todos os documentos previstos, com código padronizado, disciplina, responsável e data prevista', 'Dia 15'],
    ['Repositório com revisões', 'Upload de PDF e DWG, revisões 0, A, B…, bloqueio automático da revisão superada, histórico completo', 'Dia 15'],
    ['GRD', 'Guia numerada em sequência, finalidade (Para Aprovação, Para Construção, Para Informação, As Built, Cancelado), PDF da guia, envio e confirmação de recebimento', 'Dia 15 (básica) · Dia 30 (completa)'],
    ['Fluxo de aprovação', 'Status: em elaboração, emitido, em análise, aprovado, aprovado com comentários, reprovado, cancelado; prazos de análise', 'Dia 30'],
    ['Comentários', 'Folha de comentários por documento e revisão, com resposta do projetista', 'Dia 30'],
    ['Atas de reunião', 'Participantes, decisões, pendências com responsável e prazo', 'Dia 45'],
    ['Notificações', 'E-mail na emissão, no vencimento de prazo e no recebimento de GRD', 'Dia 45'],
    ['Trilha de auditoria', 'Quem acessou, baixou, alterou e aprovou cada documento, com data e hora', 'Dia 60'],
    ['Painel de acompanhamento', 'Pendências por disciplina, documentos atrasados, curva de emissão', 'Dia 60'],
    ['Visualizador', 'Abrir PDF e DWG no navegador sem baixar', 'Dia 75'],
    ['Segurança', 'Autenticação em dois fatores, backup diário, criptografia, conformidade com a LGPD', 'Dia 15 (base) · Dia 75 (completa)'],
    ['Homologação e treinamento', 'Testes finais, treinamento das equipes, manual de uso', 'Dia 90'],
  ],
};
