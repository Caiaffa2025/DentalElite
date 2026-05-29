import { Specialty, Doctor, Testimonial, QuizQuestion } from './types';

export const specialties: Specialty[] = [
  {
    id: 'implantes',
    name: 'Implantes Dentários',
    shortDescription: 'Recupere a mastigação completa e a segurança ao sorrir com implantes de alta tecnologia.',
    fullDescription: 'Os implantes funcionam como raízes artificiais de titânio instaladas no osso maxilar ou mandibular para suportar novos dentes. Com tecnologia de planejamento digital guiada 3D, garantimos soluções rápidas, confortáveis e com cicatrização acelerada.',
    benefits: [
      'Recuperação de 100% da força mastigatória',
      'Prevenção da reabsorção óssea',
      'Estética idêntica aos dentes naturais',
      'Procedimento guiado por computador (técnicas menos invasivas)',
      'Durabilidade por toda a vida com cuidados adequados'
    ],
    duration: 'De 2 a 6 meses (com opções de carga imediata)',
    iconName: 'ShieldCheck'
  },
  {
    id: 'ortodontia',
    name: 'Aparelhos Alinhadores (Invisalign)',
    shortDescription: 'Conquiste dentes perfeitamente alinhados com alinhadores invisíveis, confortáveis e removíveis.',
    fullDescription: 'Alinhe seus dentes sem o incômodo de fios e braquetes metálicos tradicionais. O sistema de alinhadores transparentes sob medida permite que você retire para comer e escovar os dentes, sendo praticamente invisível aos olhos e até 50% mais rápido que métodos tradicionais.',
    benefits: [
      'Estética discreta (completamente transparente)',
      'Máximo conforto sem cortes ou pontas metálicas',
      'Removível para alimentação e higiene perfeita',
      'Previsibilidade com simulação digital 3D do resultado antes de iniciar',
      'Consultas de acompanhamento mais rápidas e espaçadas'
    ],
    duration: 'De 6 a 18 meses',
    iconName: 'Sparkles'
  },
  {
    id: 'estetica',
    name: 'Lentes de Contato & Facetas',
    shortDescription: 'Transforme o formato, cor e alinhamento dos seus dentes em poucas sessões.',
    fullDescription: 'Lentes de contato dental são lâminas ultrafinas de porcelana de alta resistência coladas sobre a frente dos dentes. É a técnica preferida dos artistas para corrigir dentes escurecidos, fraturados, desalinhados ou com espaços indesejados (diastemas) de forma minimamente invasiva.',
    benefits: [
      'Correção imediata de cor, tamanho e formato',
      'Desgaste mínimo ou nulo do esmalte natural do dente',
      'Material altamente resistente a manchas (café, vinho, etc.)',
      'Sorriso simétrico, jovem e luminoso',
      'Rapidez de aplicação (geralmente em apenas 2 a 3 consultas)'
    ],
    duration: '2 a 3 sessões',
    iconName: 'Activity'
  },
  {
    id: 'odontopediatria',
    name: 'Odontopediatria',
    shortDescription: 'Cuidados dedicados e sem traumas para a saúde bucal de bebês, crianças e adolescentes.',
    fullDescription: 'Especialidade dedicada ao cuidado bucal desde os primeiros meses de vida até a adolescência. Nosso consultório é inteiramente preparado de forma lúdica (técnico de distração e psicologia infantil) para que a criança veja o dentista como um amigo, prevenindo fobias futuras.',
    benefits: [
      'Atendimento lúdico e 100% livre de traumas',
      'Prevenção ativa de cáries e problemas de mordida',
      'Orientação correta de escovação e uso do fio dental',
      'Acompanhamento do desenvolvimento dos ossos da face',
      'Ambiente decorado e aconchegante para distrair os pequenos'
    ],
    duration: 'Consultas rotineiras preventivas a cada 6 meses',
    iconName: 'Baby'
  },
  {
    id: 'canal-estetica',
    name: 'Tratamento de Canal (Endodontia)',
    shortDescription: 'Alívio rápido da dor e preservação do seu dente natural com microscopia operacional.',
    fullDescription: 'O tratamento de canal consiste na remoção da polpa dentária inflamada ou infectada, seguida de limpeza profunda e vedação do canal. Utilizamos tecnologia de endodontia mecanizada e localizadores apicais que garantem procedimentos rápidos, precisos e totalmente sem dor.',
    benefits: [
      'Alívio imediato de dores agudas e latejantes',
      'Evita a perda precoce do dente natural',
      'Tratamento na maioria das vezes finalizado em sessão única',
      'Uso de anestesia computadorizada de alta eficiência',
      'Prevenção de infecções graves em outras partes do corpo'
    ],
    duration: 'Sessão única na maioria dos casos (1 a 2 horas)',
    iconName: 'HeartPulse'
  },
  {
    id: 'clareamento',
    name: 'Clareamento Dental Premium',
    shortDescription: 'Sorriso radiante e brilhante com nossos protocolos a laser e caseiros monitorados.',
    fullDescription: 'Um sorriso amarelo pode prejudicar sua autoestima. Combinamos as técnicas de clareamento de consultório (ativado por luz violeta) e clareamento caseiro com moldeiras personalizadas para alcançar o tom de branco mais natural e duradouro, com controle absoluto da sensibilidade.',
    benefits: [
      'Dentes até 8 tons mais brancos e brilhantes',
      'Protocolos customizados para dentes sensíveis',
      'Resultados visíveis logo na primeira sessão de consultório',
      'Géis clareadores importados e seguros de alta performance',
      'Melhora significativa da autoconfiança de forma rápida'
    ],
    duration: 'De 2 a 3 semanas',
    iconName: 'Sun'
  }
];

