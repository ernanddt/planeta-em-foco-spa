import { Component, Input, Output, EventEmitter, AfterViewInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-calculadora-modal",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./calculadora-modal.component.html",
  styleUrls: ["./calculadora-modal.component.scss"],
})
export class CalculadoraModalComponent implements AfterViewInit {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  // Transporte
  vehicleType = 'car'; // car, motorcycle
  vehicleKmPerMonth = 0;

  // Energia
  electricityKwhPerMonth = 0;
  electricitySource = 'grid'; // grid, solar, wind, hydro

  // Alimentação
  dietType = 'omnivore'; // omnivore, vegetarian, vegan
  beefMealsPerWeek = 0;
  dairyServingsPerDay = 0;

  // Consumo
  goodsServicesSpendPerMonth = 0; // in local currency (simplified)
  wasteRecycling = false; // whether they recycle

  // Results
  resultado = 0;
  transporteEmission = 0;
  energiaEmission = 0;
  alimentacaoEmission = 0;
  consumoEmission = 0;
  feedback = "";
  cor = "";

  constructor(private router: Router) {}

  ngAfterViewInit() {
    if (this.visible) {
      this.focusFirstInput();
    }
  }

  ngOnChanges() {
    if (this.visible) {
      setTimeout(() => this.focusFirstInput(), 0);
    }
  }

  focusFirstInput() {
    const firstInput = document.querySelector('.modal-content input, .modal-content select');
    if (firstInput) {
      (firstInput as HTMLElement).focus();
    }
  }

  calcular() {
    // Calculate CO2 emissions using simplified monthly factors

    // Transporte
    let vehicleFactor = 0;
    switch (this.vehicleType) {
      case 'car':
        vehicleFactor = 0.12; // kg CO2 per km
        break;
      case 'motorcycle':
        vehicleFactor = 0.08;
        break;
    }
    this.transporteEmission = (this.vehicleKmPerMonth * vehicleFactor) / 1000; // tCO2

    // Energia
    let energyFactor = 0.08; // average grid kg CO2 per kWh
    switch (this.electricitySource) {
      case 'solar':
        energyFactor = 0.02;
        break;
      case 'wind':
        energyFactor = 0.01;
        break;
      case 'hydro':
        energyFactor = 0.015;
        break;
      case 'grid':
      default:
        energyFactor = 0.08;
    }
    this.energiaEmission = (this.electricityKwhPerMonth * energyFactor) / 1000; // tCO2

    // Alimentação
    let dietBase = 1.5; // base tCO2 for vegetarian/vegan
    switch (this.dietType) {
      case 'omnivore':
        dietBase = 2.5;
        break;
      case 'vegetarian':
        dietBase = 1.5;
        break;
      case 'vegan':
        dietBase = 0.8;
        break;
    }
    // Add beef impact (high emission food)
    const beefEmission = this.beefMealsPerWeek * 0.05 * 4; // weekly to monthly (approx 4 weeks)
    // Add dairy impact
    const dairyEmission = this.dairyServingsPerDay * 0.002 * 30; // daily to monthly
    this.alimentacaoEmission = dietBase + (beefEmission + dairyEmission) / 1000; // convert kg to t

    // Consumo (simplified based on spending)
    // Assuming 0.4 kg CO2 per dollar spent
    this.consumoEmission = (this.goodsServicesSpendPerMonth * 0.4) / 1000; // tCO2

    // Adjust for recycling (reduces emissions by ~20%)
    if (this.wasteRecycling) {
      this.consumoEmission *= 0.8;
    }

    // Total
    this.resultado = this.transporteEmission + this.energiaEmission + this.alimentacaoEmission + this.consumoEmission;
    this.setFeedback();
  }

  setFeedback() {
    if (this.resultado < 0.5) {
      this.feedback = "EXCELENTE!";
      this.cor = "#00a86b";
    } else if (this.resultado < 1.0) {
      this.feedback = "BOM!";
      this.cor = "#7cb342";
    } else if (this.resultado < 1.5) {
      this.feedback = "MÉDIO";
      this.cor = "#fbc02d";
    } else if (this.resultado < 2.0) {
      this.feedback = "ALTO";
      this.cor = "#f57c00";
    } else {
      this.feedback = "MUITO ALTO";
      this.cor = "#d32f2f";
    }
  }

  fechar() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  verAcoes() {
    this.fechar();
    this.router.navigate(["/acoes"]);
  }
}