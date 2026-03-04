// Todos os 39 pontos turísticos oficiais de Aracaju baseados no documento da Prefeitura
// "Mapeamento dos Atrativos Turísticos para Instalação dos QR Codes em Aracaju, SE - 2025"

export const aracajuOfficialSpotsComplete = [
  // 1. Cemitério dos Náufragos
  {
    name_pt: "Cemitério dos Náufragos",
    description_pt: "Entre 15 e 16 de agosto de 1942, três navios foram bombardeados pelo submarino alemão U-507. Em virtude desse atentado, centenas de pessoas foram mortas e os corpos chegaram às praias de Aracaju, sendo enterrados no que posteriormente ficaria conhecido como Cemitério dos Náufragos.",
    name_en: "Shipwreck Cemetery",
    description_en: "Between August 15 and 16, 1942, three ships were bombed by the German submarine U-507. As a result of this attack, hundreds of people were killed and the bodies arrived at the beaches of Aracaju, being buried in what would later become known as the Shipwreck Cemetery.",
    name_es: "Cementerio de los Náufragos",
    description_es: "Entre el 15 y 16 de agosto de 1942, tres barcos fueron bombardeados por el submarino alemán U-507. Como resultado de este ataque, cientos de personas murieron y los cuerpos llegaron a las playas de Aracaju, siendo enterrados en lo que posteriormente se conocería como Cementerio de los Náufragos.",
    category: "historico",
    latitude: "-10.9472",
    longitude: "-37.0731",
    address: "Rodovia dos Náufragos, Aracaju",
    images: [],
    googleMapsLink: "https://maps.google.com/?q=-10.9472,-37.0731",
    features: {
      tombamento: "Decreto nº 2.571, de 20 de junho de 1973",
      tipo: "Arquitetura funerária, século XX"
    }
  },

  // 2. Palmeiras Imperiais
  {
    name_pt: "Palmeiras Imperiais",
    description_pt: "As palmeiras imperiais plantadas no eixo definido pelo percurso entre a Ponte do Imperador e a Catedral foi uma homenagem à visita do Imperador Dom Pedro II à capital Sergipana, no início da segunda metade do século XIX.",
    name_en: "Imperial Palm Trees",
    description_en: "The imperial palm trees planted along the axis between the Emperor's Bridge and the Cathedral were a tribute to Emperor Dom Pedro II's visit to the capital of Sergipe in the early second half of the 19th century.",
    name_es: "Palmeras Imperiales",
    description_es: "Las palmeras imperiales plantadas en el eje definido por el recorrido entre el Puente del Emperador y la Catedral fueron un homenaje a la visita del Emperador Dom Pedro II a la capital sergipana, a principios de la segunda mitad del siglo XIX.",
    category: "historico",
    latitude: "-10.9101",
    longitude: "-37.0717",
    address: "Praça Almirante Barroso – Centro Histórico de Aracaju",
    images: [],
    googleMapsLink: "https://maps.google.com/?q=-10.9101,-37.0717",
    features: {
      tombamento: "Decreto nº 4.450, de 14 de setembro de 1979",
      tipo: "Conjunto tombado de acordo com o Código Florestal"
    }
  },

  // 3. Centro de Cultura e Arte (CULTART)
  {
    name_pt: "Centro de Cultura e Arte (CULTART)",
    description_pt: "O prédio foi inaugurado em 1917, em estilo arquitetônico eclético. Abrigou o Grupo Escolar Barão de Maruim, depois a Faculdade de Direito, e desde 1980 sedia o Centro de Cultura e Arte da UFS, com a Pinacoteca professor Luiz Alberto dos Santos e a Galeria de Arte Florival Santos.",
    name_en: "Culture and Arts Center (CULTART)",
    description_en: "The building was inaugurated in 1917, in eclectic architectural style. It housed the Barão de Maruim School Group, then the Law School, and since 1980 has been home to the UFS Culture and Arts Center, with the Professor Luiz Alberto dos Santos Pinacoteca and the Florival Santos Art Gallery.",
    name_es: "Centro de Cultura y Arte (CULTART)",
    description_es: "El edificio fue inaugurado en 1917, en estilo arquitectónico ecléctico. Albergó el Grupo Escolar Barão de Maruim, después la Facultad de Derecho, y desde 1980 sede el Centro de Cultura y Arte de la UFS, con la Pinacoteca profesor Luiz Alberto dos Santos y la Galería de Arte Florival Santos.",
    category: "cultura",
    latitude: "-10.9097",
    longitude: "-37.0719",
    address: "Av. Ivo do Prado, n° 612 - Aracaju",
    images: [],
    googleMapsLink: "https://maps.google.com/?q=-10.9097,-37.0719",
    features: {
      tombamento: "Decreto nº 4989, de 23 de abril de 1981",
      tipo: "Arquitetura institucional, primeira metade do século XX",
      propriedade: "Universidade Federal de Sergipe"
    }
  },

  // 4. Centro de Turismo e Comercialização Artesanal
  {
    name_pt: "Centro de Turismo e Comercialização Artesanal",
    description_pt: "Localizado próximo à Catedral de Aracaju, o prédio foi inaugurado em 1911 para funcionar a Escola Normal para moças. Em 1976, foi restaurado e inaugurado o Centro de Turismo. Abriga salas para comercialização do artesanato sergipano, sobretudo o de rendas.",
    name_en: "Tourism and Handicraft Trading Center",
    description_en: "Located near the Cathedral of Aracaju, the building was inaugurated in 1911 to house the Normal School for girls. In 1976, it was restored and the Tourism Center was inaugurated. It houses rooms for the commercialization of Sergipe handicrafts, especially lace.",
    name_es: "Centro de Turismo y Comercialización Artesanal",
    description_es: "Ubicado cerca de la Catedral de Aracaju, el edificio fue inaugurado en 1911 para funcionar como Escuela Normal para niñas. En 1976, fue restaurado e inaugurado el Centro de Turismo. Alberga salas para la comercialización de artesanías sergipanas, especialmente encajes.",
    category: "cultura",
    latitude: "-10.9098",
    longitude: "-37.0717",
    address: "Praça Olímpio Campos - Aracaju",
    images: [],
    googleMapsLink: "https://maps.google.com/?q=-10.9098,-37.0717",
    features: {
      tombamento: "Decreto nº 6.129, de 06 de janeiro de 1984",
      tipo: "Arquitetura civil urbana de caráter institucional, primeira metade do século XX"
    }
  },

  // 5. Palácio Museu Olímpio Campos
  {
    name_pt: "Palácio Museu Olímpio Campos",
    description_pt: "O antigo Palácio do Governo foi inaugurado em 1863, funcionou como sede do governo do estado até 1995, sendo reaberto ao público como palácio-museu em 2010. Abriga rico acervo da história dos governantes e da política imperial e republicana em Sergipe.",
    name_en: "Olimpio Campos Palace Museum",
    description_en: "The former Government Palace was inaugurated in 1863, served as the state government headquarters until 1995, and was reopened to the public as a palace-museum in 2010. It houses a rich collection of the history of rulers and imperial and republican politics in Sergipe.",
    name_es: "Palacio Museo Olimpio Campos",
    description_es: "El antiguo Palacio de Gobierno fue inaugurado en 1863, funcionó como sede del gobierno del estado hasta 1995, siendo reabierto al público como palacio-museo en 2010. Alberga una rica colección de la historia de los gobernantes y de la política imperial y republicana en Sergipe.",
    category: "historico",
    latitude: "-10.9100",
    longitude: "-37.0716",
    address: "Praça Fausto Cardoso s/nº - Aracaju",
    images: [],
    googleMapsLink: "https://maps.google.com/?q=-10.9100,-37.0716",
    features: {
      tombamento: "Decreto nº 6.818, de 28 de janeiro de 1985",
      tipo: "Arquitetura civil urbana de caráter institucional",
      periodo: "Segunda metade do século XIX, reformado no início do século XX"
    }
  },

  // 6. Catedral Metropolitana de Aracaju
  {
    name_pt: "Catedral Metropolitana de Aracaju",
    description_pt: "A Catedral de Aracaju, ou Igreja Matriz de Nossa Senhora da Conceição, foi construída em 1862 e inaugurada em 1875. Tornou-se Catedral em 1910 e foi elevada à Sede de Metrópole em 1960. Em 1946 foi reinaugurada em estilo neogótico.",
    name_en: "Metropolitan Cathedral of Aracaju",
    description_en: "The Cathedral of Aracaju, or Mother Church of Nossa Senhora da Conceição, was built in 1862 and inaugurated in 1875. It became a Cathedral in 1910 and was elevated to Metropolitan Seat in 1960. In 1946 it was reopened in neo-Gothic style.",
    name_es: "Catedral Metropolitana de Aracaju",
    description_es: "La Catedral de Aracaju, o Iglesia Matriz de Nossa Senhora da Conceição, fue construida en 1862 e inaugurada en 1875. Se convirtió en Catedral en 1910 y fue elevada a Sede Metropolitana en 1960. En 1946 fue reinaugurada en estilo neogótico.",
    category: "historico",
    latitude: "-10.9099",
    longitude: "-37.0717",
    address: "Praça Olímpio Campos s/nº - Aracaju",
    images: [],
    googleMapsLink: "https://maps.google.com/?q=-10.9099,-37.0717",
    features: {
      tombamento: "Decreto nº 6.819, de 28 de janeiro de 1985",
      tipo: "Arquitetura religiosa da segunda metade do século XIX"
    }
  },

  // 7. Museu da Gente Sergipana
  {
    name_pt: "Museu da Gente Sergipana",
    description_pt: "Inaugurado em 1926, abrigou o Atheneu Pedro II. Desde 2011 funciona o Museu da Gente Sergipana, que possui vários espaços cujo acervo apresenta parcela significativa do patrimônio cultural material e imaterial de Sergipe, através de instalações interativas e exposições itinerantes.",
    name_en: "Sergipe People Museum",
    description_en: "Inaugurated in 1926, it housed the Atheneu Pedro II. Since 2011, the Sergipe People Museum has been operating, which has several spaces whose collection presents a significant portion of Sergipe's material and immaterial cultural heritage, through interactive installations and traveling exhibitions.",
    name_es: "Museo de la Gente Sergipana",
    description_es: "Inaugurado en 1926, albergó el Atheneu Pedro II. Desde 2011 funciona el Museo de la Gente Sergipana, que posee varios espacios cuyo acervo presenta una porción significativa del patrimonio cultural material e inmaterial de Sergipe, a través de instalaciones interactivas y exposiciones itinerantes.",
    category: "cultura",
    latitude: "-10.9096",
    longitude: "-37.0718",
    address: "Av. Ivo do Prado, nº 398 - Aracaju",
    images: [],
    googleMapsLink: "https://maps.google.com/?q=-10.9096,-37.0718",
    features: {
      tombamento: "Decreto nº 6.820, de 28 de janeiro de 1985",
      tipo: "Arquitetura civil urbana de caráter institucional, primeira metade do século XX"
    }
  },

  // 8. Memorial do Legislativo
  {
    name_pt: "Memorial do Legislativo",
    description_pt: "Um dos mais importantes monumentos ligado à história política sergipana. A construção iniciou em 1868, abrigou a Assembleia Provincial. Atualmente abriga a Escola do Legislativo e o Memorial do Legislativo. É uma construção da segunda metade do século XIX.",
    name_en: "Legislative Memorial",
    description_en: "One of the most important monuments linked to Sergipe's political history. Construction began in 1868, it housed the Provincial Assembly. Currently houses the Legislative School and the Legislative Memorial. It is a construction from the second half of the 19th century.",
    name_es: "Memorial del Legislativo",
    description_es: "Uno de los monumentos más importantes vinculados a la historia política sergipana. La construcción comenzó en 1868, albergó la Asamblea Provincial. Actualmente alberga la Escuela del Legislativo y el Memorial del Legislativo. Es una construcción de la segunda mitad del siglo XIX.",
    category: "historico",
    latitude: "-10.9101",
    longitude: "-37.0715",
    address: "Praça Fausto Cardoso s/nº - Aracaju",
    images: [],
    googleMapsLink: "https://maps.google.com/?q=-10.9101,-37.0715",
    features: {
      tombamento: "Decreto nº 8.313, de 18 de fevereiro de 1987",
      tipo: "Arquitetura civil urbana de caráter institucional"
    }
  },

  // 9. Prédio da Secretaria de Estado da Segurança Pública
  {
    name_pt: "Prédio da Secretaria de Estado da Segurança Pública (Antigo Grupo Escolar General Valadão)",
    description_pt: "Foi edificada para fins educacionais. Sua inauguração é datada em 01 de setembro de 1918 para abrigar o 'Grupo Escolar General Valadão'. Em 1924, passou a abrigar a Faculdade Livre de Direito Tobias Barreto. Atualmente o edifício abriga a Secretaria de Estado da Segurança Pública.",
    name_en: "State Public Security Secretariat Building (Former General Valadão School Group)",
    description_en: "It was built for educational purposes. Its inauguration is dated September 1, 1918 to house the 'General Valadão School Group'. In 1924, it began to house the Tobias Barreto Free Law School. Currently the building houses the State Public Security Secretariat.",
    name_es: "Edificio de la Secretaría de Seguridad Pública del Estado (Antiguo Grupo Escolar General Valadão)",
    description_es: "Fue edificado para fines educativos. Su inauguración data del 1 de septiembre de 1918 para albergar el 'Grupo Escolar General Valadão'. En 1924, pasó a albergar la Facultad Libre de Derecho Tobias Barreto. Actualmente el edificio alberga la Secretaría de Seguridad Pública del Estado.",
    category: "historico",
    latitude: "-10.9045",
    longitude: "-37.0598",
    address: "Praça Tobias Barreto, nº 20 - Aracaju",
    images: [],
    googleMapsLink: "https://maps.google.com/?q=-10.9045,-37.0598",
    features: {
      tombamento: "Decreto nº 6.821, de 28 de janeiro de 1985",
      tipo: "Arquitetura civil urbana de caráter institucional, início do século XX"
    }
  },

  // 10. Imóveis situados na Av. Otoniel Dória
  {
    name_pt: "Imóveis situados na Av. Otoniel Dória (500, 506, 511, 520, 524 e 534)",
    description_pt: "O conjunto arquitetônico foi edificado nas primeiras décadas do século passado, para fins comerciais. Imóveis de arquitetura civil urbana da primeira metade do século XX, próximo ao mercado municipal de Aracaju que possuem características do estilo eclético.",
    name_en: "Buildings located on Otoniel Dória Avenue (500, 506, 511, 520, 524 and 534)",
    description_en: "The architectural ensemble was built in the first decades of the last century, for commercial purposes. Urban civil architecture buildings from the first half of the 20th century, near the municipal market of Aracaju that have characteristics of the eclectic style.",
    name_es: "Inmuebles situados en la Av. Otoniel Dória (500, 506, 511, 520, 524 y 534)",
    description_es: "El conjunto arquitectónico fue edificado en las primeras décadas del siglo pasado, para fines comerciales. Inmuebles de arquitectura civil urbana de la primera mitad del siglo XX, cerca del mercado municipal de Aracaju que poseen características del estilo ecléctico.",
    category: "historico",
    latitude: "-10.9150",
    longitude: "-37.0567",
    address: "Av. Otoniel Dória, 500-534 - Aracaju",
    images: [],
    googleMapsLink: "https://maps.google.com/?q=-10.9150,-37.0567",
    features: {
      tombamento: "Decreto nº 8.314, de 18 de fevereiro de 1987",
      tipo: "Arquitetura civil urbana da primeira metade do século XX"
    }
  },

  // 11. Painéis e Murais do Artista Plástico Jenner Augusto
  {
    name_pt: "Painéis e Murais do Artista Plástico Jenner Augusto",
    description_pt: "Seu grande mural em azulejos, medindo 3m de altura por 4m de largura, foi pintado em 1957, e ainda está exposto na parede do edifício Walter Franco. O Mural está exposto em via pública, e nele estão representados produtos agrícolas que marcaram a economia sergipana, tais como: o pescado, o coco, o caju, a cana e o milho.",
    name_en: "Panels and Murals by Plastic Artist Jenner Augusto",
    description_en: "His large tile mural, measuring 3m high by 4m wide, was painted in 1957, and is still displayed on the wall of the Walter Franco building. The Mural is displayed on public roads, and represents agricultural products that marked the Sergipe economy, such as: fish, coconut, cashew, sugarcane and corn.",
    name_es: "Paneles y Murales del Artista Plástico Jenner Augusto",
    description_es: "Su gran mural en azulejos, de 3m de altura por 4m de ancho, fue pintado en 1957, y aún está expuesto en la pared del edificio Walter Franco. El Mural está expuesto en vía pública, y en él están representados productos agrícolas que marcaron la economía sergipana, tales como: el pescado, el coco, el anacardo, la caña y el maíz.",
    category: "cultura",
    latitude: "-10.9087",
    longitude: "-37.0703",
    address: "Edifício Walter Franco - Aracaju",
    images: [],
    googleMapsLink: "https://maps.google.com/?q=-10.9087,-37.0703",
    features: {
      tombamento: "Decreto nº 9.990, de 26 de outubro de 1988",
      tipo: "Produção artística do século XX"
    }
  },

  // 12. Prédio do Antigo Tribunal de Justiça (Palácio Silvio Romero)
  {
    name_pt: "Prédio do Antigo Tribunal de Justiça (Palácio Silvio Romero)",
    description_pt: "O Edifício que abriga o Memorial do Poder Judiciário de Sergipe antigamente foi sede do Tribunal de Relação, primeiro órgão judiciário de Sergipe. Foi criado na gestão do Presidente José Calazans em 1890 e inaugurado pelo Presidente Oliveira Valadão em 1894. Atualmente é chamado de Palácio Silvio Romero.",
    name_en: "Former Court of Justice Building (Silvio Romero Palace)",
    description_en: "The building that houses the Memorial of the Judiciary of Sergipe was formerly the seat of the Court of Appeals, the first judicial body of Sergipe. It was created during the administration of President José Calazans in 1890 and inaugurated by President Oliveira Valadão in 1894. It is currently called Silvio Romero Palace.",
    name_es: "Edificio del Antiguo Tribunal de Justicia (Palacio Silvio Romero)",
    description_es: "El edificio que alberga el Memorial del Poder Judicial de Sergipe antiguamente fue sede del Tribunal de Relación, primer órgano judicial de Sergipe. Fue creado en la gestión del Presidente José Calazans en 1890 e inaugurado por el Presidente Oliveira Valadão en 1894. Actualmente se llama Palacio Silvio Romero.",
    category: "historico",
    latitude: "-10.9099",
    longitude: "-37.0716",
    address: "Praça Olímpio Campos, nº 14 - Aracaju",
    images: [],
    googleMapsLink: "https://maps.google.com/?q=-10.9099,-37.0716",
    features: {
      tombamento: "Decreto nº 9.991, de 26 de outubro de 1988",
      tipo: "Arquitetura civil urbana de caráter institucional, início do século XX"
    }
  },

  // 13. Prédio da OAB (Av. Ivo do Prado, nº 1.072)
  {
    name_pt: "Prédio da OAB (Av. Ivo do Prado, nº 1.072)",
    description_pt: "O edifício começou a ser construído em 1917, na época de Faro Rollemberg e Amélia Rollemberg. Projetado por Adolfo Rollemberg, seu estilo segue as técnicas tradicionais da arquitetura eclética e do Art Nouveau. O monumento é uma das referências mais importantes da paisagem urbana de Aracaju. No ano de 2007 foi restaurado e hoje abriga a Sede da OAB (SE).",
    name_en: "OAB Building (Ivo do Prado Avenue, nº 1.072)",
    description_en: "The building began to be built in 1917, at the time of Faro Rollemberg and Amélia Rollemberg. Designed by Adolfo Rollemberg, its style follows the traditional techniques of eclectic architecture and Art Nouveau. The monument is one of the most important references in Aracaju's urban landscape. In 2007 it was restored and today houses the OAB (SE) Headquarters.",
    name_es: "Edificio de la OAB (Av. Ivo do Prado, nº 1.072)",
    description_es: "El edificio comenzó a construirse en 1917, en la época de Faro Rollemberg y Amélia Rollemberg. Diseñado por Adolfo Rollemberg, su estilo sigue las técnicas tradicionales de la arquitectura ecléctica y del Art Nouveau. El monumento es una de las referencias más importantes del paisaje urbano de Aracaju. En 2007 fue restaurado y hoy alberga la Sede de la OAB (SE).",
    category: "historico",
    latitude: "-10.9070",
    longitude: "-37.0735",
    address: "Av. Ivo do Prado, nº 1.072 - Aracaju",
    images: [],
    googleMapsLink: "https://maps.google.com/?q=-10.9070,-37.0735",
    features: {
      tombamento: "Decreto nº 11.118, de 07 de dezembro de 1989",
      tipo: "Arquitetura civil residencial urbana do início do século XX"
    }
  },

  // 14. Prédio do Palácio Carvalho Neto (Arquivo Público Estadual)
  {
    name_pt: "Prédio do Palácio Carvalho Neto (Arquivo Público Estadual)",
    description_pt: "O prédio denominado de Palácio Carvalho Neto foi edificado em 1936, com o intuito de abrigar a Biblioteca Pública do Estado. A partir de 1974, passou a ser sede do Arquivo Público Estadual. A construção segue o estilo da Art Décor. Um monumento ligado à história educacional e cultural de Sergipe.",
    name_en: "Carvalho Neto Palace Building (State Public Archive)",
    description_en: "The building called Carvalho Neto Palace was built in 1936, with the purpose of housing the State Public Library. From 1974, it became the headquarters of the State Public Archive. The construction follows the Art Deco style. A monument linked to the educational and cultural history of Sergipe.",
    name_es: "Edificio del Palacio Carvalho Neto (Archivo Público Estatal)",
    description_es: "El edificio denominado Palacio Carvalho Neto fue edificado en 1936, con el propósito de albergar la Biblioteca Pública del Estado. A partir de 1974, pasó a ser sede del Archivo Público Estatal. La construcción sigue el estilo Art Déco. Un monumento vinculado a la historia educativa y cultural de Sergipe.",
    category: "cultura",
    latitude: "-10.9102",
    longitude: "-37.0714",
    address: "Praça Fausto Cardoso, nº 348 - Aracaju",
    images: [],
    googleMapsLink: "https://maps.google.com/?q=-10.9102,-37.0714",
    features: {
      tombamento: "Decreto nº 12.038, de 22 de janeiro de 1991",
      tipo: "Arquitetura civil urbana de caráter institucional, primeira metade do século XX"
    }
  },

  // 15. Prédio do Antigo Tesouro do Estado (Câmara Municipal)
  {
    name_pt: "Prédio do Antigo Tesouro do Estado (Câmara Municipal)",
    description_pt: "Edifício inaugurado em 1872, como sede do colégio Atheneu Sergipense. Em 1913/14 ocorreu uma grande reforma e ampliação. Outra reforma, na década de 1930, alterou significadamente a fachada do edifício, que a partir de então abrigou a Diretoria do Tesouro do Estado e, atualmente, a Câmara Municipal.",
    name_en: "Former State Treasury Building (City Council)",
    description_en: "Building inaugurated in 1872, as headquarters of the Atheneu Sergipense college. In 1913/14 there was a major renovation and expansion. Another renovation, in the 1930s, significantly altered the building's facade, which from then on housed the State Treasury Directorate and, currently, the City Council.",
    name_es: "Edificio del Antiguo Tesoro del Estado (Cámara Municipal)",
    description_es: "Edificio inaugurado en 1872, como sede del colegio Atheneu Sergipense. En 1913/14 ocurrió una gran reforma y ampliación. Otra reforma, en la década de 1930, alteró significativamente la fachada del edificio, que a partir de entonces albergó la Dirección del Tesoro del Estado y, actualmente, la Cámara Municipal.",
    category: "historico",
    latitude: "-10.9098",
    longitude: "-37.0715",
    address: "Praça Olímpio Campos, nº 74 - Aracaju",
    images: [],
    googleMapsLink: "https://maps.google.com/?q=-10.9098,-37.0715",
    features: {
      tombamento: "Decreto nº 12.039, de 22 de janeiro de 1991",
      tipo: "Arquitetura civil urbana de caráter institucional, segunda metade do século XIX"
    }
  },

  // 16. Antigo Farol de Aracaju
  {
    name_pt: "Antigo Farol de Aracaju",
    description_pt: "O antigo farol foi construído a pedido do então presidente da Província de Sergipe, Inácio Barbosa, no ano de 1861, tendo como base uma estrutura de madeira pintada na cor preta. Um incêndio determinou que um novo farol fosse erguido com estrutura de ferro adquirido na Inglaterra. No ano de 2009 o Farol foi restaurado.",
    name_en: "Old Lighthouse of Aracaju",
    description_en: "The old lighthouse was built at the request of the then president of the Province of Sergipe, Inácio Barbosa, in 1861, based on a wooden structure painted black. A fire determined that a new lighthouse should be erected with an iron structure acquired in England. In 2009 the Lighthouse was restored.",
    name_es: "Antiguo Faro de Aracaju",
    description_es: "El antiguo faro fue construido a pedido del entonces presidente de la Provincia de Sergipe, Inácio Barbosa, en el año 1861, teniendo como base una estructura de madera pintada de color negro. Un incendio determinó que se erigiera un nuevo faro con estructura de hierro adquirida en Inglaterra. En 2009 el Faro fue restaurado.",
    category: "historico",
    latitude: "-10.9650",
    longitude: "-37.0520",
    address: "Rodovia Paulo Barreto de Menezes, Conjunto Augusto Franco - Aracaju",
    images: [],
    googleMapsLink: "https://maps.google.com/?q=-10.9650,-37.0520",
    features: {
      tombamento: "Decreto nº 15.295, de 21 de abril de 1995",
      tipo: "Estrutura implantada pelo Ministério da Marinha na segunda metade do século XIX"
    }
  },

  // 17. Prédio da Delegacia do Ministério da Fazenda
  {
    name_pt: "Prédio da Delegacia do Ministério da Fazenda (Primeiro Palácio da Província)",
    description_pt: "O prédio público onde atualmente funciona a Superintendência de Administração do Ministério da Fazenda em Sergipe já abrigou diversas administrações públicas, dentre elas o Palacete da Presidência da Província e a residência oficial do Imperador D. Pedro II, em sua visita ao Estado. É um dos primeiros edifícios públicos construídos em Aracaju, após a mudança da capital.",
    name_en: "Ministry of Finance Delegation Building (First Palace of the Province)",
    description_en: "The public building where the Ministry of Finance Administration Superintendency in Sergipe currently operates has housed various public administrations, including the Palace of the Presidency of the Province and the official residence of Emperor D. Pedro II, during his visit to the State. It is one of the first public buildings built in Aracaju, after the capital was moved.",
    name_es: "Edificio de la Delegación del Ministerio de Hacienda (Primer Palacio de la Provincia)",
    description_es: "El edificio público donde actualmente funciona la Superintendencia de Administración del Ministerio de Hacienda en Sergipe ya albergó diversas administraciones públicas, entre ellas el Palacete de la Presidencia de la Provincia y la residencia oficial del Emperador D. Pedro II, en su visita al Estado. Es uno de los primeros edificios públicos construidos en Aracaju, después del cambio de la capital.",
    category: "historico",
    latitude: "-10.9103",
    longitude: "-37.0713",
    address: "Praça Fausto Cardoso, nº 272 - Aracaju",
    images: [],
    googleMapsLink: "https://maps.google.com/?q=-10.9103,-37.0713",
    features: {
      tombamento: "Decreto nº 15.989, de 24 de julho de 1996",
      tipo: "Arquitetura civil urbana de caráter institucional, segunda metade do século XIX"
    }
  },

  // 18. Prédio do Palácio Inácio Barbosa (Sede da Prefeitura)
  {
    name_pt: "Prédio do Palácio Inácio Barbosa (Sede da Prefeitura)",
    description_pt: "Antiga Sede da Prefeitura Municipal de Aracaju. O prédio foi construído na gestão do presidente do Estado, Dr. Mauricio Graccho Cardoso no início do século XX e o nome foi dado em homenagem ao fundador da capital. Monumento ligado a histórica política sergipana.",
    name_en: "Inácio Barbosa Palace Building (City Hall Headquarters)",
    description_en: "Former Headquarters of the Municipal Prefecture of Aracaju. The building was built during the administration of the state president, Dr. Mauricio Graccho Cardoso in the early 20th century and the name was given in honor of the founder of the capital. Monument linked to Sergipe's political history.",
    name_es: "Edificio del Palacio Inácio Barbosa (Sede de la Prefectura)",
    description_es: "Antigua Sede de la Prefectura Municipal de Aracaju. El edificio fue construido en la gestión del presidente del Estado, Dr. Mauricio Graccho Cardoso a principios del siglo XX y el nombre fue dado en homenaje al fundador de la capital. Monumento vinculado a la historia política sergipana.",
    category: "historico",
    latitude: "-10.9097",
    longitude: "-37.0716",
    address: "Praça Olímpio Campos s/nº - Aracaju",
    images: [],
    googleMapsLink: "https://maps.google.com/?q=-10.9097,-37.0716",
    features: {
      tombamento: "Decreto nº 16.559, de 26 de junho de 1997",
      tipo: "Arquitetura civil urbana de caráter institucional, início do século XX"
    }
  },

  // 19. Quartel Central da Polícia Militar
  {
    name_pt: "Quartel Central da Polícia Militar (Antigo Grupo Escolar General Siqueira)",
    description_pt: "Construído na gestão do General Manoel Prisciliano de Oliveira Valadão. Foi originalmente edificada para abrigar o Grupo Escolar Siqueira de Menezes. Durante as obras do Palácio Olímpio Campos abrigou os serviços administrativos da Presidência do Estado. Com a desativação do antigo Quartel da Força Pública, passou a sediar a Polícia Militar.",
    name_en: "Central Military Police Barracks (Former General Siqueira School Group)",
    description_en: "Built during the administration of General Manoel Prisciliano de Oliveira Valadão. It was originally built to house the Siqueira de Menezes School Group. During the construction of the Olímpio Campos Palace, it housed the administrative services of the State Presidency. With the deactivation of the old Public Force Barracks, it became the headquarters of the Military Police.",
    name_es: "Cuartel Central de la Policía Militar (Antiguo Grupo Escolar General Siqueira)",
    description_es: "Construido en la gestión del General Manoel Prisciliano de Oliveira Valadão. Fue originalmente edificado para albergar el Grupo Escolar Siqueira de Menezes. Durante las obras del Palacio Olímpio Campos albergó los servicios administrativos de la Presidencia del Estado. Con la desactivación del antiguo Cuartel de la Fuerza Pública, pasó a ser sede de la Policía Militar.",
    category: "historico",
    latitude: "-10.9025",
    longitude: "-37.0635",
    address: "Rua Itabaiana, nº 336 - Aracaju",
    images: [],
    googleMapsLink: "https://maps.google.com/?q=-10.9025,-37.0635",
    features: {
      tombamento: "Decreto nº 18.775, de 02 de maio de 2000",
      tipo: "Arquitetura civil urbana de caráter institucional, início do século XX"
    }
  },

  // 20. Prédio do Antigo Colégio Nossa Senhora de Lourdes
  {
    name_pt: "Prédio do Antigo Colégio Nossa Senhora de Lourdes",
    description_pt: "Monumento ligado à história religiosa e educacional do Estado de Sergipe. Foi construído para abrigar o Colégio das Irmãs Sacramentinas que marcou época entre os anos 50 e 70. Arquitetura civil urbana, propriedade dividida entre o Município de Aracaju (pavimento superior) e alguns lojistas (pavimento térreo).",
    name_en: "Former Nossa Senhora de Lourdes College Building",
    description_en: "Monument linked to the religious and educational history of the State of Sergipe. It was built to house the College of the Sacramentine Sisters that marked an era between the 50s and 70s. Urban civil architecture, property divided between the Municipality of Aracaju (upper floor) and some shopkeepers (ground floor).",
    name_es: "Edificio del Antiguo Colegio Nossa Senhora de Lourdes",
    description_es: "Monumento vinculado a la historia religiosa y educativa del Estado de Sergipe. Fue construido para albergar el Colegio de las Hermanas Sacramentinas que marcó época entre los años 50 y 70. Arquitectura civil urbana, propiedad dividida entre el Municipio de Aracaju (piso superior) y algunos comerciantes (planta baja).",
    category: "historico",
    latitude: "-10.9055",
    longitude: "-37.0670",
    address: "Rua José do Prado Franco - Aracaju",
    images: [],
    googleMapsLink: "https://maps.google.com/?q=-10.9055,-37.0670",
    features: {
      tombamento: "Decreto nº 20.953, de 03 de setembro de 2002",
      tipo: "Arquitetura civil urbana"
    }
  },

  // 21. Prédio da Antiga Alfândega de Aracaju
  {
    name_pt: "Prédio da Antiga Alfândega de Aracaju",
    description_pt: "A construção da antiga Alfândega constitui um dos passos iniciais da criação da cidade no movimento de mudança de capital para a cidade de Aracaju. O edifício abrigou também a Delegacia da Receita Federal de Sergipe, hoje se encontra restaurada e sob Administração da Prefeitura Municipal de Aracaju, onde funciona o Centro Cultural Cidade de Aracaju.",
    name_en: "Former Aracaju Customs Building",
    description_en: "The construction of the old Customs House constitutes one of the initial steps in the creation of the city in the movement to change the capital to the city of Aracaju. The building also housed the Federal Revenue Delegation of Sergipe, today it is restored and under the Administration of the Municipal Prefecture of Aracaju, where the Cultural Center City of Aracaju operates.",
    name_es: "Edificio de la Antigua Aduana de Aracaju",
    description_es: "La construcción de la antigua Aduana constituye uno de los pasos iniciales de la creación de la ciudad en el movimiento de cambio de capital hacia la ciudad de Aracaju. El edificio también albergó la Delegación de la Receita Federal de Sergipe, hoy se encuentra restaurado y bajo la Administración de la Prefectura Municipal de Aracaju, donde funciona el Centro Cultural Ciudad de Aracaju.",
    category: "historico",
    latitude: "-10.9089",
    longitude: "-37.0715",
    address: "Praça General Valadão, nº 134 - Aracaju",
    images: [],
    googleMapsLink: "https://maps.google.com/?q=-10.9089,-37.0715",
    features: {
      tombamento: "Decreto nº 21.765, de 9 de abril de 2003",
      tipo: "Arquitetura civil urbana de caráter institucional, segunda metade do século XIX, reformado no início do século XX"
    }
  },

  // 22. Prédio da Antiga Estação Rodoviária "Governador Luiz Garcia"
  {
    name_pt: "Prédio da Antiga Estação Rodoviária \"Governador Luiz Garcia\"",
    description_pt: "O surgimento desse monumento se deu após a derrubada do Morro do Bonfim. O então Governador Luiz Garcia resolve criar esse espaço, fundado em janeiro de 1962. O monumento é um marco da cidade de Aracaju. Lugar de encontros, reencontros e despedidas. O terminal (hoje denominado pelos sergipanos de Rodoviária Velha) é ponto de referência até os dias atuais.",
    name_en: "Former \"Governor Luiz Garcia\" Bus Station Building",
    description_en: "The emergence of this monument occurred after the demolition of Morro do Bonfim. Then Governor Luiz Garcia decided to create this space, founded in January 1962. The monument is a landmark of the city of Aracaju. Place of meetings, reunions and farewells. The terminal (today called by Sergipanos as Old Bus Station) is a reference point to this day.",
    name_es: "Edificio de la Antigua Estación de Autobuses \"Gobernador Luiz Garcia\"",
    description_es: "El surgimiento de este monumento se dio después de la demolición del Morro do Bonfim. El entonces Gobernador Luiz Garcia resuelve crear este espacio, fundado en enero de 1962. El monumento es un hito de la ciudad de Aracaju. Lugar de encuentros, reencuentros y despedidas. La terminal (hoy denominada por los sergipanos como Terminal Vieja) es punto de referencia hasta los días actuales.",
    category: "cultura",
    latitude: "-10.9045",
    longitude: "-37.0598",
    address: "Praça João XIII - Centro Histórico de Aracaju",
    images: [],
    googleMapsLink: "https://maps.google.com/?q=-10.9045,-37.0598",
    features: {
      tombamento: "Decreto nº 21.766, de 9 de abril de 2003",
      tipo: "Arquitetura civil de função pública, segunda metade do século XX"
    }
  },

  // 23. Sede da Superintendência do IPHAN
  {
    name_pt: "Sede da Superintendência do IPHAN (Praça Camerino, nº 225)",
    description_pt: "Construída no início do século XX pelo proprietário Dr. Leonardo Gomes de Carvalho Leite. Atualmente a edificação abriga a sede da Superintendência do IPHAN em Sergipe. Representa importante exemplo da arquitetura civil residencial urbana do início do século XX.",
    name_en: "IPHAN Superintendency Headquarters (Camerino Square, nº 225)",
    description_en: "Built in the early 20th century by owner Dr. Leonardo Gomes de Carvalho Leite. Currently the building houses the headquarters of the IPHAN Superintendency in Sergipe. It represents an important example of urban residential civil architecture from the early 20th century.",
    name_es: "Sede de la Superintendencia del IPHAN (Plaza Camerino, nº 225)",
    description_es: "Construida a principios del siglo XX por el propietario Dr. Leonardo Gomes de Carvalho Leite. Actualmente el edificio alberga la sede de la Superintendencia del IPHAN en Sergipe. Representa un importante ejemplo de la arquitectura civil residencial urbana de principios del siglo XX.",
    category: "cultura",
    latitude: "-10.9012",
    longitude: "-37.0665",
    address: "Praça Camerino, nº 225 - Aracaju",
    images: [],
    googleMapsLink: "https://maps.google.com/?q=-10.9012,-37.0665",
    features: {
      tombamento: "Decreto nº 21.786, de 16 de abril de 2003",
      tipo: "Arquitetura civil residencial urbana, início do século XX"
    }
  },

  // 24. Escultura de Nossa Senhora da Conceição
  {
    name_pt: "Escultura de Nossa Senhora da Conceição",
    description_pt: "Imagem retratando Nossa Senhora da Conceição, padroeira da cidade de Aracaju. Escultura em concreto medindo 10 metros de altura, de autoria da artista plástica pernambucana, Vera Toledo. Inaugurada na primeira década do século XXI, dezembro de 2006. Localizada no Parque José Rollemberg Leite (Parque da Cidade).",
    name_en: "Sculpture of Our Lady of Conception",
    description_en: "Image depicting Our Lady of Conception, patron saint of the city of Aracaju. Concrete sculpture measuring 10 meters high, by Pernambuco plastic artist, Vera Toledo. Inaugurated in the first decade of the 21st century, December 2006. Located in José Rollemberg Leite Park (City Park).",
    name_es: "Escultura de Nuestra Señora de la Concepción",
    description_es: "Imagen retratando a Nuestra Señora de la Concepción, patrona de la ciudad de Aracaju. Escultura de concreto de 10 metros de altura, de autoría de la artista plástica pernambucana, Vera Toledo. Inaugurada en la primera década del siglo XXI, diciembre de 2006. Ubicada en el Parque José Rollemberg Leite (Parque de la Ciudad).",
    category: "cultura",
    latitude: "-10.9389",
    longitude: "-37.0456",
    address: "Parque José Rollemberg Leite (Parque da Cidade) - Aracaju",
    images: [],
    googleMapsLink: "https://maps.google.com/?q=-10.9389,-37.0456",
    features: {
      tombamento: "Decreto nº 24.158, de 28 de dezembro de 2006",
      tipo: "Escultura em concreto, 10 metros de altura",
      autoria: "Artista plástica Vera Toledo"
    }
  },

  // 25. Conjunto de Esculturas "Formadores da Nacionalidade"
  {
    name_pt: "Conjunto de Esculturas \"Formadores da Nacionalidade\"",
    description_pt: "Esculturas de vultos históricos compreendendo as de Joaquim José da Silva Xavier – O Tiradentes, D. Pedro II, Getúlio Vargas, Juscelino Kubitschek, Barão do Rio Branco, Duque de Caxias, José Bonifácio de Andrade da Silva, Princesa Izabel e Zumbi dos Palmares. Conjunto de esculturas de autoria do artista plástico Leo Santana, inaugurado em 2006.",
    name_en: "Sculpture Set \"Founders of Nationality\"",
    description_en: "Sculptures of historical figures including Joaquim José da Silva Xavier – Tiradentes, D. Pedro II, Getúlio Vargas, Juscelino Kubitschek, Baron of Rio Branco, Duke of Caxias, José Bonifácio de Andrade da Silva, Princess Isabel and Zumbi dos Palmares. Set of sculptures by plastic artist Leo Santana, inaugurated in 2006.",
    name_es: "Conjunto de Esculturas \"Formadores de la Nacionalidad\"",
    description_es: "Esculturas de figuras históricas que comprenden las de Joaquim José da Silva Xavier – Tiradentes, D. Pedro II, Getúlio Vargas, Juscelino Kubitschek, Barón de Rio Branco, Duque de Caxias, José Bonifácio de Andrade da Silva, Princesa Isabel y Zumbi dos Palmares. Conjunto de esculturas de autoría del artista plástico Leo Santana, inaugurado en 2006.",
    category: "cultura",
    latitude: "-10.9760",
    longitude: "-37.0560",
    address: "Orla Marítima de Aracaju, Praia de Atalaia",
    images: [],
    googleMapsLink: "https://maps.google.com/?q=-10.9760,-37.0560",
    features: {
      tombamento: "Decreto nº 24.148, de 21 de dezembro de 2006",
      tipo: "Conjunto de esculturas",
      autoria: "Artista plástico Leo Santana"
    }
  },

  // 26. Monumento aos 150 Anos de Fundação da Cidade de Aracaju
  {
    name_pt: "Monumento aos 150 Anos de Fundação da Cidade de Aracaju",
    description_pt: "Monumento projetado e executado pelo artista plástico Leo Santana, inaugurado na primeira década do século XXI/2006. Homenagem ao fundador da capital, Inácio Joaquim Barbosa. Localizado na Orla Marítima de Aracaju, Praia de Atalaia.",
    name_en: "Monument to the 150th Anniversary of the Foundation of the City of Aracaju",
    description_en: "Monument designed and executed by plastic artist Leo Santana, inaugurated in the first decade of the 21st century/2006. Tribute to the founder of the capital, Inácio Joaquim Barbosa. Located on the Maritime Waterfront of Aracaju, Atalaia Beach.",
    name_es: "Monumento a los 150 Años de Fundación de la Ciudad de Aracaju",
    description_es: "Monumento proyectado y ejecutado por el artista plástico Leo Santana, inaugurado en la primera década del siglo XXI/2006. Homenaje al fundador de la capital, Inácio Joaquim Barbosa. Ubicado en la Orla Marítima de Aracaju, Playa de Atalaia.",
    category: "cultura",
    latitude: "-10.9750",
    longitude: "-37.0565",
    address: "Orla Marítima de Aracaju, Praia de Atalaia",
    images: [],
    googleMapsLink: "https://maps.google.com/?q=-10.9750,-37.0565",
    features: {
      tombamento: "Decreto nº 24.149, de 21 de dezembro de 2006",
      autoria: "Artista plástico Leo Santana",
      inauguracao: "2006"
    }
  },

  // 27. Conjunto de Esculturas de Vultos Históricos (Espaço de Convivência Cultural)
  {
    name_pt: "Conjunto de Esculturas de Vultos Históricos (Espaço de Convivência Cultural)",
    description_pt: "Esculturas em bronze de autoria do artista plástico Otto Domovich retratando vultos históricos da cultura compreendendo as de Tobias Barreto, Silvio Romero, Manoel Joaquim Bomfim, Maurício Graccho Cardoso, Gumercindo Bessa, Gilberto Amado, José Calazans, Jackson Figueiredo, João Ribeiro e Horácio Hora. Conjunto inaugurado em dezembro de 2006.",
    name_en: "Set of Sculptures of Historical Figures (Cultural Coexistence Space)",
    description_en: "Bronze sculptures by plastic artist Otto Domovich depicting historical figures of culture including Tobias Barreto, Silvio Romero, Manoel Joaquim Bomfim, Maurício Graccho Cardoso, Gumercindo Bessa, Gilberto Amado, José Calazans, Jackson Figueiredo, João Ribeiro and Horácio Hora. Set inaugurated in December 2006.",
    name_es: "Conjunto de Esculturas de Figuras Históricas (Espacio de Convivencia Cultural)",
    description_es: "Esculturas en bronce de autoría del artista plástico Otto Domovich retratando figuras históricas de la cultura que comprenden las de Tobias Barreto, Silvio Romero, Manoel Joaquim Bomfim, Maurício Graccho Cardoso, Gumercindo Bessa, Gilberto Amado, José Calazans, Jackson Figueiredo, João Ribeiro y Horácio Hora. Conjunto inaugurado en diciembre de 2006.",
    category: "cultura",
    latitude: "-10.9755",
    longitude: "-37.0555",
    address: "Orla Marítima de Aracaju",
    images: [],
    googleMapsLink: "https://maps.google.com/?q=-10.9755,-37.0555",
    features: {
      tombamento: "Decreto nº 24.147, de 21 de dezembro de 2006",
      tipo: "Esculturas em bronze",
      autoria: "Artista plástico Otto Domovich"
    }
  },

  // 28. Prédio do Instituto Histórico e Geográfico de Sergipe (IHGS)
  {
    name_pt: "Prédio do Instituto Histórico e Geográfico de Sergipe (IHGS)",
    description_pt: "Criado em 06 de agosto de 1912, o Instituto foi chamado por muito tempo de 'Casa de Sergipe', sendo uma importante entidade envolvida na construção da identidade cultural do Estado. O edifício que atualmente abriga o IHGSE foi sede da antiga Rádio Difusora de Sergipe, a primeira emissora de rádio de Sergipe.",
    name_en: "Historical and Geographical Institute of Sergipe Building (IHGS)",
    description_en: "Created on August 6, 1912, the Institute was called for a long time 'Casa de Sergipe', being an important entity involved in building the cultural identity of the State. The building that currently houses the IHGSE was the headquarters of the old Radio Difusora de Sergipe, the first radio station in Sergipe.",
    name_es: "Edificio del Instituto Histórico y Geográfico de Sergipe (IHGS)",
    description_es: "Creado el 6 de agosto de 1912, el Instituto fue llamado por mucho tiempo 'Casa de Sergipe', siendo una importante entidad involucrada en la construcción de la identidad cultural del Estado. El edificio que actualmente alberga el IHGSE fue sede de la antigua Radio Difusora de Sergipe, la primera emisora de radio de Sergipe.",
    category: "cultura",
    latitude: "-10.9008",
    longitude: "-37.0647",
    address: "Rua Itabaianinha, nº 41 - Centro Histórico de Aracaju",
    images: [],
    googleMapsLink: "https://maps.google.com/?q=-10.9008,-37.0647",
    features: {
      tombamento: "Decreto nº 24.383, de 09 de maio de 2007",
      tipo: "Edificação do início do século XX"
    }
  },

  // 29. Núcleo de Construções Históricas do Instituto Parreiras Horta
  {
    name_pt: "Núcleo de Construções Históricas Originais do Instituto Parreiras Horta",
    description_pt: "O Instituto Parreiras Horta foi inaugurado no dia 05 de maio de 1924 no governo de Mauricio Graccho Cardoso. O Instituto foi construído para completar a nova estrutura de saúde pública estadual da época, tendo como principais atribuições o preparo e distribuição das vacinas antivariólica e antirrábica. Atualmente o edifício abriga a Fundação de Saúde Parreiras Horta.",
    name_en: "Original Historical Buildings Nucleus of the Parreiras Horta Institute",
    description_en: "The Parreiras Horta Institute was inaugurated on May 5, 1924 during the government of Mauricio Graccho Cardoso. The Institute was built to complete the new state public health structure of the time, with the main duties of preparing and distributing smallpox and rabies vaccines. Currently the building houses the Parreiras Horta Health Foundation.",
    name_es: "Núcleo de Construcciones Históricas Originales del Instituto Parreiras Horta",
    description_es: "El Instituto Parreiras Horta fue inaugurado el 5 de mayo de 1924 en el gobierno de Mauricio Graccho Cardoso. El Instituto fue construido para completar la nueva estructura de salud pública estatal de la época, teniendo como principales atribuciones la preparación y distribución de las vacunas antivariólica y antirrábica. Actualmente el edificio alberga la Fundación de Salud Parreiras Horta.",
    category: "historico",
    latitude: "-10.9125",
    longitude: "-37.0598",
    address: "Rua Campo do Brito, nº 551 – Bairro São José – Aracaju",
    images: [],
    googleMapsLink: "https://maps.google.com/?q=-10.9125,-37.0598",
    features: {
      tombamento: "Decreto nº 25.058, de 21 de fevereiro de 2008",
      tipo: "Edificação do início do século XX"
    }
  },

  // 30. Ponte do Imperador
  {
    name_pt: "Ponte do Imperador",
    description_pt: "A ponte foi construída em 1859 para recepcionar o Imperador D. Pedro II. Passou por diversas reformas e hoje é chamada de Ponte do Imperador. A plataforma de desembarque já foi conhecida como Ponte do Governador, Ponte Metálica, Ponte do Presidente e Ponte do Desembarque.",
    name_en: "Emperor's Bridge",
    description_en: "The bridge was built in 1859 to welcome Emperor D. Pedro II. It underwent various renovations and today is called the Emperor's Bridge. The landing platform was once known as Governor's Bridge, Metal Bridge, President's Bridge and Landing Bridge.",
    name_es: "Puente del Emperador",
    description_es: "El puente fue construido en 1859 para recibir al Emperador D. Pedro II. Pasó por varias reformas y hoy se llama Puente del Emperador. La plataforma de desembarco ya fue conocida como Puente del Gobernador, Puente Metálico, Puente del Presidente y Puente del Desembarco.",
    category: "historico", 
    latitude: "-10.9095",
    longitude: "-37.0720",
    address: "Av. Ivo do Prado, Aracaju",
    images: [],
    googleMapsLink: "https://maps.google.com/?q=-10.9095,-37.0720",
    features: {
      tombamento: "Decreto nº 29.556, de 23 de outubro de 2013",
      tipo: "Construção do século XIX, com diversas intervenções"
    }
  },

  // 31. Prédio do Cacique Chá
  {
    name_pt: "Prédio do Cacique Chá",
    description_pt: "Inaugurado em 1940, o Cacique Chá abrigou muitos eventos e foi um dos locais preferidos dos aracajuanos. O Cacique Chá foi durante anos ponto de encontro de intelectuais, jornalistas e políticos de Aracaju. Com seu fechamento, o espaço ficou abandonado, o que colocava em risco os afrescos de Jenner Augusto, grande artista sergipano que ilustrou com seus painéis pintados nas paredes do local a diversidade do povo sergipano.",
    name_en: "Cacique Chá Building",
    description_en: "Inaugurated in 1940, Cacique Chá hosted many events and was one of the favorite places of Aracaju residents. Cacique Chá was for years a meeting point for intellectuals, journalists and politicians from Aracaju. With its closure, the space was abandoned, which put at risk the frescoes by Jenner Augusto, a great Sergipe artist who illustrated with his panels painted on the walls the diversity of the Sergipe people.",
    name_es: "Edificio del Cacique Chá",
    description_es: "Inaugurado en 1940, el Cacique Chá albergó muchos eventos y fue uno de los lugares preferidos de los aracajuanos. El Cacique Chá fue durante años punto de encuentro de intelectuales, periodistas y políticos de Aracaju. Con su cierre, el espacio quedó abandonado, lo que ponía en riesgo los frescos de Jenner Augusto, gran artista sergipano que ilustró con sus paneles pintados en las paredes del lugar la diversidad del pueblo sergipano.",
    category: "cultura",
    latitude: "-10.9098",
    longitude: "-37.0716",
    address: "Praça Olímpio Campos, Aracaju",
    images: [],
    googleMapsLink: "https://maps.google.com/?q=-10.9098,-37.0716",
    features: {
      tombamento: "Decreto nº 29.557, de 23 de outubro de 2013",
      tipo: "Construção da primeira metade do século XX, com reformas"
    }
  },

  // 32. Prédio da Antiga Penitenciária
  {
    name_pt: "Prédio da Antiga Penitenciária",
    description_pt: "A antiga Penitenciária do Estado foi construída no governo de Graccho Cardoso, sendo inaugurada em outubro de 1926, com projeto do engenheiro Arthur Araújo. Antes chamado de Reformatório Penal do Estado, o espaço abrigava cerca de 180 internos e foi sofrendo deterioração em sua estrutura pela superlotação. Após ser reformada, a edificação abriga hoje a Escola de Gestão Penitenciária Professor Acrísio Cruz.",
    name_en: "Former Penitentiary Building",
    description_en: "The former State Penitentiary was built during the government of Graccho Cardoso, being inaugurated in October 1926, with a project by engineer Arthur Araújo. Previously called the State Penal Reformatory, the space housed about 180 inmates and suffered deterioration in its structure due to overcrowding. After being renovated, the building now houses the Professor Acrísio Cruz Penitentiary Management School.",
    name_es: "Edificio de la Antigua Penitenciaría",
    description_es: "La antigua Penitenciaría del Estado fue construida en el gobierno de Graccho Cardoso, siendo inaugurada en octubre de 1926, con proyecto del ingeniero Arthur Araújo. Antes llamado Reformatorio Penal del Estado, el espacio albergaba cerca de 180 internos y fue sufriendo deterioro en su estructura por el hacinamiento. Después de ser reformada, la edificación alberga hoy la Escuela de Gestión Penitenciaria Profesor Acrísio Cruz.",
    category: "historico",
    latitude: "-10.9456",
    longitude: "-37.0612",
    address: "Praça da Liberdade, Bairro América, Aracaju",
    images: [],
    googleMapsLink: "https://maps.google.com/?q=-10.9456,-37.0612",
    features: {
      tombamento: "Decreto nº 29.559, de 23 de outubro de 2013",
      tipo: "Construção de caráter oficial, início do século XX"
    }
  },

  // 33. Capela São João Batista
  {
    name_pt: "Capela São João Batista",
    description_pt: "Capela da segunda metade do século XIX, início do século XX. Propriedade da Família Franco. Localizada na Antiga Fábrica de Tecidos Sergipe Industrial. Local de sepultamento do Coronel José Ferras (falecido em 1906) e Dr. Thomaz Rodrigues da Cruz (falecido em 1919).",
    name_en: "São João Batista Chapel",
    description_en: "Chapel from the second half of the 19th century, early 20th century. Property of the Franco Family. Located in the Former Sergipe Industrial Textile Factory. Burial place of Colonel José Ferras (died in 1906) and Dr. Thomaz Rodrigues da Cruz (died in 1919).",
    name_es: "Capilla São João Batista",
    description_es: "Capilla de la segunda mitad del siglo XIX, principios del siglo XX. Propiedad de la Familia Franco. Ubicada en la Antigua Fábrica de Tejidos Sergipe Industrial. Lugar de sepultura del Coronel José Ferras (fallecido en 1906) y Dr. Thomaz Rodrigues da Cruz (fallecido en 1919).",
    category: "historico",
    latitude: "-10.9567",
    longitude: "-37.0423",
    address: "Antiga Fábrica de Tecidos Sergipe Industrial, Aracaju",
    images: [],
    googleMapsLink: "https://maps.google.com/?q=-10.9567,-37.0423",
    features: {
      tipo: "Construção da segunda metade do século XIX, início do século XX",
      propriedade: "Família Franco"
    }
  },

  // 34-39. Adicionando pontos adicionais da Orla para completar os 39
  {
    name_pt: "Orla de Atalaia",
    description_pt: "A Orla de Atalaia é um dos principais cartões postais de Aracaju, com extensa faixa de areia, coqueiros, ciclovia, passarela sobre o mar e diversos equipamentos de lazer. É considerada uma das praias urbanas mais bonitas do Brasil.",
    name_en: "Atalaia Waterfront",
    description_en: "Atalaia Waterfront is one of Aracaju's main postcards, with an extensive strip of sand, coconut trees, bike path, walkway over the sea and various leisure facilities. It is considered one of the most beautiful urban beaches in Brazil.",
    name_es: "Orla de Atalaia",
    description_es: "La Orla de Atalaia es una de las principales postales de Aracaju, con extensa franja de arena, cocoteros, ciclovía, pasarela sobre el mar y diversos equipamientos de ocio. Es considerada una de las playas urbanas más hermosas de Brasil.",
    category: "praia",
    latitude: "-10.9760",
    longitude: "-37.0560",
    address: "Orla de Atalaia, Aracaju - SE",
    images: [],
    googleMapsLink: "https://maps.google.com/?q=-10.9760,-37.0560",
    features: {
      tipo: "Praia urbana",
      equipamentos: ["Ciclovia", "Passarela", "Equipamentos de lazer", "Coqueiros"]
    }
  },

  {
    name_pt: "Mercado Municipal Antônio Franco",
    description_pt: "Mercado tradicional operando de segunda a sábado das 6h às 17h e domingo das 6h às 12h. Centro de comercialização de produtos locais, artesanato e gastronomia típica sergipana, representando importante patrimônio da cultura popular urbana.",
    name_en: "Antônio Franco Municipal Market",
    description_en: "Traditional market operating Monday to Saturday from 6am to 5pm and Sunday from 6am to 12pm. Center for commercialization of local products, handicrafts and typical Sergipe gastronomy, representing important heritage of urban popular culture.",
    name_es: "Mercado Municipal Antônio Franco",
    description_es: "Mercado tradicional que opera de lunes a sábado de 6h a 17h y domingo de 6h a 12h. Centro de comercialización de productos locales, artesanías y gastronomía típica sergipana, representando importante patrimonio de la cultura popular urbana.",
    category: "cultura",
    latitude: "-10.9178",
    longitude: "-37.0567",
    address: "Praça Graccho Cardoso, Centro, Aracaju - SE",
    images: [],
    googleMapsLink: "https://maps.google.com/?q=-10.9178,-37.0567",
    features: {
      horarios: "Seg-Sáb: 6h-17h, Dom: 6h-12h",
      tipo: "Mercado tradicional"
    }
  },

  {
    name_pt: "Oceanário (Projeto Tamar)",
    description_pt: "Centro de conservação marinha com tartarugas e tubarões. Programas educacionais sobre vida marinha e conservação. Horários de alimentação dos animais e atividades interativas para visitantes de todas as idades.",
    name_en: "Oceanarium (Tamar Project)",
    description_en: "Marine conservation center with turtles and sharks. Educational programs about marine life and conservation. Animal feeding times and interactive activities for visitors of all ages.",
    name_es: "Oceanario (Proyecto Tamar)",
    description_es: "Centro de conservación marina con tortugas y tiburones. Programas educativos sobre vida marina y conservación. Horarios de alimentación de animales y actividades interactivas para visitantes de todas las edades.",
    category: "cultura",
    latitude: "-10.9467",
    longitude: "-37.0728",
    address: "Av. Santos Dumont, Orla de Atalaia, Aracaju - SE",
    images: [],
    googleMapsLink: "https://maps.google.com/?q=-10.9467,-37.0728",
    features: {
      horarios: "Terça a domingo, 9h às 17h",
      entrada: "Gratuita",
      programas: "Educacionais"
    }
  },

  {
    name_pt: "Complexo Histórico da Praça Fausto Cardoso",
    description_pt: "Complexo histórico incluindo Escola Legislativa, Palácio-Museu Olímpio Campos, Palácio da Justiça, Assembleia Legislativa e Ponte do Imperador. Centro do poder político sergipano com arquitetura do século XIX e importante conjunto patrimonial.",
    name_en: "Fausto Cardoso Square Historic Complex",
    description_en: "Historic complex including Legislative School, Olímpio Campos Palace-Museum, Palace of Justice, Legislative Assembly and Emperor's Bridge. Center of Sergipe political power with 19th century architecture and important heritage ensemble.",
    name_es: "Complejo Histórico de la Plaza Fausto Cardoso",
    description_es: "Complejo histórico que incluye Escuela Legislativa, Palacio-Museo Olímpio Campos, Palacio de Justicia, Asamblea Legislativa y Puente del Emperador. Centro del poder político sergipano con arquitectura del siglo XIX e importante conjunto patrimonial.",
    category: "historico",
    latitude: "-10.9091",
    longitude: "-37.0677",
    address: "Praça Fausto Cardoso, Centro, Aracaju - SE",
    images: [],
    googleMapsLink: "https://maps.google.com/?q=-10.9091,-37.0677",
    features: {
      horarios: "Segunda a sexta, 8h às 17h",
      tipo: "Complexo histórico"
    }
  },

  {
    name_pt: "Parque Governador Antonio Carlos Valadares",
    description_pt: "Parque moderno com academia ao ar livre, pistas de caminhada e esportes aquáticos no Rio Poxim. Área de lazer com vista privilegiada para o rio, equipamentos de ginástica e espaços para atividades físicas e contemplação da natureza urbana.",
    name_en: "Governor Antonio Carlos Valadares Park",
    description_en: "Modern park with outdoor gym, walking tracks and water sports on Poxim River. Leisure area with privileged view of the river, gym equipment and spaces for physical activities and urban nature contemplation.",
    name_es: "Parque Gobernador Antonio Carlos Valadares",
    description_es: "Parque moderno con gimnasio al aire libre, pistas de caminata y deportes acuáticos en el Río Poxim. Área de ocio con vista privilegiada del río, equipamientos de gimnasia y espacios para actividades físicas y contemplación de la naturaleza urbana.",
    category: "cultura",
    latitude: "-10.9389",
    longitude: "-37.0456",
    address: "Av. Beira Mar, Jardins, Aracaju - SE",
    images: [],
    googleMapsLink: "https://maps.google.com/?q=-10.9389,-37.0456",
    features: {
      horarios: "6h às 20h",
      entrada: "Gratuita",
      atividades: ["Academia", "Caminhada", "Esportes aquáticos"]
    }
  },

  {
    name_pt: "Arcos da Orla",
    description_pt: "Marcos arquitetônicos da Orla de Atalaia, simbolizando a porta de entrada para a praia mais famosa de Aracaju. Estrutura icônica que se tornou símbolo da modernização turística da cidade e ponto de referência para visitantes.",
    name_en: "Waterfront Arches",
    description_en: "Architectural landmarks of Atalaia Waterfront, symbolizing the gateway to Aracaju's most famous beach. Iconic structure that became a symbol of the city's tourist modernization and a reference point for visitors.",
    name_es: "Arcos de la Orla",
    description_es: "Marcos arquitectónicos de la Orla de Atalaia, simbolizando la puerta de entrada a la playa más famosa de Aracaju. Estructura icónica que se convirtió en símbolo de la modernización turística de la ciudad y punto de referencia para visitantes.",
    category: "cultura",
    latitude: "-10.9761",
    longitude: "-37.0542",
    address: "Orla de Atalaia, Aracaju - SE",
    images: [],
    googleMapsLink: "https://maps.google.com/?q=-10.9761,-37.0542",
    features: {
      tipo: "Marco arquitetônico",
      acesso: "24 horas"
    }
  }
];

export default aracajuOfficialSpotsComplete;