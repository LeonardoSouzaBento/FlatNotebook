import { Document } from "@/types/document";
import exampleFallImage from "@/assets/example-fall.jpg";

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
      content: `Este capítulo apresenta o propósito do estudo.`,
      collapsed: false,
      children: [],
    },
    {
      id: "cap2",
      level: 3,
      title: "Cores",
      content: "Descrição geral da queda do homem.",
      collapsed: false,
      children: [
        {
          id: "sec2_1",
          level: 4,
          title: "O pecado de Adão",
          content: "Adão desobedeceu ao mandamento divino.",
          collapsed: false,
          children: [],
        },
        {
          id: "sec2_2",
          level: 4,
          title: "Consequências da queda",
          content: "A queda trouxe sofrimento e morte.",
          collapsed: false,
          children: [
            {
              id: "subsec2_2_1",
              level: 5,
              title: "Separação de Deus",
              content: "A comunhão com Deus foi quebrada.",
              collapsed: false,
              children: [],
            },
            {
              id: "subsec2_2_2",
              level: 5,
              title: "Corrupção da natureza humana",
              content: "A natureza humana passou a ser inclinada ao pecado.",
              collapsed: false,
              children: [],
            },
          ],
        },
      ],
    },
    {
      id: "cap3",
      level: 3,
      title: "A Promessa de Redenção",
      content: "Deus prometeu um Salvador.",
      collapsed: true,
      children: [
        {
          id: "sec3_1",
          level: 4,
          title: "A promessa em Gênesis",
          content: "A primeira promessa messiânica aparece em Gênesis 3:15.",
          collapsed: false,
          children: [],
        },
      ],
    },
  ],
};

/*
      images: [
        {
          id: "img_001",
          src: exampleFallImage,
          alt: "A Queda do Homem - Adão e Eva no Jardim do Éden",
          edits: {},
        },
      ],
*/
