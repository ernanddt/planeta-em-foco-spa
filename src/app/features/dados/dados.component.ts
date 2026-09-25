import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import Chart from 'chart.js/auto';
import { ClimaService } from '../../core/services/clima.service';

@Component({
  selector: 'app-dados',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dados.component.html',
  styleUrls: ['./dados.component.scss']
})
export class DadosComponent implements OnInit, OnDestroy {
  @ViewChild('emissoesChart') emissoesChart!: ElementRef;
  @ViewChild('temperaturaChart') temperaturaChart!: ElementRef;

  chartEmissoes: Chart | null = null;
  chartTemperatura: Chart | null = null;

  dadosClimaticos = {
    anos: [2000, 2005, 2010, 2015, 2020, 2025],
    emissoesCO2: [24.0, 27.5, 29.8, 32.1, 34.0, 35.2],  // Gt CO₂
    temperaturaAumento: [0.0, 0.2, 0.4, 0.6, 0.8, 1.1]   // °C
  };

  constructor(private climaService: ClimaService) {}

  get dadosFromAPI(): boolean {
    return this.climaService.dadosFromAPI;
  }

  async ngOnInit() {
    // Busca dados da API com fallback
    this.dadosClimaticos = await this.climaService.obterDadosClimaticos();
    this.criarGraficoEmissoes();
    this.criarGraficoTemperatura();
  }

  criarGraficoEmissoes() {
    const ctx = (this.emissoesChart.nativeElement as HTMLCanvasElement).getContext('2d');

    if (ctx) {
      this.chartEmissoes = new Chart(ctx, {
        type: 'line',
        data: {
          labels: this.dadosClimaticos.anos,
          datasets: [{
            label: 'Emissões de CO₂ (Gt)',
            data: this.dadosClimaticos.emissoesCO2,
            borderColor: '#d32f2f',
            backgroundColor: 'rgba(211, 47, 47, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointRadius: 6,
            pointBackgroundColor: '#d32f2f',
            pointBorderColor: '#fff',
            pointBorderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: {
              beginAtZero: false,
              ticks: { color: '#666' }
            },
            x: {
              ticks: { color: '#666' }
            }
          }
        }
      });
    }
  }

  criarGraficoTemperatura() {
    const ctx = (this.temperaturaChart.nativeElement as HTMLCanvasElement).getContext('2d');

    if (ctx) {
      this.chartTemperatura = new Chart(ctx, {
        type: 'line',
        data: {
          labels: this.dadosClimaticos.anos,
          datasets: [{
            label: 'Aumento da Temperatura (°C)',
            data: this.dadosClimaticos.temperaturaAumento,
            borderColor: '#f9a825',
            backgroundColor: 'rgba(249, 168, 37, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointRadius: 6,
            pointBackgroundColor: '#f9a825',
            pointBorderColor: '#fff',
            pointBorderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { color: '#666' }
            },
            x: {
              ticks: { color: '#666' }
            }
          }
        }
      });
    }
  }

  ngOnDestroy() {
    if (this.chartEmissoes) this.chartEmissoes.destroy();
    if (this.chartTemperatura) this.chartTemperatura.destroy();
  }
}