export const doctors: Doctor[] = [
  {
    id: 'mariana',
    name: 'Dra. Mariana Vasconcellos',
    role: 'Especialista em Ortodontia e Alinhadores Invisalign',
    cro: 'CRO-SP 115.429',
    specialtyId: 'ortodontia',
    imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
    bio: 'Formada pela USP com mais de 10 anos de experiência, possui certificação internacional Invisalign Top Doctor Platinum. Dedicada a alinhar sorrisos com planejamento totalmente digital.'
  },
  {
    id: 'roberto',
    name: 'Dr. Roberto Takahashi',
    role: 'Especialista em Implantodontia e Cirurgia Guiada',
    cro: 'CRO-SP 98.711',
    specialtyId: 'implantes',
    imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
    bio: 'Doutor em Implantodontia com foco em técnicas minimamente invasivas e cirurgias guiadas sem cortes. Experiência de mais de 4.000 implantes realizados com sucesso absoluto.'
  },
  {
    id: 'beatriz',
    name: 'Dra. Beatriz Menezes',
    role: 'Especialista em Odontologia Estética e Lentes de Porcelana',
    cro: 'CRO-SP 142.308',
    specialtyId: 'estetica',
    imageUrl: '/uploads/img_1780066053276_905172.avif',
    bio: 'Referência em reabilitação oral estética de alta complexidade. Cria designs de sorrisos únicos combinando arte, proporção facial e tecnologia ultramoderna.'
  },
  {
    id: 'thiago',
    name: 'Dr. Sydney Tadeu Caiaffa',
    role: 'Especialista em Endodontia de Alta Performance',
    cro: 'CRO-SP 103.220',
    specialtyId: 'canal-estetica',
    imageUrl: '/uploads/img_1780066053276_39663.jpg',
    bio: 'Mestre em Endodontia, utiliza microscopia óptica operacional alemã que permite tratar canais com precisão microscópica e sem dor, devolvendo a tranquilidade ao paciente.'
  }
];

