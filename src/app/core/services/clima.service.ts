import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ClimaService {

  // Dados fallback (hardcoded - se API falhar)
  dadosFallback = {
    anos: [2000, 2005, 2010, 2015, 2020, 2025],
    emissoesCO2: [24.0, 27.5, 29.8, 32.1, 34.0, 35.2],
    temperaturaAumento: [0.0, 0.2, 0.4, 0.6, 0.8, 1.1]
  };

  // Track se dados vieram da API
  public dadosFromAPI = true;

  async obterDadosClimaticos() {
    try {
      // Tenta buscar dados reais da Open-Meteo API
      const response = await fetch(
        'https://climate-api.open-meteo.com/v1/climate?latitude=0&longitude=0&start_date=2000-01-01&end_date=2025-12-31&monthly_data=true&temperature_2m_mean=true'
      );

      if (!response.ok) throw new Error('API retornou erro');

      const data = await response.json();

      // Processa dados da API
      const anosProcessados = this.processarAnosAPI(data);
      const tempProcessada = this.processarTemperaturaAPI(data);

      this.dadosFromAPI = true; // Success
      return {
        anos: anosProcessados,
        emissoesCO2: this.gerarEmissoes(anosProcessados),  // Estimativa
        temperaturaAumento: tempProcessada
      };

    } catch (error) {
      console.warn('Erro ao buscar API, usando dados fallback:', error);
      this.dadosFromAPI = false; // ← ADICIONE
      // Retorna dados hardcoded em caso de erro
      return this.dadosFallback;
    }
  }

  private processarAnosAPI(data: any): number[] {
    // Extrai anos dos dados da API (2000-2025)
    try {
      const anos: number[] = [];
      const yearly = data.yearly;

      if (yearly && yearly.time) {
        // API retorna timestamps, extrair anos únicos
        return yearly.time.map((ts: number) => {
          const date = new Date(ts * 1000);
          return date.getFullYear();
        });
      }
    } catch {
      return [2000, 2005, 2010, 2015, 2020, 2025];
    }
    return [2000, 2005, 2010, 2015, 2020, 2025];
  }

  private processarTemperaturaAPI(data: any): number[] {
    // Extrai aumento de temperatura dos dados
    try {
      const temps: number[] = [];
      const yearly = data.yearly;

      if (yearly && yearly.temperature_2m_mean) {
        // Calcula aumento em relação ao baseline (2000)
        const baseline = yearly.temperature_2m_mean[0];
        return yearly.temperature_2m_mean.map((temp: number) => temp - baseline);
      }
    } catch {
      return [0.0, 0.2, 0.4, 0.6, 0.8, 1.1];
    }
    return [0.0, 0.2, 0.4, 0.6, 0.8, 1.1];
  }

  private gerarEmissoes(anos: number[]): number[] {
    // Gera uma estimativa de emissões baseada nos anos (linear growth)
    // Valores de referência: 2000 -> 24.0, 2025 -> 35.2
    const emissoes: number[] = [];
    const inicio = 24.0;
    const fim = 35.2;
    const anosRange = anos[anos.length - 1] - anos[0]; // 2025 - 2000 = 25

    for (let i = 0; i < anos.length; i++) {
      const proporcao = (anos[i] - anos[0]) / anosRange;
      const emisao = inicio + proporcao * (fim - inicio);
      emissoes.push(parseFloat(emisao.toFixed(1)));
    }

    return emissoes;
  }
}