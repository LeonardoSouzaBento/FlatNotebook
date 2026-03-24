import { Document } from "@/types/document";

export const sampleDocument: Document = {
  id: "doc_001",
  title: "Curso de UI Design",
  subtitle: "Um guia rápido, mas completo",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  blocks: [
    {
      id: "cap1",
      level: 3,
      title: "Tipografia",
      content: [],
      collapsed: false,
      children: [
        {
          id: "sec1_1",
          level: 4,
          title: "Nosso objetivo: variáveis CSS e escala tipográfica",
          content: [
            "Devemos aplicar uma escala tipográfica por meio do uso de variáveis, como estas a seguir, para tamanhos de fonte adequados para as tags. A tipografia, afinal, ocupa quase metade ou a maior parte do espaço em uma aplicação, tanto que outros padrões, cores, margens e espaçamentos, por exemplo, também precisam ser aplicados na tipografia.",
          ],
          collapsed: false,
          children: [],
        },
        {
          id: "sec1_2",
          level: 4,
          title: "Corpo",
          content: [
            `O corpo é o texto corrido. Definimos os tamanhos de fonte na tag body porque ela passa os tamanhos para todas as tags textuais, por herança.

[imagem do trecho do body]`,
          ],
          collapsed: false,
          children: [
            {
              id: "subsec1_2_1",
              level: 5,
              title: "Tamanho exato da fonte",
              content: [
                `O tamanho exato da fonte varia, pois elas ocupam diferentes medidas da caixa de contenção. É à altura desta caixa que a medida font-size se refere. Podemos vê-la pelo devTools usando o texto “Good Type” pelo inspecionar elementos.

[comparação das fontes próxima nova e futura]
[texto “Good Type”  inspensionado pelo devTools]`,
              ],
              collapsed: false,
              children: [],
            },
            {
              id: "subsec1_2_2",
              level: 5,
              title: "Tamanho inicial",
              content: [
                `[imagem do trecho do código]

O tamanho inicial padrão do corpo é 16px, mas geralmente devemos ajustar para 17px. E se quisermos ter boa experiência de leitura, ajustamos para entre 18 e 21px, conforme cada fonte e propósito. Essa é a primeira preocupação de qualquer interface, o tamanho base do corpo, do texto corrido.`,
              ],
              collapsed: false,
              children: [],
            },
          ],
        },
      ],
    },
    {
      id: "cap2",
      level: 3,
      title: "Botões",
      content: ["Deus prometeu um Salvador."],
      collapsed: true,
      children: [
        {
          id: "sec2_1",
          level: 4,
          title: "A promessa em Gênesis",
          content: ["A primeira promessa messiânica aparece em Gênesis 3:15."],
          collapsed: false,
          children: [],
        },
      ],
    },
    {
      id: "cap3",
      level: 3,
      title: "Raios de borda e preenchimentos",
      content: ["Deus prometeu um Salvador."],
      collapsed: true,
      children: [
        {
          id: "sec3_1",
          level: 4,
          title: "A promessa em Gênesis",
          content: ["A primeira promessa messiânica aparece em Gênesis 3:15."],
          collapsed: false,
          children: [],
        },
      ],
    },
    {
      id: "cap4",
      level: 3,
      title: "Sombras",
      content: ["Deus prometeu um Salvador."],
      collapsed: true,
      children: [
        {
          id: "sec4_1",
          level: 4,
          title: "A promessa em Gênesis",
          content: ["A primeira promessa messiânica aparece em Gênesis 3:15."],
          collapsed: false,
          children: [],
        },
      ],
    },
    {
      id: "cap5",
      level: 3,
      title: "Inspiração",
      content: ["Deus prometeu um Salvador."],
      collapsed: true,
      children: [],
    },
  ],
};

/*
content: [
  "Texto normal",
  "**texto negrito**",
  "*texto itálico*",
  "__texto sublinhado__",
  "!img[id_da_imagem]",
  "[link](https://google.com)",
  "[big] texto [/big]",
  "[small] texto [/small]",
  "[code] texto [/code]",
  "[quote] texto [/quote]",
]
*/