export const testimonials: Testimonial[] = [
  {
    id: 't1',
    name: 'Rodrigo Albuquerque',
    age: 41,
    city: 'São Paulo',
    rating: 5,
    treatmentName: 'Implante Dentário Sem Cortes',
    treatmentId: 'implantes',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    text: 'Eu morria de medo de fazer implante. No entanto, o Dr. Roberto fez todo o planejamento no computador e a cirurgia foi incrivelmente rápida. Nem precisei tomar anti-inflamatório forte depois, zero dor! Hoje consigo comer de tudo e sorrir com confiança novamente.'
  },
  {
    id: 't2',
    name: 'Juliana Paiva',
    age: 29,
    city: 'Campinas',
    rating: 5,
    treatmentName: 'Alinhadores Transparentes Invisalign',
    treatmentId: 'ortodontia',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    text: 'Como trabalho muito em reuniões e eventos presenciais, não queria colocar aparelho de metal. A Dra. Mariana me apresentou o Invisalign e mudou tudo! Em menos de um ano meus dentes já estão perfeitos, ninguém percebia que eu estava usando e o conforto no dia a dia é incrível.'
  },
  {
    id: 't3',
    name: 'Carlos Heitor Mendes',
    age: 35,
    city: 'São Bernardo',
    rating: 5,
    treatmentName: 'Lentes de Contato de Porcelana',
    treatmentId: 'estetica',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    text: 'Minha autoestima era muito afetada pelo formato e a cor amarelada dos meus dentes da frente. A equipe da Dra. Beatriz fez um escaneamento 3D fantástico do meu rosto e projetou as lentes perfeitas. Fiquei impressionado com o naturalismo artístico das lentes!'
  },
  {
    id: 't4',
    name: 'Camila Fernandes',
    age: 32,
    city: 'Santo André',
    rating: 5,
    treatmentName: 'Odontopediatria sem Traumas',
    treatmentId: 'odontopediatria',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    text: 'Meu filho de 5 anos tinha pavor de dentista por conta de uma experiência anterior ruim. Na clínica Sorriso e Saúde, a recepção foi tão receptiva e mágica que ele se sentiu em um parquinho. O atendimento é extremamente carinhoso e descontraído.'
  }
];

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: 'Qual é a sua principal insatisfação ou necessidade hoje?',
    options: [
      { text: 'Meus dentes estão tortos ou encavalados', value: 'ortodontia', resultTreatment: 'Ortodontia/Invisalign' },
      { text: 'Tenho dentes ausentes ou falhas que dificultam a mastigação', value: 'implantes', resultTreatment: 'Implantes Dentários Avançados' },
      { text: 'Gostaria de mudar a cor, formato ou harmonia dos dentes', value: 'estetica', resultTreatment: 'Lentes de Contato e Facetas' },
      { text: 'Estou sentindo dor, sensibilidade ou preciso de limpeza/canal', value: 'clinico', resultTreatment: 'Canal, Limpeza ou Consulta de Emergência' }
    ]
  },
  {
    id: 2,
    question: 'Qual o principal fator de decisão para o seu tratamento?',
    options: [
      { text: 'Discrição absoluta e estética (não aparecer metais)', value: 'estetica_foco', resultTreatment: 'Alinhadores Invisíveis ou Lentes de Porcelana' },
      { text: 'Rapidez e eficiência do procedimento', value: 'rapidez', resultTreatment: 'Tratamentos Planejados em Fluxo Digital' },
      { text: 'Ausência total de dor e máximo conforto', value: 'conforto', resultTreatment: 'Cirurgias e Procedimentos com Anestesia Computadorizada' },
      { text: 'Durabilidade longa e materiais premium', value: 'durabilidade', resultTreatment: 'Tratamentos de Reabilitação Oral de Longa Vida' }
    ]
  },
  {
    id: 3,
    question: 'Como você prefere realizar seu agendamento ou avaliação?',
    options: [
      { text: 'Gostaria de agendar online direto pelo site agora mesmo', value: 'booking_direto', resultTreatment: 'Agendamento Direto Facilitado' },
      { text: 'Prefiro falar com uma atendente pelo WhatsApp para tirar dúvidas', value: 'whatsapp', resultTreatment: 'Suporte Personalizado via WhatsApp' },
      { text: 'Quero receber uma ligação de volta do dentista', value: 'call', resultTreatment: 'Ligação e Triagem Telefônica com Especialista' }
    ]
  }
];

export const faqs = [
  {
    question: 'A clínica aceita planos de saúde ou convênios?',
    answer: 'Nós atendemos de forma particular e fornecemos toda a documentação, radiografias e relatórios necessários para que você solicite o reembolso imediato junto ao seu convênio. Pacientes costumam reaver de 50% a 100% do valor gasto dependendo da apólice!'
  },
  {
    question: 'Como funciona a primeira consulta de avaliação?',
    answer: 'Nossa primeira consulta é extremamente completa. No mesmo dia nós realizamos fotografias de alta resolução do seu rosto e dentes, mapeamento odontológico completo e um scanner intraoral 3D se aplicável à sua especialidade. O dentista conversa com você para entender seus objetivos, histórico médico e monta seu plano de tratamento personalizado.'
  },
  {
    question: 'O procedimento de implante dentário dói?',
    answer: 'Absolutamente não. A cirurgia de implantes é realizada sob anestesia local moderna, sendo totalmente indolor durante o procedimento. Além disso, utilizamos microcirurgia guiada por computador, o que significa que o dentista sabe onde furar sem precisar cortar as gengivas inteiras com bisturi. O pós-operatório é excelente e controlado por analgésicos comuns.'
  },
  {
    question: 'Quais são as opções e facilidades de pagamento?',
    answer: 'Trabalhamos com diversas modalidades facilitadas para que você possa investir no seu sorriso: parcelamento em até 12x sem juros em cartões de crédito, condições especiais no boleto bancário (sujeito à análise), descontos atrativos para pagamento à vista no Pix, e até mesmo financiamentos odontológicos de médio prazo.'
  },
  {
    question: 'Como funciona o Invisalign? Ele realmente é igual ao aparelho metálico?',
    answer: 'O Invisalign alinha seus dentes através de uma série de placas de polímero transparentes, confortáveis e removíveis. Graças à tecnologia do mapeamento 3D SmartTrack, cada placa exerce uma força precisa e suave para mover os dentes de forma muito mais rápida (até 2x mais ágil) e sem a dor de quebrar dentes com fios soltos. É uma evolução imensa sobre os aparelhos metálicos tradicionais.'
  }
];
