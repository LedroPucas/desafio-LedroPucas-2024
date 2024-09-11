class Zoologico {
    constructor() {
      this.recintos = [
        { numero: 1, bioma: 'savana', tamanhoTotal: 10, animais: [{ especie: 'MACACO', quantidade: 3, carnivoro: false }] },
        { numero: 2, bioma: 'floresta', tamanhoTotal: 5, animais: [] },
        { numero: 3, bioma: 'savana e rio', tamanhoTotal: 7, animais: [{ especie: 'GAZELA', quantidade: 1, carnivoro: false }] },
        { numero: 4, bioma: 'rio', tamanhoTotal: 8, animais: [] },
        { numero: 5, bioma: 'savana', tamanhoTotal: 9, animais: [{ especie: 'LEAO', quantidade: 1, carnivoro: true }] }
      ];
  
      this.animaisInfo = {
        LEAO: { tamanho: 3, bioma: ['savana'], carnivoro: true },
        LEOPARDO: { tamanho: 2, bioma: ['savana'], carnivoro: true },
        CROCODILO: { tamanho: 3, bioma: ['rio'], carnivoro: true },
        MACACO: { tamanho: 1, bioma: ['savana', 'floresta'], carnivoro: false },
        GAZELA: { tamanho: 2, bioma: ['savana'], carnivoro: false },
        HIPOPOTAMO: { tamanho: 4, bioma: ['savana', 'rio'], carnivoro: false }
      };
    }
  
    analisaRecintos(especie, quantidade) {
      // Validações iniciais
      if (!this.animaisInfo[especie]) {
        return { erro: "Animal inválido" };
      }
  
      if (quantidade <= 0 || !Number.isInteger(quantidade)) {
        return { erro: "Quantidade inválida" };
      }
  
      const infoAnimal = this.animaisInfo[especie];
      const totalTamanhoNecessario = infoAnimal.tamanho * quantidade;
      let recintosViaveis = [];
  
      // Verificar cada recinto para ver se o animal cabe
      this.recintos.forEach((recinto) => {
        const espacoOcupado = recinto.animais.reduce((acc, animal) => {
          return acc + (animal.quantidade * this.animaisInfo[animal.especie].tamanho);
        }, 0);
  
        const espacoDisponivel = recinto.tamanhoTotal - espacoOcupado;
        const recintoCarnivoro = recinto.animais.some(a => this.animaisInfo[a.especie].carnivoro);
  
        // Verificar se o bioma é adequado
        if (!infoAnimal.bioma.includes(recinto.bioma) && !(recinto.bioma === 'savana e rio' && infoAnimal.bioma.includes('savana'))) {
          return;
        }
  
        // Regra: Carnívoros só podem ficar com a própria espécie
        if (infoAnimal.carnivoro && recinto.animais.length > 0 && recintoCarnivoro && recinto.animais[0].especie !== especie) {
          return;
        }
  
        // Verificar se os animais existentes continuam confortáveis
        const totalTamanhoComNovos = espacoOcupado + totalTamanhoNecessario + (recinto.animais.length > 0 && recinto.animais[0].especie !== especie ? 1 : 0);
        if (totalTamanhoComNovos > recinto.tamanhoTotal) {
          return;
        }
  
        // Regra: Hipopótamos só podem dividir espaço se estiverem em um bioma savana e rio
        if (especie === 'HIPOPOTAMO' && recinto.bioma !== 'savana e rio' && recinto.animais.length > 0) {
          return;
        }
  
        // Regra: Macaco não fica confortável sozinho
        if (especie === 'MACACO' && recinto.animais.length === 0) {
          return;
        }
  
        // Se o recinto for adequado, adicionar à lista de recintos viáveis
        recintosViaveis.push(`Recinto ${recinto.numero} (espaço livre: ${recinto.tamanhoTotal - totalTamanhoComNovos} total: ${recinto.tamanhoTotal})`);
      });
  
      // Se nenhum recinto for viável
      if (recintosViaveis.length === 0) {
        return { erro: "Não há recinto viável" };
      }
  
      // Ordenar recintos viáveis por número e retornar
      return { recintosViaveis: recintosViaveis.sort() };
    }
  }
  
  // Exemplo de uso
  const zoologico = new Zoologico();
  console.log(zoologico.analisaRecintos('LEAO', 1));  // Exemplo de teste com leão
  console.log(zoologico.analisaRecintos('HIPOPOTAMO', 1));  // Exemplo de teste com hipopótamo
  console.log(zoologico.analisaRecintos('MACACO', 5));  // Exemplo de teste com macaco
  console.log(zoologico.analisaRecintos('GIRAFA', 1));  // Animal inválido
  